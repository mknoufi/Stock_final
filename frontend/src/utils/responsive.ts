/**
 * Responsive Design Utility
 * Auto-aligns all pages to all screen sizes
 * Supports: Mobile, Tablet, Desktop
 */

import { useWindowDimensions, Platform } from "react-native";
import { useMemo } from "react";

// Breakpoints (industry standard)
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

// Screen type detection
export type ScreenSize = "mobile" | "tablet" | "desktop" | "wide";

/**
 * Hook to get current screen size and responsive values
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    // Determine screen type
    const isMobile = width < BREAKPOINTS.tablet;
    const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
    const isDesktop = width >= BREAKPOINTS.desktop && width < BREAKPOINTS.wide;
    const isWide = width >= BREAKPOINTS.wide;

    // Screen size category
    const screenSize: ScreenSize = isMobile
      ? "mobile"
      : isTablet
        ? "tablet"
        : isDesktop
          ? "desktop"
          : "wide";

    // Responsive values
    const aspectRatio = width / height;
    const isLandscape = width > height;
    const isPortrait = height > width;

    // Scale factor (for fonts, spacing)
    const scale = width / 375; // Base on iPhone X width
    const moderateScale = (size: number, factor = 0.5) => size + (scale - 1) * factor * size;

    // Content max width (for desktop centering)
    const contentMaxWidth = isWide ? 1200 : isDesktop ? 960 : isTablet ? 720 : width;

    // Responsive padding
    const horizontalPadding = isMobile ? 16 : isTablet ? 24 : 32;
    const verticalPadding = isMobile ? 16 : isTablet ? 20 : 24;

    // Grid columns
    const gridColumns = isMobile ? 1 : isTablet ? 2 : isDesktop ? 3 : 4;

    return {
      // Dimensions
      width,
      height,
      aspectRatio,

      // Orientation
      isLandscape,
      isPortrait,

      // Screen types (boolean)
      isMobile,
      isTablet,
      isDesktop,
      isWide,

      // Screen size (category)
      screenSize,

      // Scaling
      scale,
      moderateScale,

      // Layout
      contentMaxWidth,
      horizontalPadding,
      verticalPadding,
      gridColumns,

      // Platform
      isWeb: Platform.OS === "web",
      isIOS: Platform.OS === "ios",
      isAndroid: Platform.OS === "android",

      // Helper: Responsive value selector
      select: <T>(values: { mobile?: T; tablet?: T; desktop?: T; wide?: T; default: T }): T => {
        if (isWide && values.wide !== undefined) return values.wide;
        if (isDesktop && values.desktop !== undefined) return values.desktop;
        if (isTablet && values.tablet !== undefined) return values.tablet;
        if (isMobile && values.mobile !== undefined) return values.mobile;
        return values.default;
      },
    };
  }, [width, height]);
}

/**
 * Responsive spacing helper
 */
export const responsiveSpacing = {
  xs: (screenSize: ScreenSize) => (screenSize === "mobile" ? 4 : 6),
  sm: (screenSize: ScreenSize) => (screenSize === "mobile" ? 8 : 12),
  md: (screenSize: ScreenSize) =>
    screenSize === "mobile" ? 16 : screenSize === "tablet" ? 20 : 24,
  lg: (screenSize: ScreenSize) =>
    screenSize === "mobile" ? 24 : screenSize === "tablet" ? 32 : 40,
  xl: (screenSize: ScreenSize) =>
    screenSize === "mobile" ? 32 : screenSize === "tablet" ? 48 : 64,
};

/**
 * Responsive font sizes
 */
export const responsiveFontSize = {
  xs: (screenSize: ScreenSize) => (screenSize === "mobile" ? 10 : 12),
  sm: (screenSize: ScreenSize) => (screenSize === "mobile" ? 12 : 14),
  base: (screenSize: ScreenSize) => (screenSize === "mobile" ? 14 : 16),
  lg: (screenSize: ScreenSize) => (screenSize === "mobile" ? 16 : 18),
  xl: (screenSize: ScreenSize) => (screenSize === "mobile" ? 20 : 24),
  "2xl": (screenSize: ScreenSize) => (screenSize === "mobile" ? 24 : 30),
  "3xl": (screenSize: ScreenSize) => (screenSize === "mobile" ? 30 : 36),
  "4xl": (screenSize: ScreenSize) => (screenSize === "mobile" ? 36 : 48),
};

/**
 * Container helper component props
 */
export interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: any;
  centered?: boolean;
}

/**
 * Usage Example:
 *
 * ```tsx
 * import { useResponsive } from '@/utils/responsive';
 *
 * function MyScreen() {
 *   const { isMobile, contentMaxWidth, horizontalPadding, select } = useResponsive();
 *
 *   return (
 *     <View style={{
 *       maxWidth: contentMaxWidth,
 *       paddingHorizontal: horizontalPadding,
 *       alignSelf: 'center',
 *       width: '100%',
 *     }}>
 *       <Text style={{
 *         fontSize: select({
 *           mobile: 24,
 *           tablet: 32,
 *           desktop: 40,
 *           default: 24,
 *         }),
 *       }}>
 *         Responsive Title
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 */
