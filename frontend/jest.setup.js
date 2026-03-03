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

// Gesture Handler base Jest setup
require("react-native-gesture-handler/jestSetup");

// React 19 compatibility fixes
global.React = require("react");

// Prevent native animated code paths in Jest (avoids renderer/version coupling)
jest.mock("react-native/src/private/animated/NativeAnimatedHelper");

// Provide a lightweight mock for RNGH gesture APIs used in app screens/tests
jest.mock("react-native-gesture-handler", () => {
  const React = require("react");
  const { View } = require("react-native");

  const chainableGesture = () => {
    const api = {
      onBegin: () => api,
      onStart: () => api,
      onUpdate: () => api,
      onEnd: () => api,
      onFinalize: () => api,
      onTouchesDown: () => api,
      onTouchesMove: () => api,
      onTouchesUp: () => api,
      enabled: () => api,
      runOnJS: () => api,
      withTestId: () => api,
      minDistance: () => api,
      activeOffsetX: () => api,
      activeOffsetY: () => api,
      simultaneousWithExternalGesture: () => api,
      requireExternalGestureToFail: () => api,
    };
    return api;
  };

  const Gesture = {
    Pan: chainableGesture,
    Tap: chainableGesture,
    LongPress: chainableGesture,
    Fling: chainableGesture,
    Race: (..._gestures) => chainableGesture(),
    Simultaneous: (..._gestures) => chainableGesture(),
    Exclusive: (..._gestures) => chainableGesture(),
  };

  const passthrough = ({ children, ...props }) =>
    React.createElement(View, props, children);

  return {
    __esModule: true,
    Gesture,
    GestureDetector: passthrough,
    GestureHandlerRootView: passthrough,
    Swipeable: passthrough,
    DrawerLayout: passthrough,
    ScrollView: passthrough,
    FlatList: passthrough,
    TouchableOpacity: passthrough,
    State: {},
    Directions: {},
  };
});

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
  randomUUID: jest.fn(() => "00000000-0000-4000-8000-000000000000"),
  randomBytes: jest.fn(() => ({
    __b: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
  })),
}));

jest.mock("@react-native-community/netinfo", () => {
  const state = {
    type: "wifi",
    isConnected: true,
    isInternetReachable: true,
    details: null,
  };

  const addEventListener = jest.fn((listener) => {
    if (typeof listener === "function") {
      listener(state);
    }
    return () => {};
  });
  const fetch = jest.fn(async () => state);
  const refresh = jest.fn(async () => state);
  const configure = jest.fn();
  const useNetInfo = jest.fn(() => state);

  return {
    __esModule: true,
    default: {
      addEventListener,
      fetch,
      refresh,
      configure,
      useNetInfo,
    },
    addEventListener,
    fetch,
    refresh,
    configure,
    useNetInfo,
  };
});

