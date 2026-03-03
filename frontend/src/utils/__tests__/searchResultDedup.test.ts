import { dedupeSearchResultsPreferHigherStock } from "../searchResultDedup";

describe("dedupeSearchResultsPreferHigherStock", () => {
  it("keeps the higher-stock batch for the same item code", () => {
    const items = [
      { item_code: "ITM-001", batch_no: "A", stock_qty: 5, barcode: "111" },
      { item_code: "ITM-001", batch_no: "B", stock_qty: 12, barcode: "222" },
      { item_code: "ITM-002", batch_no: "C", stock_qty: 3, barcode: "333" },
    ];

    const deduped = dedupeSearchResultsPreferHigherStock(items);

    expect(deduped).toHaveLength(2);
    expect(deduped[0]).toMatchObject({
      item_code: "ITM-001",
      batch_no: "B",
      stock_qty: 12,
    });
    expect(deduped[1]).toMatchObject({ item_code: "ITM-002" });
  });

  it("uses current_stock when stock_qty is not present", () => {
    const items = [
      { item_code: "ITM-003", batch_no: "A", current_stock: 4 },
      { item_code: "ITM-003", batch_no: "B", current_stock: 9 },
    ];

    const deduped = dedupeSearchResultsPreferHigherStock(items);
    expect(deduped).toHaveLength(1);
    expect(deduped[0]).toMatchObject({ batch_no: "B", current_stock: 9 });
  });
});
