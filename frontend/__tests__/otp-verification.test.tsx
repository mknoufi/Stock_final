import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import OtpVerificationScreen from '../app/otp-verification';
import { useRouter, useLocalSearchParams } from 'expo-router';
import apiClient from '../src/services/httpClient';
import { ROUTES } from '../src/constants/routes';
import { ThemeProvider } from '../src/context/ThemeContext';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
  Stack: {
    Screen: jest.fn(() => null),
  },
}));

jest.mock('../src/components/auth/AuthScreenShell', () => {
  const { View, Text } = require('react-native');
  return {
    AuthScreenShell: ({ children, title, subtitle, headerTitle, headerSubtitle }: any) => (
      <View testID="auth-screen-shell">
        <Text>{headerTitle}</Text>
        <Text>{headerSubtitle}</Text>
        <Text>{title}</Text>
        <Text>{subtitle}</Text>
        {children}
      </View>
    ),
  };
});

jest.mock('../src/components/ui/ModernCard', () => {
  const { View } = require('react-native');
  const MockCard = ({ children }: any) => <View testID="modern-card">{children}</View>;
  return {
    __esModule: true,
    default: MockCard,
    ModernCard: MockCard,
  };
});

jest.mock('../src/components/ui/ModernInput', () => {
  const { TextInput, View, Text } = require('react-native');
  const MockInput = (props: any) => (
    <View>
      <TextInput testID="modern-input" {...props} />
      {props.error && <Text>{props.error}</Text>}
    </View>
  );
  return {
    __esModule: true,
    default: MockInput,
    ModernInput: MockInput,
  };
});

jest.mock('../src/components/ui/ModernButton', () => {
  const { Pressable, Text } = require('react-native');
  const MockButton = (props: any) => (
    <Pressable testID="modern-button" onPress={props.onPress} disabled={props.disabled}>
      <Text>{props.title}</Text>
    </Pressable>
  );
  return {
    __esModule: true,
    default: MockButton,
    ModernButton: MockButton,
  };
});

jest.mock('../src/services/httpClient', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('../src/services/logging', () => ({
  createLogger: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }),
}));

describe('OtpVerificationScreen', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    );
  };

  it('renders correctly with phone identifier', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      identifier: '+1234567890',
      method: 'phone',
    });

    const { getByText, getByPlaceholderText } = renderWithTheme(<OtpVerificationScreen />);

    expect(getByText('Verify OTP')).toBeTruthy();
    expect(getByText(/We sent a 6-digit code to the WhatsApp number associated with \+1234567890/)).toBeTruthy();
    expect(getByPlaceholderText('123456')).toBeTruthy();
  });

  it('renders correctly with username identifier', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      identifier: 'testuser',
      method: 'username',
    });

    const { getByText } = renderWithTheme(<OtpVerificationScreen />);

    expect(getByText(/We sent a 6-digit code to the WhatsApp number associated with testuser/)).toBeTruthy();
  });

  it('validates OTP input (numeric only and length limit)', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ identifier: '+1234567890' });
    const { getByPlaceholderText } = renderWithTheme(<OtpVerificationScreen />);
    const input = getByPlaceholderText('123456');

    // Test non-numeric input
    fireEvent.changeText(input, 'abc');
    expect(input.props.value).toBe('');

    // Test numeric input
    fireEvent.changeText(input, '123');
    expect(input.props.value).toBe('123');

    // Test max length behavior (component allows max 6 chars logic)
    fireEvent.changeText(input, '123456');
    expect(input.props.value).toBe('123456');
  });

  it('timer counts down', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ identifier: '+1234567890' });
    const { getByText } = renderWithTheme(<OtpVerificationScreen />);

    // Initial timer text (5:00)
    expect(getByText('Code expires in 5:00')).toBeTruthy();

    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getByText('Code expires in 4:59')).toBeTruthy();

    // Advance timer by 1 minute
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    expect(getByText('Code expires in 3:59')).toBeTruthy();
  });

  it('verifies OTP successfully and navigates', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ identifier: '+1234567890', method: 'phone' });
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { reset_token: 'valid-reset-token' },
      },
    });

    const { getByPlaceholderText, getByText } = renderWithTheme(<OtpVerificationScreen />);
    const input = getByPlaceholderText('123456');
    const verifyButton = getByText('Verify Code');

    // Enter valid OTP
    fireEvent.changeText(input, '123456');

    // Press Verify
    fireEvent.press(verifyButton);

    // Wait for async action
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/api/auth/password-reset/verify', {
        phone: '+1234567890',
        otp: '123456',
      });
      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: ROUTES.RESET_PASSWORD,
        params: { reset_token: 'valid-reset-token' },
      });
    });
  });

  it('handles verification error', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ identifier: '+1234567890', method: 'phone' });
    const mockPost = apiClient.post as jest.Mock;
    // Mocking an error response that matches what axios/interceptor might return
    mockPost.mockRejectedValueOnce({
      response: {
        data: { message: 'Invalid OTP code' },
      },
      message: 'Request failed',
    });

    const { getByPlaceholderText, getByText, findByText } = renderWithTheme(<OtpVerificationScreen />);
    const input = getByPlaceholderText('123456');
    const verifyButton = getByText('Verify Code');

    fireEvent.changeText(input, '654321');
    fireEvent.press(verifyButton);

    const errorMessage = await findByText('Invalid OTP code');
    expect(errorMessage).toBeTruthy();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('handles verification failure (success: false)', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ identifier: '+1234567890', method: 'phone' });
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({
        data: {
            success: false,
            message: 'OTP Expired'
        }
    });

    const { getByPlaceholderText, getByText, findByText } = renderWithTheme(<OtpVerificationScreen />);
    const input = getByPlaceholderText('123456');
    const verifyButton = getByText('Verify Code');

    fireEvent.changeText(input, '123456');
    fireEvent.press(verifyButton);

    const errorMessage = await findByText('OTP Expired');
    expect(errorMessage).toBeTruthy();
  });

  it('handles missing identifier', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ identifier: undefined });

    // We mock console.error/warn if we want to avoid noise, but component sets error state.

    const { getByPlaceholderText, getByText, findByText } = renderWithTheme(<OtpVerificationScreen />);
    const input = getByPlaceholderText('123456');
    const verifyButton = getByText('Verify Code');

    fireEvent.changeText(input, '123456');
    fireEvent.press(verifyButton);

    const errorMessage = await findByText('Missing reset identifier. Please restart password reset.');
    expect(errorMessage).toBeTruthy();
    expect(apiClient.post).not.toHaveBeenCalled();
  });
});
