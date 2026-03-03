import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { useThemeContext } from "../../context/ThemeContext";
import { spacing, borderRadius, shadow } from "../../theme/modernDesign";

const { width } = Dimensions.get("window");
const TAB_BAR_WIDTH_PERCENTAGE = 0.92;
const TAB_BAR_WIDTH = width * TAB_BAR_WIDTH_PERCENTAGE;

export const StaffTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const { themeLegacy: theme, isDark } = useThemeContext();

    return (
        <View style={styles.container} pointerEvents="box-none">
            <View style={[
                styles.tabBarContainer,
                {
                    backgroundColor: isDark ? "rgba(30, 41, 59, 0.85)" : "rgba(255, 255, 255, 0.85)",
                    borderColor: theme.colors.borderLight,
                }
            ]}>
                {/* Glass Effect Background */}
                {Platform.OS === 'ios' && (
                    <BlurView
                        intensity={isDark ? 40 : 80}
                        tint={isDark ? "dark" : "light"}
                        style={StyleSheet.absoluteFill}
                    />
                )}

                <View style={styles.tabsRow}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        // Middle Tab is special (FAB)
                        const isMiddle = index === 2;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: "tabLongPress",
                                target: route.key,
                            });
                        };

                        // Custom FAB Render
                        if (isMiddle) {
                            return (
                                <View key={route.key} style={styles.fabContainer} pointerEvents="box-none">
                                    <TouchableOpacity
                                        onPress={onPress}
                                        onLongPress={onLongPress}
                                        activeOpacity={0.8}
                                        style={[
                                            styles.fab,
                                            {
                                                backgroundColor: theme.colors.primary,
                                                shadowColor: theme.colors.primary,
                                                borderColor: isDark ? "#0f172a" : "#ffffff",
                                            }
                                        ]}
                                    >
                                        <Ionicons name="add" size={32} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            );
                        }

                        // Standard Tab Render
                        let iconName: any = "help-circle";
                        let label = "Tab";

                        if (route.name === "index" || route.name === "home") {
                            iconName = isFocused ? "home" : "home-outline";
                            label = "Home";
                        } else if (route.name === "scan") {
                            iconName = isFocused ? "barcode" : "barcode-outline";
                            label = "Scan";
                        } else if (route.name === "history" || route.name === "variances") {
                            iconName = isFocused ? "analytics" : "analytics-outline";
                            label = "Variances";
                        } else if (route.name === "settings" || route.name === "profile") {
                            iconName = isFocused ? "person" : "person-outline";
                            label = "Profile";
                        }

                        return (
                            <TouchableOpacity
                                key={route.key}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={styles.tabButton}
                            >
                                <Ionicons
                                    name={iconName}
                                    size={24}
                                    color={isFocused ? theme.colors.primary : theme.colors.textTertiary}
                                />
                                <Animated.Text
                                    style={[
                                        styles.tabLabel,
                                        {
                                            color: isFocused ? theme.colors.primary : theme.colors.textTertiary,
                                            fontFamily: isFocused ? "Inter_700Bold" : "Inter_500Medium"
                                        }
                                    ]}
                                >
                                    {label}
                                </Animated.Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
            {/* Bottom rounding fix for safe area if needed */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        paddingBottom: Platform.OS === "ios" ? 30 : 20,
        zIndex: 1000,
    },
    tabBarContainer: {
        flexDirection: "row",
        width: TAB_BAR_WIDTH,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        overflow: "hidden", // for BlurView
        ...shadow.large,
    },
    tabsRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 2,
    },
    tabLabel: {
        fontSize: 10,
    },
    fabContainer: {
        width: 60,
        height: 60,
        marginTop: -30, // Pull up above bar
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});
