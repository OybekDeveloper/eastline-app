export const mapCustomMetaEntries = (entries = []) => {
  return entries.reduce((acc, entry) => {
    if (entry?.key && entry?.value) {
      acc[entry.key] = entry.value;
    }
    return acc;
  }, {});
};

export const toCustomMetaArray = (value) => {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).map(([key, val]) => ({
    key,
    value: String(val),
  }));
};

export const stringifyStructuredData = (value) => {
  if (!value) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
};
