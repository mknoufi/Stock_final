import { useWindowDimensions } from "react-native";
import { breakpoints } from "@/styles/globalStyles";

/**
 * Custom hook for responsive screen dimensions
 *
 * Provides reactive screen size information and breakpoint helpers.
 * Unlike Dimensions.get('window'), this hook updates when the window is resized.
 *
 * @example
 * ```tsx
 * const { isDesktop, isTablet, getColumns } = useScreenDimensions();
 * const columns = getColumns(1, 2, 3); // mobile: 1, tablet: 2, desktop: 3
 * ```
 */
export const useScreenDimensions = () => {
  const { width, height } = useWindowDimensions();

  // Breakpoint flags
  const isMobile = width < breakpoints.tablet;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const isDesktop = width >= breakpoints.desktop;

  // Additional granular breakpoints
  const isSmall = width < 640;
  const isMedium = width >= 640 && width < 1024;
  const isLarge = width >= 1024;
  const isXLarge = width >= 1440;

  /**
   * Get responsive column count
   * @param mobile - Columns on mobile (< 768px)
   * @param tablet - Columns on tablet (768-1024px)
   * @param desktop - Columns on desktop (>= 1024px)
   * @returns Appropriate column count for current screen size
   */
  const getColumns = (mobile = 1, tablet = 2, desktop = 3): number => {
    if (isDesktop) return desktop;
    if (isTablet) return tablet;
    return mobile;
  };

  /**
   * Get responsive spacing value
   * @param mobile - Spacing on mobile
   * @param desktop - Spacing on desktop
   * @returns Appropriate spacing for current screen size
   */
  const getSpacing = (mobile: number, desktop: number): number => {
    return isDesktop ? desktop : mobile;
  };

  /**
   * Get responsive value based on breakpoints
   * @param values - Object with breakpoint keys (mobile, tablet, desktop)
   * @returns Value for current breakpoint
   */
  const getResponsiveValue = <T>(values: { mobile: T; tablet?: T; desktop?: T }): T => {
    if (isDesktop && values.desktop !== undefined) return values.desktop;
    if (isTablet && values.tablet !== undefined) return values.tablet;
    return values.mobile;
  };

  return {
    // Dimensions
    width,
    height,

    // Breakpoint flags
    isMobile,
    isTablet,
    isDesktop,
    isSmall,
    isMedium,
    isLarge,
    isXLarge,

    // Helper functions
    getColumns,
    getSpacing,
    getResponsiveValue,
  };
};

/**
 * Type-safe breakpoint values
 */
export type ScreenDimensions = ReturnType<typeof useScreenDimensions>;
