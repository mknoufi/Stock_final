import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { secureStorage } from "../secureStorage";

describe("secureStorage key normalization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("keeps valid keys unchanged", async () => {
    await secureStorage.setItem("session.token", "abc");

    expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(1);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "session.token",
      "abc",
      expect.any(Object),
    );
  });

  it("sanitizes invalid keys and appends deterministic hash suffix", async () => {
    await secureStorage.setItem("staff user", "1");

    expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(1);
    const normalizedKey = (SecureStore.setItemAsync as jest.Mock).mock.calls[0][0] as string;

    expect(normalizedKey).toMatch(/^staff_user_[a-f0-9]{8}$/);
  });

  it("prevents collisions for different invalid raw keys", async () => {
    await secureStorage.setItem("staff user", "first");
    await secureStorage.setItem("staff@user", "second");

    const firstKey = (SecureStore.setItemAsync as jest.Mock).mock.calls[0][0] as string;
    const secondKey = (SecureStore.setItemAsync as jest.Mock).mock.calls[1][0] as string;

    expect(firstKey).not.toBe(secondKey);
  });

  it("falls back to legacy key lookup for existing stored entries", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(async (key: string) => {
      if (key === "staff_user") {
        return "legacy-value";
      }
      return null;
    });

    const result = await secureStorage.getItem("staff user");

    expect(result).toBe("legacy-value");
    expect(SecureStore.getItemAsync).toHaveBeenCalledTimes(2);
    const firstCallKey = (SecureStore.getItemAsync as jest.Mock).mock.calls[0][0] as string;
    const secondCallKey = (SecureStore.getItemAsync as jest.Mock).mock.calls[1][0] as string;
    expect(firstCallKey).toMatch(/^staff_user_[a-f0-9]{8}$/);
    expect(secondCallKey).toBe("staff_user");
  });

  it("uses AsyncStorage fallback when SecureStore write fails", async () => {
    (SecureStore.setItemAsync as jest.Mock).mockRejectedValueOnce(
      new Error("secure-store write failed"),
    );

    await expect(secureStorage.setItem("staff user", "value-1")).resolves.toBeUndefined();

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    const fallbackKey = (AsyncStorage.setItem as jest.Mock).mock.calls[0][0] as string;
    const fallbackValue = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1] as string;
    expect(fallbackKey).toMatch(/^secure_fallback\.staff_user_[a-f0-9]{8}$/);
    expect(fallbackValue).toBe("value-1");
  });
});
