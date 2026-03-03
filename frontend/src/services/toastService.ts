import { Alert, Platform } from "react-native";
import { createLogger } from "./logging";

const log = createLogger("toast");

export const showToast = (
  message: string,
  type: "success" | "error" | "info" = "info",
) => {
  if (type === "error" && Platform.OS !== "web") {
    Alert.alert("Error", message);
  }
  log.info(`Toast: ${type}`, { message });
};

export const showSuccessToast = (message: string) =>
  showToast(message, "success");
export const showErrorToast = (message: string) => showToast(message, "error");
export const showInfoToast = (message: string) => showToast(message, "info");
