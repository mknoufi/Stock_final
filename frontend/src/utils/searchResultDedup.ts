type SearchResultLike = {
  item_code?: string | number | null;
  barcode?: string | number | null;
  item_name?: string | null;
  name?: string | null;
  stock_qty?: number | string | null;
  current_stock?: number | string | null;
};

const getNormalizedKey = (item: SearchResultLike): string | null => {
  const keySource = item.item_code ?? item.barcode ?? item.item_name ?? item.name;
  if (keySource === null || keySource === undefined) return null;
  const normalized = String(keySource).trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const getStock = (item: SearchResultLike): number =>
  toNumber(item.stock_qty ?? item.current_stock ?? 0);

/**
 * Deduplicate search results while preferring the variant with higher stock
 * for identical item keys (item_code -> barcode -> item_name -> name).
 */
export const dedupeSearchResultsPreferHigherStock = <T extends SearchResultLike>(
  items: T[],
): T[] => {
  const result: T[] = [];
  const keyToIndex = new Map<string, number>();

  for (const item of items) {
    const key = getNormalizedKey(item);
    if (!key) {
      result.push(item);
      continue;
    }

    const existingIndex = keyToIndex.get(key);
    if (existingIndex === undefined) {
      keyToIndex.set(key, result.length);
      result.push(item);
      continue;
    }

    const existingItem = result[existingIndex];
    if (!existingItem || getStock(item) > getStock(existingItem)) {
      result[existingIndex] = item;
    }
  }

  return result;
};
