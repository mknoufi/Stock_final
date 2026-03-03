import * as Crypto from "expo-crypto";
import { secureStorage } from "./storage/secureStorage";
import { createLogger } from "./logging";

const log = createLogger("deviceId");
const DEVICE_ID_KEY = "device_id";

const generateUuidFallback = (): string => {
  const cryptoLike = Crypto as unknown as {
    randomUUID?: () => string;
    getRandomBytes?: (length: number) => Uint8Array;
    randomBytes?: (length: number) => Uint8Array | { __b?: Uint8Array };
  };

  if (typeof cryptoLike.randomUUID === "function") {
    return cryptoLike.randomUUID();
  }

  let bytes: Uint8Array | null = null;
  if (typeof cryptoLike.getRandomBytes === "function") {
    bytes = cryptoLike.getRandomBytes(16);
  } else if (typeof cryptoLike.randomBytes === "function") {
    const generated = cryptoLike.randomBytes(16);
    bytes =
      generated instanceof Uint8Array
        ? generated
        : generated?.__b instanceof Uint8Array
          ? generated.__b
          : null;
  }

  if (!bytes || bytes.length < 16) {
    // Last resort fallback for very constrained environments.
    const rand = () => Math.floor(Math.random() * 0xffffffff);
    return `${rand().toString(16)}-${rand().toString(16)}-${Date.now().toString(16)}`;
  }

  const uuidBytes = bytes;

  // RFC4122 variant/version bits for UUID v4.
  uuidBytes[6] = ((uuidBytes[6] ?? 0) & 0x0f) | 0x40;
  uuidBytes[8] = ((uuidBytes[8] ?? 0) & 0x3f) | 0x80;

  const hex = Array.from(uuidBytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
};

/**
 * Retrieves the persistent Device ID for this installation.
 * Generates a new UUID if one does not exist.
 */
export const getDeviceId = async (): Promise<string> => {
  try {
    let deviceId = await secureStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
      deviceId = generateUuidFallback();
      await secureStorage.setItem(DEVICE_ID_KEY, deviceId);
      log.info("Generated new Device ID", { deviceId });
    }

    return deviceId;
  } catch (error) {
    log.error("Failed to retrieve/generate Device ID", { error });
    // Fallback to a temporary ID if storage fails, to allow the app to function
    return generateUuidFallback();
  }
};
