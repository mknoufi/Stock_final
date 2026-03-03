import { ScanDeduplicationService } from "../scanDeduplicationService";

describe("ScanDeduplicationService", () => {
  let service: ScanDeduplicationService;

  beforeEach(() => {
    service = new ScanDeduplicationService();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("checkDuplicate", () => {
    it("should return false when no previous scan exists", () => {
      const result = service.checkDuplicate("12345");
      expect(result.isDuplicate).toBe(false);
    });

    it("should return true when scanning the same barcode within threshold", () => {
      const now = 10000;
      jest.setSystemTime(now);

      // Simulate first scan
      service.recordScan("12345");

      // Check for duplicate after 1.5 seconds
      jest.setSystemTime(now + 1500);
      const result = service.checkDuplicate("12345");

      expect(result).toEqual({
        isDuplicate: true,
        reason: "Duplicate scan ignored (Scanned 1.5s ago)",
      });
    });

    it("should correctly format the seconds ago message (rounding)", () => {
      const now = 10000;
      jest.setSystemTime(now);
      service.recordScan("12345");

      // 1.55 seconds -> rounds to 1.6? or 1.5?
      // Logic: Math.round(timeDiff / 100) / 10;
      // 1550 / 100 = 15.5 -> round(15.5) = 16 -> 1.6
      jest.setSystemTime(now + 1550);
      const result = service.checkDuplicate("12345");
      expect(result.reason).toBe("Duplicate scan ignored (Scanned 1.6s ago)");

      // 1.54 seconds -> 1540 / 100 = 15.4 -> round(15.4) = 15 -> 1.5
      jest.setSystemTime(now + 1540);
      const result2 = service.checkDuplicate("12345");
      expect(result2.reason).toBe("Duplicate scan ignored (Scanned 1.5s ago)");
    });

    it("should return false when scanning the same barcode at exactly the threshold (3000ms)", () => {
      const now = 10000;
      jest.setSystemTime(now);
      service.recordScan("12345");

      // Advance time by exactly 3 seconds
      jest.setSystemTime(now + 3000);
      const result = service.checkDuplicate("12345");

      expect(result.isDuplicate).toBe(false);
    });

    it("should return false when scanning the same barcode after the threshold", () => {
      const now = 10000;
      jest.setSystemTime(now);
      service.recordScan("12345");

      // Advance time by 3.1 seconds
      jest.setSystemTime(now + 3100);
      const result = service.checkDuplicate("12345");

      expect(result.isDuplicate).toBe(false);
    });

    it("should return false when scanning a different barcode within threshold", () => {
      const now = 10000;
      jest.setSystemTime(now);
      service.recordScan("12345");

      // Even if time is within threshold
      jest.setSystemTime(now + 1000);
      const result = service.checkDuplicate("67890");

      expect(result.isDuplicate).toBe(false);
    });
  });

  describe("recordScan", () => {
    it("should update the last scan record to the new barcode and time", () => {
      const now = 10000;
      jest.setSystemTime(now);

      service.recordScan("A");

      // Verify A is recorded
      jest.setSystemTime(now + 100);
      expect(service.checkDuplicate("A").isDuplicate).toBe(true);

      // Record B
      const later = now + 2000;
      jest.setSystemTime(later);
      service.recordScan("B");

      // Verify B is recorded (as duplicate of itself immediately)
      expect(service.checkDuplicate("B").isDuplicate).toBe(true);

      // Verify A is no longer duplicate (because lastScan is now B)
      expect(service.checkDuplicate("A").isDuplicate).toBe(false);
    });
  });

  describe("resetHistory", () => {
    it("should clear the scan history so subsequent checks are not duplicates", () => {
      const now = 10000;
      jest.setSystemTime(now);
      service.recordScan("12345");

      // Verify it is duplicate
      jest.setSystemTime(now + 1000);
      expect(service.checkDuplicate("12345").isDuplicate).toBe(true);

      // Reset
      service.resetHistory();

      // Verify it is no longer duplicate
      const result = service.checkDuplicate("12345");
      expect(result.isDuplicate).toBe(false);
    });
  });
});
