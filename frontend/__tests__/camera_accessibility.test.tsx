import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { CameraControls } from '../src/components/camera/CameraControls';

describe('CameraControls Accessibility', () => {
    const mockProps = {
        torchEnabled: false,
        zoom: 0,
        onToggleTorch: jest.fn(),
        onZoomIn: jest.fn(),
        onZoomOut: jest.fn(),
        onResetZoom: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders torch button with correct accessibility label', () => {
        const { getByLabelText } = render(<CameraControls {...mockProps} />);
        expect(getByLabelText('Turn flash on')).toBeTruthy();
    });

    it('updates torch accessibility label when enabled', () => {
        const { getByLabelText } = render(<CameraControls {...mockProps} torchEnabled={true} />);
        expect(getByLabelText('Turn flash off')).toBeTruthy();
    });

    it('renders zoom buttons with correct accessibility labels', () => {
        const { getByLabelText } = render(<CameraControls {...mockProps} />);
        expect(getByLabelText('Zoom in')).toBeTruthy();
        expect(getByLabelText('Zoom out')).toBeTruthy();
    });

    it('renders reset zoom button with correct accessibility label', () => {
        const { getByLabelText } = render(<CameraControls {...mockProps} />);
        expect(getByLabelText('Reset zoom level')).toBeTruthy();
    });

    it('includes accessibility hints', () => {
        const { getByLabelText } = render(<CameraControls {...mockProps} />);
        const torchBtn = getByLabelText('Turn flash on');
        expect(torchBtn.props.accessibilityHint).toBe('Double tap to toggle camera flash');
    });
});
