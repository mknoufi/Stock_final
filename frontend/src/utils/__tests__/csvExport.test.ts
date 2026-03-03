/** @jest-environment jsdom */

import { convertToCSV, downloadCSV, exportItemsToCSV, exportVariancesToCSV } from "../csvExport";

describe("CSV Export Utils", () => {
  describe("convertToCSV", () => {
    it("should convert data to CSV string with headers", () => {
      const data = [
        { name: "Item 1", code: "C1", qty: 10 },
        { name: "Item 2", code: "C2", qty: 20 },
      ];
      const headers = ["name", "code", "qty"];
      const expected = "name,code,qty\nItem 1,C1,10\nItem 2,C2,20";
      expect(convertToCSV(data, headers)).toBe(expected);
    });

    it("should handle empty data array", () => {
      const headers = ["name", "code", "qty"];
      const expected = "name,code,qty";
      expect(convertToCSV([], headers)).toBe(expected);
    });

    it("should handle missing values in data", () => {
      const data = [
        { name: "Item 1", code: "C1" },
        { name: "Item 2", qty: 20 },
      ];
      const headers = ["name", "code", "qty"];
      // Missing values should be empty string
      const expected = "name,code,qty\nItem 1,C1,\nItem 2,,20";
      expect(convertToCSV(data, headers)).toBe(expected);
    });

    it("should escape values containing commas", () => {
      const data = [{ name: "Item, 1", code: "C1" }];
      const headers = ["name", "code"];
      const expected = 'name,code\n"Item, 1",C1';
      expect(convertToCSV(data, headers)).toBe(expected);
    });

    it("should escape values containing quotes", () => {
      const data = [{ name: 'Item "1"', code: "C1" }];
      const headers = ["name", "code"];
      const expected = 'name,code\n"Item ""1""",C1';
      expect(convertToCSV(data, headers)).toBe(expected);
    });

    it("should escape values containing quotes and commas", () => {
      const data = [{ name: 'Item, "1"', code: "C1" }];
      const headers = ["name", "code"];
      const expected = 'name,code\n"Item, ""1""",C1';
      expect(convertToCSV(data, headers)).toBe(expected);
    });
  });

  describe("exportItemsToCSV", () => {
    it("should correctly map item fields to CSV format", () => {
      const items = [
        {
          item_code: "I001",
          item_name: "Test Item",
          barcode: "123456",
          stock_qty: 100,
          mrp: 50.5,
          category: "Cat1",
          subcategory: "Sub1",
          uom_code: "PCS",
          uom_name: "Pieces",
          floor: "F1",
          rack: "R1",
          warehouse: "W1",
          verified: true,
          verified_by: "User1",
          verified_at: "2023-01-01T10:00:00Z",
          last_scanned_at: "2023-01-01T12:00:00Z",
        },
      ];

      const csv = exportItemsToCSV(items);
      const rows = csv.split("\n");
      const headers = rows[0]?.split(",") || [];
      const values = rows[1]?.split(",") || [];

      expect(headers).toEqual([
        "item_code",
        "item_name",
        "barcode",
        "stock_qty",
        "mrp",
        "category",
        "subcategory",
        "uom_code",
        "uom_name",
        "floor",
        "rack",
        "warehouse",
        "verified",
        "verified_by",
        "verified_at",
        "last_scanned_at",
      ]);

      expect(values[0]).toBe("I001");
      expect(values[1]).toBe("Test Item");
      expect(values[12]).toBe("Yes"); // verified
      expect(values[14]).toBe("2023-01-01T10:00:00.000Z"); // verified_at
    });

    it("should handle missing optional fields", () => {
      const items = [
        {
          item_code: "I002",
        },
      ];
      const csv = exportItemsToCSV(items);
      const rows = csv.split("\n");
      const values = rows[1]?.split(",") || [];

      expect(values[0]).toBe("I002");
      expect(values[3]).toBe("0"); // stock_qty default
      expect(values[12]).toBe("No"); // verified default (falsy)
    });
  });

  describe("exportVariancesToCSV", () => {
    it("should correctly map variance fields to CSV format", () => {
      const variances = [
        {
          item_code: "I001",
          item_name: "Test Item",
          system_qty: 100,
          verified_qty: 90,
          variance: -10,
          verified_by: "User1",
          verified_at: "2023-01-01T10:00:00Z",
          category: "Cat1",
          subcategory: "Sub1",
          floor: "F1",
          rack: "R1",
          warehouse: "W1",
        },
      ];

      const csv = exportVariancesToCSV(variances);
      const rows = csv.split("\n");
      const headers = rows[0]?.split(",") || [];
      const values = rows[1]?.split(",") || [];

      expect(headers).toEqual([
        "item_code",
        "item_name",
        "system_qty",
        "verified_qty",
        "variance",
        "verified_by",
        "verified_at",
        "category",
        "subcategory",
        "floor",
        "rack",
        "warehouse",
      ]);

      expect(values[0]).toBe("I001");
      expect(values[4]).toBe("-10");
      expect(values[6]).toBe("2023-01-01T10:00:00.000Z");
    });
  });

  describe("downloadCSV", () => {
    let createElementSpy: jest.SpyInstance;
    let appendChildSpy: jest.SpyInstance;
    let removeChildSpy: jest.SpyInstance;
    let createObjectURLSpy: jest.SpyInstance;
    let linkClickSpy: jest.Mock;
    let originalWindow: any;
    let originalDocument: any;
    let originalURL: any;

    beforeEach(() => {
      originalWindow = global.window;
      originalDocument = global.document;
      originalURL = global.URL;

      // Mock window
      if (typeof global.window === "undefined") {
        (global as any).window = {};
      }

      // Mock URL.createObjectURL
      createObjectURLSpy = jest.fn(() => "blob:url");

      const mockURL = {
        createObjectURL: createObjectURLSpy,
      };

      global.URL = mockURL as any;

      if (global.window) {
        Object.defineProperty(global.window, "URL", {
          value: mockURL,
          writable: true,
          configurable: true,
        });
      }

      // Mock document
      if (typeof global.document === "undefined") {
        (global as any).document = {
          createElement: jest.fn(),
          body: {
            appendChild: jest.fn(),
            removeChild: jest.fn(),
          },
        };
      }

      // Mock document.createElement
      linkClickSpy = jest.fn();
      const mockLink = {
        setAttribute: jest.fn(),
        style: { visibility: "" },
        click: linkClickSpy,
      };

      createElementSpy = jest
        .spyOn(global.document, "createElement")
        .mockReturnValue(mockLink as any);

      // Mock document.body methods
      appendChildSpy = jest
        .spyOn(global.document.body, "appendChild")
        .mockImplementation(() => mockLink as any);
      removeChildSpy = jest
        .spyOn(global.document.body, "removeChild")
        .mockImplementation(() => mockLink as any);

      // Mock Blob
      global.Blob = jest.fn((content) => ({ content })) as any;
    });

    afterEach(() => {
      jest.restoreAllMocks();
      global.window = originalWindow;
      global.document = originalDocument;
      global.URL = originalURL;
    });

    it("should trigger download on web", () => {
      const content = "header\nvalue";
      const filename = "test.csv";

      downloadCSV(content, filename);

      expect(global.Blob).toHaveBeenCalledWith([content], {
        type: "text/csv;charset=utf-8;",
      });
      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(linkClickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });
  });
});
