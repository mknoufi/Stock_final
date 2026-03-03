import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { createLogger } from "../logging";

/**
 * Platform-independent secure storage wrapper
 * Uses expo-secure-store on native platforms
 * Note: On web, SecureStore is not available, so this would need a fallback
 * if we supported web for secure features. Ideally, we shouldn't store sensitive
 * tokens on web local storage without careful consideration, but for now
 * we'll focus on native mobile security.
 */

// Configure SecureStore options
const OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK, // iOS: Allow access when device is unlocked
};
const VALID_KEY_PATTERN = /^[A-Za-z0-9._-]+$/;
const INVALID_KEY_CHARS = /[^A-Za-z0-9._-]/g;
const DUPLICATE_UNDERSCORES = /_+/g;
const EDGE_KEY_SEPARATORS = /^[_\-.]+|[_\-.]+$/g;
const MAX_KEY_LENGTH = 120;
const HASH_SUFFIX_LENGTH = 8;

const log = createLogger("SecureStorage");

class SecureStorage {
  private fallbackStorageKey(primaryKey: string): string {
    return `secure_fallback.${primaryKey}`;
  }

  private hashKey(raw: string): string {
    // Lightweight deterministic hash for fallback keys.
    let hash = 0;
    for (let i = 0; i < raw.length; i += 1) {
      hash = ((hash << 5) - hash + raw.charCodeAt(i)) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
  }

  private sanitizeKey(raw: string): string {
    return raw
      .replace(INVALID_KEY_CHARS, "_")
      .replace(DUPLICATE_UNDERSCORES, "_")
      .replace(EDGE_KEY_SEPARATORS, "");
  }

  private buildFallbackKey(raw: string): string {
    return `key_${this.hashKey(raw)}`;
  }

  private appendHashSuffix(baseKey: string, raw: string): string {
    const suffix = this.hashKey(raw).slice(0, HASH_SUFFIX_LENGTH);
    const sanitizedBase = this.sanitizeKey(baseKey) || "key";
    const maxBaseLength = Math.max(1, MAX_KEY_LENGTH - suffix.length - 1);
    const trimmedBase = sanitizedBase.slice(0, maxBaseLength);
    return `${trimmedBase}_${suffix}`;
  }

  private normalizeLegacyKey(key: string): string | null {
    const trimmed = key.trim();
    if (!trimmed) {
      return null;
    }

    const normalized = this.sanitizeKey(trimmed);
    let safeKey = normalized;

    if (!safeKey) {
      safeKey = this.buildFallbackKey(trimmed);
    }
    if (safeKey.length > MAX_KEY_LENGTH) {
      safeKey = this.buildFallbackKey(safeKey);
    }
    if (!VALID_KEY_PATTERN.test(safeKey)) {
      safeKey = this.buildFallbackKey(trimmed);
    }

    return VALID_KEY_PATTERN.test(safeKey)
      ? safeKey.slice(0, MAX_KEY_LENGTH)
      : null;
  }

  private normalizeKey(key: string): { primary: string | null; legacy?: string } {
    if (typeof key !== "string") {
      log.error("SecureStorage key must be a string", {
        keyType: typeof key,
      });
      return { primary: null };
    }

    const trimmed = key.trim();
    if (!trimmed) {
      log.error("SecureStorage key must not be empty");
      return { primary: null };
    }

    const legacy = this.normalizeLegacyKey(trimmed);
    let safeKey = this.sanitizeKey(trimmed);

    if (!safeKey) {
      safeKey = this.buildFallbackKey(trimmed);
    }

    // Avoid key collisions when multiple invalid keys normalize to the same token.
    if (safeKey !== trimmed && !safeKey.startsWith("key_")) {
      safeKey = this.appendHashSuffix(safeKey, trimmed);
    }

    if (safeKey.length > MAX_KEY_LENGTH) {
      safeKey = this.appendHashSuffix(safeKey, trimmed);
    }

    if (!VALID_KEY_PATTERN.test(safeKey)) {
      safeKey = this.buildFallbackKey(trimmed);
    }

    if (!VALID_KEY_PATTERN.test(safeKey)) {
      log.error("SecureStorage key could not be normalized", { key });
      return { primary: null };
    }

    safeKey = safeKey.slice(0, MAX_KEY_LENGTH);

    if (safeKey !== key) {
      log.warn("SecureStorage key sanitized", {
        originalKey: key,
        safeKey,
      });
    }

    return {
      primary: safeKey,
      legacy: legacy && legacy !== safeKey ? legacy : undefined,
    };
  }

  /**
   * Safe set item
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      const { primary } = this.normalizeKey(key);
      if (!primary) return;
      const safeValue = typeof value === "string" ? value : String(value);

      if (Platform.OS === "web") {
        // Fallback for web (NOT SECURE, but functional for dev)
        // In production web, HttpOnly cookies are preferred
        localStorage.setItem(primary, safeValue);
        return;
      }
      await SecureStore.setItemAsync(primary, safeValue, OPTIONS);

      // Clear any stale fallback copy once secure write succeeds.
      try {
        await AsyncStorage.removeItem(this.fallbackStorageKey(primary));
      } catch {
        // Best effort only.
      }
    } catch (error) {
      log.error("SecureStorage setItem failed, using AsyncStorage fallback", {
        error,
      });
      const { primary } = this.normalizeKey(key);
      if (!primary) return;
      try {
        const safeValue = typeof value === "string" ? value : String(value);
        await AsyncStorage.setItem(this.fallbackStorageKey(primary), safeValue);
      } catch (fallbackError) {
        log.error("SecureStorage fallback setItem failed", { fallbackError });
      }
    }
  }

  /**
   * Safe get item with timeout
   */
  async getItem(key: string): Promise<string | null> {
    try {
      const { primary, legacy } = this.normalizeKey(key);
      if (!primary) return null;

      if (Platform.OS === "web") {
        const current = localStorage.getItem(primary);
        if (current !== null || !legacy) {
          return current;
        }
        return localStorage.getItem(legacy);
      }

      // Add timeout to prevent hanging.
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      const timeoutPromise = new Promise<null>((resolve) => {
        timeoutId = setTimeout(() => resolve(null), 2000);
      });

      const getPromise = SecureStore.getItemAsync(primary, OPTIONS);
      const result = await Promise.race([getPromise, timeoutPromise]);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (result !== null || !legacy) {
        if (result !== null) return result;
        return await AsyncStorage.getItem(this.fallbackStorageKey(primary));
      }

      const legacyResult = await SecureStore.getItemAsync(legacy, OPTIONS);
      if (legacyResult !== null) {
        return legacyResult;
      }
      return await AsyncStorage.getItem(this.fallbackStorageKey(primary));
    } catch (error) {
      log.error("SecureStorage getItem failed", { error });
      const { primary } = this.normalizeKey(key);
      if (!primary) return null;
      try {
        return await AsyncStorage.getItem(this.fallbackStorageKey(primary));
      } catch {
        return null;
      }
    }
  }

  /**
   * Safe remove item
   */
  async removeItem(key: string): Promise<void> {
    try {
      const { primary, legacy } = this.normalizeKey(key);
      if (!primary) return;

      if (Platform.OS === "web") {
        localStorage.removeItem(primary);
        if (legacy) {
          localStorage.removeItem(legacy);
        }
        return;
      }

      await SecureStore.deleteItemAsync(primary, OPTIONS);
      if (legacy) {
        await SecureStore.deleteItemAsync(legacy, OPTIONS);
      }
      await AsyncStorage.removeItem(this.fallbackStorageKey(primary));
    } catch (error) {
      log.error("SecureStorage removeItem failed", { error });
      // Don't throw on delete failure, just log
      const { primary } = this.normalizeKey(key);
      if (!primary) return;
      try {
        await AsyncStorage.removeItem(this.fallbackStorageKey(primary));
      } catch {
        // Best effort only.
      }
    }
  }
}

export const secureStorage = new SecureStorage();
