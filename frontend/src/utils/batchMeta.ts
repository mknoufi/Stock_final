export const formatBatchMrp = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (!Number.isFinite(num)) return "-";
  return `₹${num.toFixed(2)}`;
};
