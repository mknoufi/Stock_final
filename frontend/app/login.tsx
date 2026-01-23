/**
 * Modern Login Screen - Lavanya Mart Stock Verify
 * Clean, accessible login with modern design
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { useAuthStore } from "../src/store/authStore";
import ModernButton from "../src/components/ui/ModernButton";
import ModernCard from "../src/components/ui/ModernCard";
import ModernInput from "../src/components/ui/ModernInput";
import ModernHeader from "../src/components/ui/ModernHeader";
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from "../src/theme/modernDesign";

// Safe Animated View for Web
const SafeAnimatedView = ({ children, style, entering, ...props }: any) => {
  if (Platform.OS === "web") {
    return (
      <View style={style} {...props}>
        {children}
      </View>
    );
  }
  return (
    <Animated.View style={style} entering={entering} {...props}>
      {children}
    </Animated.View>
  );
};

type LoginMode = "pin" | "credentials";

export default function LoginScreen() {
  const { login, loginWithPin, isLoading, lastLoggedUser, getPinForBiometrics } = useAuthStore();
  const [loginMode, setLoginMode] = useState<LoginMode>("credentials");
  const [pin, setPin] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    pin?: string;
    username?: string;
    password?: string;
  }>({});

  const pinInputRef = React.useRef<TextInput>(null);

  // Check connection on mount
  React.useEffect(() => {
    // Simple health check to warm up connection
    const warmUp = async () => {
      try {
        const { default: apiClient } = await import("../src/services/httpClient");
        await apiClient.get("/health", { timeout: 2000 });
      } catch (_e) {
        // Ignore warm-up errors
      }
    };
    warmUp();
  }, []);

  // Set initial mode based on last logged user
  React.useEffect(() => {
    if (lastLoggedUser) {
      setLoginMode("pin");
    }
  }, [lastLoggedUser]);

  const handlePinChange = useCallback(
    async (newPin: string) => {
      // Only allow numeric input
      if (!/^\d*$/.test(newPin)) return;
      
      // Prevent input while loading
      if (isLoading) return;

      setPin(newPin);
      if (newPin.length > pin.length) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Auto-login when 4 digits entered
      if (newPin.length === 4) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Small delay to ensure UI updates before freezing for network request
        setTimeout(async () => {
          try {
            const result = await loginWithPin(newPin);
            if (!result.success) {
              Alert.alert("Login Failed", result.message || "Invalid PIN");
              setPin("");
            }
          } catch (_error) {
            Alert.alert("Login Failed", "Please check your PIN and try again.");
            setPin("");
          }
        }, 100);
      }
    },
    [pin, loginWithPin, isLoading],
  );

  const handleBiometricAuth = useCallback(async () => {
    if (isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Check hardware availability
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert(
          "Biometrics Unavailable",
          "Please enable biometrics in your device settings."
        );
        return;
      }

      // Check if we have a stored PIN
      const storedPin = await getPinForBiometrics();
      if (!storedPin) {
        Alert.alert(
          "Setup Required",
          "Please login with PIN once to enable biometrics."
        );
        return;
      }

      // Authenticate
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login to Lavanya Mart",
        fallbackLabel: "Use PIN",
      });

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const loginResult = await loginWithPin(storedPin);
        if (!loginResult.success) {
          Alert.alert(
            "Login Failed",
            loginResult.message || "Invalid stored credentials"
          );
        }
      }
    } catch (error) {
      Alert.alert("Error", "Biometric authentication failed");
    }
  }, [isLoading, getPinForBiometrics, loginWithPin]);

  const handleForgotPin = useCallback(() => {
    Alert.alert(
      "Forgot PIN",
      "Please contact your administrator to reset your PIN.",
    );
  }, []);

  const handleForgotPassword = useCallback(() => {
    Alert.alert(
      "Forgot Password",
      "Please contact your administrator to reset your password.",
    );
  }, []);

  const handleLogin = useCallback(async () => {
    const newErrors: { pin?: string; username?: string; password?: string } =
      {};
    setErrors(newErrors);
    try {
      if (loginMode === "pin") {
        if (pin.length !== 4) {
          setErrors({ pin: "Please enter a 4-digit PIN" });
          return;
        }
        const result = await loginWithPin(pin);
        if (!result.success) {
          Alert.alert("Login Failed", result.message || "Invalid PIN");
          setPin("");
        }
      } else {
        if (!username.trim()) {
          setErrors({ username: "Username is required" });
          return;
        }
        if (!password.trim()) {
          setErrors({ password: "Password is required" });
          return;
        }
        const result = await login(username, password);
        if (!result.success) {
          Alert.alert("Login Failed", result.message || "Invalid credentials");
        }
      }
    } catch (_error) {
      Alert.alert(
        "Login Failed",
        "Please check your credentials and try again.",
      );
    }
  }, [loginMode, pin, username, password, login, loginWithPin]);

  const toggleLoginMode = useCallback(() => {
    if (loginMode === "credentials" && !lastLoggedUser) {
      Alert.alert(
        "First Login Required",
        "Please login with username and password first to enable PIN login for this device.",
      );
      return;
    }
    const newMode: LoginMode = loginMode === "pin" ? "credentials" : "pin";
    setLoginMode(newMode);
    setPin("");
    setUsername("");
    setPassword("");
    const newErrors: { pin?: string; username?: string; password?: string } =
      {};
    setErrors(newErrors);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [loginMode, lastLoggedUser]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" backgroundColor={colors.white} />

      <ModernHeader
        showLogo
        title="Lavanya Mart"
        subtitle="Stock Verification System"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
        >
          <View style={styles.contentContainer}>
            {/* Welcome Section */}
            <SafeAnimatedView
              entering={FadeInUp.duration(800).springify()}
              style={styles.welcomeSection}
            >
              <Text style={styles.welcomeTitle}>
                {lastLoggedUser && loginMode === "pin"
                  ? `Hi, ${lastLoggedUser.full_name?.split(" ")[0] || lastLoggedUser.username}`
                  : "Welcome Back"}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                {lastLoggedUser && loginMode === "pin"
                  ? "Enter your PIN to continue"
                  : "Sign in to access your inventory management system"}
              </Text>
            </SafeAnimatedView>

            {/* Login Form Card */}
            <SafeAnimatedView
              entering={FadeInDown.duration(800).springify()}
              style={styles.formContainer}
            >
              <ModernCard style={styles.loginCard} padding={spacing.lg}>
                {/* Mode Toggle */}
                <View style={styles.modeToggle}>
                  <TouchableOpacity
                    onPress={toggleLoginMode}
                    style={[
                      styles.modeButton,
                      loginMode === "pin"
                        ? styles.modeButtonActive
                        : styles.modeButtonInactive,
                    ]}
                  >
                    <Ionicons
                      name="keypad"
                      size={20}
                      color={
                        loginMode === "pin" ? colors.white : colors.gray[600]
                      }
                    />
                    <Text
                      style={[
                        styles.modeButtonText,
                        loginMode === "pin"
                          ? styles.modeButtonTextActive
                          : styles.modeButtonTextInactive,
                      ]}
                    >
                      PIN
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={toggleLoginMode}
                    style={[
                      styles.modeButton,
                      loginMode === "credentials"
                        ? styles.modeButtonActive
                        : styles.modeButtonInactive,
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={20}
                      color={
                        loginMode === "credentials"
                          ? colors.white
                          : colors.gray[600]
                      }
                    />
                    <Text
                      style={[
                        styles.modeButtonText,
                        loginMode === "credentials"
                          ? styles.modeButtonTextActive
                          : styles.modeButtonTextInactive,
                      ]}
                    >
                      Credentials
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* PIN Entry Mode */}
                {loginMode === "pin" && (
                  <>
                    <Text style={styles.formTitle}>Enter Your PIN</Text>
                    <Text style={styles.formSubtitle}>
                      4-digit security code
                    </Text>

                    {/* Hidden Input for Keyboard */}
                    <TextInput
                      ref={pinInputRef}
                      value={pin}
                      onChangeText={handlePinChange}
                      keyboardType="number-pad"
                      maxLength={4}
                      style={styles.hiddenInput}
                      autoFocus
                      caretHidden
                    />

                    {/* PIN Display - Clickable to focus */}
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => pinInputRef.current?.focus()}
                      style={styles.pinDisplay}
                    >
                      {[0, 1, 2, 3].map((index) => (
                        <SafeAnimatedView
                          key={index}
                          entering={FadeInDown.delay(index * 50).duration(300)}
                          style={[
                            styles.pinDot,
                            pin.length > index
                              ? styles.pinDotFilled
                              : styles.pinDotEmpty,
                            pin.length === index && styles.pinDotActive,
                          ]}
                        >
                          {pin.length > index && (
                            <View style={styles.pinDotInner} />
                          )}
                        </SafeAnimatedView>
                      ))}
                    </TouchableOpacity>

                    {errors.pin && (
                      <Text style={styles.errorText}>{errors.pin}</Text>
                    )}

                    {/* Biometric & Forgot Options */}
                    <View style={styles.pinActions}>
                      <TouchableOpacity
                        onPress={handleBiometricAuth}
                        style={styles.biometricButton}
                      >
                        <Ionicons
                          name="finger-print"
                          size={40}
                          color={colors.primary[500]}
                        />
                        <Text style={styles.biometricText}>Use Biometrics</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={handleForgotPin}>
                        <Text style={styles.forgotLink}>Forgot PIN?</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {/* Credentials Entry Mode */}
                {loginMode === "credentials" && (
                  <>
                    <Text style={styles.formTitle}>Sign In</Text>

                    <ModernInput
                      label="Username"
                      placeholder="Enter your username"
                      value={username}
                      onChangeText={setUsername}
                      error={errors.username}
                      autoCapitalize="none"
                      icon="person"
                      disabled={isLoading}
                    />

                    <ModernInput
                      label="Password"
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      error={errors.password}
                      secureTextEntry
                      icon="lock-closed"
                      disabled={isLoading}
                    />

                    <TouchableOpacity
                      onPress={handleForgotPassword}
                      style={styles.forgotPasswordContainer}
                    >
                      <Text style={styles.forgotLink}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Login Button */}
                {loginMode === "credentials" && (
                  <ModernButton
                    title={isLoading ? "Signing In..." : "Sign In"}
                    onPress={handleLogin}
                    loading={isLoading}
                    disabled={isLoading || !username || !password}
                    fullWidth
                    style={styles.loginButton}
                    icon="log-in"
                  />
                )}
              </ModernCard>
            </SafeAnimatedView>

            {/* Footer */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(800).springify()}
              style={styles.footer}
            >
              <Text style={styles.versionText}>Version 3.0.0</Text>
              <Text style={styles.footerText}>Secure • Reliable • Fast</Text>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: spacing["2xl"],
  },
  welcomeTitle: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.gray[900],
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.gray[600],
    textAlign: "center",
    lineHeight: 24,
  },
  formContainer: {
    marginBottom: spacing.xl,
  },
  loginCard: {
    backgroundColor: colors.white,
  },
  modeToggle: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  modeButtonActive: {
    backgroundColor: colors.primary[500],
    ...shadows.sm,
  },
  modeButtonInactive: {
    backgroundColor: colors.transparent,
  },
  modeButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  modeButtonTextActive: {
    color: colors.white,
  },
  modeButtonTextInactive: {
    color: colors.gray[600],
  },
  formTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray[900],
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  pinDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing["2xl"],
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  pinDotEmpty: {
    borderColor: colors.gray[300],
    backgroundColor: colors.transparent,
  },
  pinDotFilled: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500],
  },
  pinDotActive: {
    borderColor: colors.primary[400],
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },
  pinDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary[500],
  },
  formSubtitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.gray[500],
    textAlign: "center",
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  pinActions: {
    alignItems: "center",
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  biometricButton: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    padding: spacing.sm,
  },
  biometricText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
  },
  forgotLink: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    textDecorationLine: "underline",
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  loginButton: {
    marginTop: spacing.lg,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error[600],
    textAlign: "center",
    marginTop: spacing.sm,
  },
  footer: {
    alignItems: "center",
    gap: spacing.xs,
  },
  versionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[500],
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
  },
});
