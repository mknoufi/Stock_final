export const toFiniteNumber = (value: unknown): number => {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

const asText = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
};

export const formatInr = (value: unknown): string => {
  return `\u20B9${toFiniteNumber(value).toLocaleString()}`;
};

export const asArray = <T>(value: unknown): T[] => {
  return Array.isArray(value) ? (value as T[]) : [];
};

export const asRecordArray = <T extends Record<string, unknown>>(value: unknown): T[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is T => !!entry && typeof entry === "object" && !Array.isArray(entry),
  );
};

export const toParamString = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    for (const candidate of value) {
      const text = asText(candidate);
      if (text) return text;
    }
    return undefined;
  }
  return asText(value);
};

export const getApiErrorMessage = (value: unknown, fallback: string): string => {
  const direct = asText((value as { message?: unknown })?.message);
  if (direct) return direct;

  if (!isRecord(value)) {
    return fallback;
  }

  const errorMessage = isRecord(value.error) ? asText(value.error.message) : undefined;
  if (errorMessage) return errorMessage;

  if (isRecord(value.response) && isRecord(value.response.data)) {
    const nestedMessage =
      asText(value.response.data.message) ||
      (isRecord(value.response.data.error) ? asText(value.response.data.error.message) : undefined) ||
      (isRecord(value.response.data.detail)
        ? asText(value.response.data.detail.message)
        : asText(value.response.data.detail));
    if (nestedMessage) return nestedMessage;
  }

  return fallback;
};

export const normalizeStatus = (value: unknown): string => {
  return typeof value === "string" ? value : "";
};

export const toCsvString = async (payload: unknown): Promise<string> => {
  if (typeof payload === "string") return payload;
  if (payload == null) return "";

  if (payload instanceof Blob) {
    return payload.text();
  }

  if (payload instanceof ArrayBuffer) {
    return new TextDecoder().decode(payload);
  }

  if (ArrayBuffer.isView(payload)) {
    const { buffer, byteOffset, byteLength } = payload;
    const sliced = buffer.slice(byteOffset, byteOffset + byteLength);
    return new TextDecoder().decode(sliced);
  }

  const maybeText = (payload as { text?: () => Promise<unknown> }).text;
  if (typeof maybeText === "function") {
    const textValue = await maybeText();
    return typeof textValue === "string" ? textValue : String(textValue ?? "");
  }

  return String(payload);
};
