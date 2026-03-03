import {
  sanitizeBarcode,
  validateQuantity,
  validateSessionName,
  validateBarcode,
  normalizeBarcode,
  validateMRP,
  BARCODE_MIN_LENGTH,
  BARCODE_MAX_LENGTH,
} from "../validation";

describe("validation utils", () => {
  describe("sanitizeBarcode", () => {
    it("removes dangerous characters", () => {
      expect(sanitizeBarcode("ABC-123<script>")).toBe("ABC-123script");
      expect(sanitizeBarcode("DROP TABLE users;")).toBe("DROPTABLEusers");
    });

    it("returns null for invalid lengths", () => {
      expect(sanitizeBarcode("ABC")).toBe(null); // Too short
      expect(sanitizeBarcode("A".repeat(51))).toBe(null); // Too long
    });

    it("returns null for empty strings", () => {
      expect(sanitizeBarcode("")).toBe(null);
    });

    it("allows valid barcodes", () => {
      expect(sanitizeBarcode("ITEM-123_456")).toBe("ITEM-123_456");
    });
  });

  describe("validateQuantity", () => {
    it("accepts valid numbers", () => {
      expect(validateQuantity(10)).toEqual({ valid: true, value: 10 });
      expect(validateQuantity("10.5")).toEqual({ valid: true, value: 10.5 });
    });

    it("rejects non-numbers", () => {
      expect(validateQuantity("abc")).toEqual({
        valid: false,
        error: "Quantity must be a number",
      });
    });

    it("rejects negative numbers", () => {
      expect(validateQuantity("-5")).toEqual({
        valid: false,
        error: "Quantity cannot be negative",
      });
    });
  });

  describe("validateSessionName", () => {
    it("combines floor and rack", () => {
      expect(validateSessionName("Ground", "R1")).toEqual({
        valid: true,
        value: "Ground - R1",
      });
    });

    it("validates missing inputs", () => {
      expect(validateSessionName("", "R1").valid).toBe(false);
      expect(validateSessionName("Ground", "").valid).toBe(false);
    });

    it("validates length", () => {
      expect(validateSessionName("G", "")).toEqual({
        valid: false,
        error: "Please enter a rack name/number",
      });
    });
  });

  describe("validateBarcode", () => {
    it("validates empty", () => {
      expect(validateBarcode("").valid).toBe(false);
    });

    it("validates numeric barcode length", () => {
      expect(validateBarcode("1").valid).toBe(false); // Too short
      expect(validateBarcode("123456").valid).toBe(true);
    });

    it("validates alphanumeric barcode", () => {
      expect(validateBarcode("A1").valid).toBe(true);
      expect(validateBarcode("ITEM-CODE").valid).toBe(true);
    });

    it("rejects invalid characters", () => {
      expect(validateBarcode("Item Code!").valid).toBe(false);
    });
  });

  describe("validateMRP", () => {
    it("validates valid MRP", () => {
      expect(validateMRP("100.50")).toEqual({ valid: true, value: 100.5 });
    });

    it("rejects invalid MRP", () => {
      expect(validateMRP("-10").valid).toBe(false);
      expect(validateMRP("abc").valid).toBe(false);
    });
  });
});
