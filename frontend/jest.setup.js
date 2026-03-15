// Jest setup for Expo + React Native

// FIX 1: Define EXPO_OS explicitly (Mandatory)
process.env.EXPO_OS = "ios";
process.env.EXPO_PLATFORM = "ios";

// Fix for "The global process.env.EXPO_OS is not defined" warning (redundant but safe)
if (!process.env.EXPO_OS) {
  process.env.EXPO_OS = "ios";
}

// Testing Library matchers for React Native
require("@testing-library/jest-native/extend-expect");

// React 19 compatibility fixes
global.React = require("react");

// FIX 2: Mock Expo Modules (Hard Isolation)
jest.mock("expo-local-authentication", () => ({
  hasHardwareAsync: jest.fn(async () => true),
  isEnrolledAsync: jest.fn(async () => true),
  authenticateAsync: jest.fn(async () => ({
    success: true,
  })),
}));

jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {},
  },
}));

jest.mock("expo-crypto", () => ({
  randomBytes: jest.fn(() => ({
    __b: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
  })),
}));

// FIX 4: Enforce AsyncStorage Mock Order (before any imports)
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// FIX 3: Mock ConnectionManager to prevent initialization during tests
jest.mock("./src/services/connectionManager", () => ({
  default: {
    getInstance: jest.fn(() => ({
      isHealthy: true,
      backendUrl: "http://mock:8001",
      backendPort: 8001,
      backendIp: "mock",
      lastChecked: new Date().toISOString(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      initialize: jest.fn().mockResolvedValue(undefined),
    })),
  },
  ConnectionManager: {
    getInstance: jest.fn(() => ({
      isHealthy: true,
      backendUrl: "http://mock:8001",
      backendPort: 8001,
      backendIp: "mock",
      lastChecked: new Date().toISOString(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      initialize: jest.fn().mockResolvedValue(undefined),
    })),
  },
}));

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, {}, children),
    SafeAreaView: ({ children, style }) =>
      React.createElement(View, { style }, children),
    useSafeAreaInsets: () => inset,
    initialWindowMetrics: {
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets: inset,
    },
  };
});

// Mock react-native-mmkv to avoid NitroModules error
jest.mock("react-native-mmkv", () => ({
  createMMKV: jest.fn(() => ({
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(() => []),
    contains: jest.fn(() => false),
  })),
}));

// Mock SecureStore to avoid native module dependencies in unit tests
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  Stack: {
    Screen: jest.fn(() => null),
  },
  Link: jest.fn(({ children }) => children),
}));

// Mock expo-linear-gradient
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }) => children,
}));

// Mock expo-blur
jest.mock("expo-blur", () => ({
  BlurView: ({ children }) => children,
}));

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

// React Native Worklets 0.7+ requires its dedicated Jest mock before Reanimated.
jest.mock("react-native-worklets", () =>
  require("react-native-worklets/lib/module/mock")
);

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
  MaterialIcons: "MaterialIcons",
  FontAwesome: "FontAwesome",
}));

jest.mock("@expo/vector-icons/Ionicons", () => {
  const React = require("react");
  const MockIcon = ({ children, ...props }) =>
    React.createElement("Ionicons", props, children);
  MockIcon.displayName = "Ionicons";
  MockIcon.glyphMap = {};

  return {
    __esModule: true,
    default: MockIcon,
  };
});

jest.mock("@expo/vector-icons/MaterialCommunityIcons", () => {
  const React = require("react");
  const MockIcon = ({ children, ...props }) =>
    React.createElement("MaterialCommunityIcons", props, children);
  MockIcon.displayName = "MaterialCommunityIcons";
  MockIcon.glyphMap = {};

  return {
    __esModule: true,
    default: MockIcon,
  };
});

// Mock react-native-svg
jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props) => React.createElement(View, props),
    Circle: (props) => React.createElement(View, props),
    Line: (props) => React.createElement(View, props),
    Path: (props) => React.createElement(View, props),
    Defs: (props) => React.createElement(View, props),
    Pattern: (props) => React.createElement(View, props),
    Rect: (props) => React.createElement(View, props),
    LinearGradient: (props) => React.createElement(View, props),
    Stop: (props) => React.createElement(View, props),
    Svg: (props) => React.createElement(View, props),
  };
});

// FIX 5: Silence Logs Intentionally (Not Blanket)
beforeAll(() => {
  const originalWarn = console.warn.bind(console);
  jest.spyOn(console, "warn").mockImplementation((msg, ...args) => {
    if (
      typeof msg === "string" &&
      msg.includes("EXPO_OS is not defined")
    ) {
      return;
    }
    originalWarn(msg, ...args);
  });
});

// Mock Modal component to avoid "window is not defined" error in tests
jest.mock("react-native/Libraries/Modal/Modal", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MockModal = ({ children, visible, ...props }) => {
    if (!visible) return null;
    return React.createElement(
      View,
      { testID: "modal", ...props },
      children,
    );
  };
  MockModal.displayName = "Modal";
  return {
    __esModule: true,
    default: MockModal,
  };
});