// FIX 4: Enforce AsyncStorage Mock Order (before any imports)
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// FIX 3: Mock ConnectionManager to prevent initialization during tests
jest.mock("./src/services/connectionManager", () => ({
  __esModule: true,
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
    SafeAreaView: ({ children, style }) => React.createElement(View, { style }, children),
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

// Mock mmkvStorage service to avoid AsyncStorage import chain
jest.mock("./src/services/mmkvStorage", () => ({
  mmkvStorage: {
    getItem: jest.fn(() => null),
    getItemAsync: jest.fn(async () => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    flush: jest.fn(async () => undefined),
    initialize: jest.fn(async () => undefined),
    clearAll: jest.fn(),
  },
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

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  return {
    __esModule: true,
    default: {
      call: () => {},
      addWhitelistedNativeProps: () => {},
      addWhitelistedUIProps: () => {},
      View: require("react-native").View,
      Text: require("react-native").Text,
      Image: require("react-native").Image,
      ScrollView: require("react-native").ScrollView,
      createAnimatedComponent: (component) => component,
    },
    useSharedValue: jest.fn((v) => ({ value: v })),
    useAnimatedStyle: jest.fn((cb) => cb()),
    useDerivedValue: jest.fn((cb) => ({ value: cb() })),
    useAnimatedProps: jest.fn((cb) => cb()),
    useAnimatedGestureHandler: jest.fn(() => ({})),
    useAnimatedScrollHandler: jest.fn(() => ({})),
    useAnimatedRef: jest.fn(() => ({ current: null })),
    useWorkletCallback: jest.fn((cb) => cb),
    createAnimatedComponent: (component) => component,
    withTiming: jest.fn((v) => v),
    withSpring: jest.fn((v) => v),
    withDelay: jest.fn((_, v) => v),
    withRepeat: jest.fn((v) => v),
    withSequence: jest.fn((...args) => args[args.length - 1]),
    withDecay: jest.fn((v) => v),
    cancelAnimation: jest.fn(),
    runOnJS: jest.fn((fn) => fn),
    runOnUI: jest.fn((fn) => fn),
    makeMutable: jest.fn((v) => ({ value: v })),
    Easing: {
      inOut: jest.fn(),
      ease: jest.fn(),
      linear: jest.fn(),
      bezier: jest.fn(),
    },
    Extrapolation: {
      CLAMP: "clamp",
    },
    interpolate: jest.fn(),
    FadeIn: { duration: jest.fn(() => ({})) },
    FadeOut: { duration: jest.fn(() => ({})) },
    Layout: { duration: jest.fn(() => ({})) },
  };
});

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    GestureDetector: ({ children }) => React.createElement(View, {}, children),
    Gesture: {
      Tap: () => ({ onEnd: () => {} }),
      Pan: () => ({ onUpdate: () => {}, onEnd: () => {} }),
    },
    Directions: {},
    State: {},
    PanGestureHandler: ({ children }) => React.createElement(View, {}, children),
    TapGestureHandler: ({ children }) => React.createElement(View, {}, children),
    ScrollView: ({ children }) => React.createElement(View, {}, children),
    Switch: () => null,
    TextInput: () => null,
    DrawerLayoutAndroid: () => null,
    WebView: () => null,
    NativeViewGestureHandler: ({ children }) => React.createElement(View, {}, children),
    FlingGestureHandler: ({ children }) => React.createElement(View, {}, children),
    ForceTouchGestureHandler: ({ children }) => React.createElement(View, {}, children),
    LongPressGestureHandler: ({ children }) => React.createElement(View, {}, children),
    RotationGestureHandler: ({ children }) => React.createElement(View, {}, children),
    PinchGestureHandler: ({ children }) => React.createElement(View, {}, children),
    attachGestureHandler: () => {},
    createGestureHandler: () => {},
    dropGestureHandler: () => {},
    updateGestureHandler: () => {},
    RootScaleContext: React.createContext(null),
  };
});

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
  MaterialIcons: "MaterialIcons",
  FontAwesome: "FontAwesome",
}));

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
  jest.spyOn(console, "warn").mockImplementation((msg) => {
    if (typeof msg === "string" && msg.includes("EXPO_OS is not defined")) {
      return;
    }
    console.warn(msg);
  });
});

// Mock Modal component to avoid "window is not defined" error in tests
jest.mock("react-native/Libraries/Modal/Modal", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MockModal = ({ children, visible, ...props }) => {
    if (!visible) return null;
    return React.createElement(View, { testID: "modal", ...props }, children);
  };
  MockModal.displayName = "Modal";
  return {
    __esModule: true,
    default: MockModal,
  };
});

const { cleanup } = require("@testing-library/react-native");

afterEach(() => {
  cleanup();
  jest.clearAllTimers();
  jest.useRealTimers();

  try {
    const { stopNotificationPolling } = require("./src/store/notificationStore");
    if (typeof stopNotificationPolling === "function") {
      stopNotificationPolling();
    }
  } catch (_err) {
    // Store may not be initialized in every test file.
  }
});
