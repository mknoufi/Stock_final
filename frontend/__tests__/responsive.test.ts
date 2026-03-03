import { renderHook } from "@testing-library/react-native";
import { useResponsive, responsiveSpacing, responsiveFontSize } from "../src/utils/responsive";

// Mock useWindowDimensions
const mockUseWindowDimensions = jest.fn();
jest.mock("react-native", () => ({
  useWindowDimensions: () => mockUseWindowDimensions(),
  Platform: { OS: "ios", select: jest.fn() },
}));

describe("responsive utils", () => {
  beforeEach(() => {
    mockUseWindowDimensions.mockReturnValue({ width: 375, height: 812 }); // iPhone X default
  });

  describe("useResponsive", () => {
    it("detects mobile correctly", () => {
      mockUseWindowDimensions.mockReturnValue({ width: 375, height: 812 });
      const { result } = renderHook(() => useResponsive());
      expect(result.current.isMobile).toBe(true);
      expect(result.current.screenSize).toBe("mobile");
    });

    it("detects tablet correctly", () => {
      mockUseWindowDimensions.mockReturnValue({ width: 800, height: 1024 });
      const { result } = renderHook(() => useResponsive());
      expect(result.current.isTablet).toBe(true);
      expect(result.current.screenSize).toBe("tablet");
      expect(result.current.gridColumns).toBe(2);
    });

    it("detects desktop correctly", () => {
      mockUseWindowDimensions.mockReturnValue({ width: 1200, height: 900 });
      const { result } = renderHook(() => useResponsive());
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.screenSize).toBe("desktop");
      expect(result.current.gridColumns).toBe(3);
    });

    it("calculates aspect ratio and orientation", () => {
      mockUseWindowDimensions.mockReturnValue({ width: 800, height: 600 });
      const { result } = renderHook(() => useResponsive());
      expect(result.current.isLandscape).toBe(true);
      expect(result.current.aspectRatio).toBe(800 / 600);
    });

    it("selects correct value based on screen size", () => {
      mockUseWindowDimensions.mockReturnValue({ width: 375, height: 812 }); // Mobile
      const { result } = renderHook(() => useResponsive());
      const value = result.current.select({
        mobile: 10,
        tablet: 20,
        default: 30,
      });
      expect(value).toBe(10);
    });
  });

  describe("responsiveSpacing", () => {
    it("returns correct spacing for mobile", () => {
      expect(responsiveSpacing.md("mobile")).toBe(16);
    });

    it("returns correct spacing for tablet", () => {
      expect(responsiveSpacing.md("tablet")).toBe(20);
    });
  });

  describe("responsiveFontSize", () => {
    it("returns correct font size for mobile", () => {
      expect(responsiveFontSize.base("mobile")).toBe(14);
    });

    it("returns correct font size for desktop (implied fallback/scale)", () => {
      // Logic check: base is 16 for non-mobile in the implementation?
      expect(responsiveFontSize.base("tablet")).toBe(16);
    });
  });
});
