import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Native version of useSafeCodeScanner.
 * Detects if running in Expo Go and avoids calling the native VisionCamera hook.
 */
export const useSafeCodeScanner = (options: any) => {
  if (Platform.OS === "web") {
    return undefined;
  }

  // appOwnership is 'expo' when running in Expo Go
  const isExpoGo = Constants.appOwnership === "expo";

  if (isExpoGo) {
    return undefined;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, react-hooks/rules-of-hooks
    const { useCodeScanner } = require("react-native-vision-camera");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCodeScanner(options);
  } catch (error) {
    console.warn("[useSafeCodeScanner] VisionCamera module failed to load:", error);
    return undefined;
  }
};
