const uploadsOrigin =
  process.env.NEXT_PUBLIC_UPLOADS_ORIGIN?.replace(/\/$/, "") ||
  process.env.UPLOADS_ORIGIN?.replace(/\/$/, "") ||
  "https://elt-server.uz";

const imagePathPattern = /^\/images\/.+/i;

export function getUploadsOrigin() {
  return uploadsOrigin;
}

export function toStoredUploadPath(value) {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  if (imagePathPattern.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (imagePathPattern.test(url.pathname)) {
      return url.pathname;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

export function toPublicImageUrl(value) {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  if (imagePathPattern.test(trimmed)) {
    return `${uploadsOrigin}${trimmed}`;
  }

  try {
    const url = new URL(trimmed);
    if (imagePathPattern.test(url.pathname)) {
      return `${uploadsOrigin}${url.pathname}`;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

function normalizeMediaValue(key, value) {
  if (value == null) return value;

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return toPublicImageUrl(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "string" ? toPublicImageUrl(item) : normalizeMediaPayload(item)
    );
  }

  if (typeof value === "object") {
    if (key === "og_image" || key === "twitter_image") {
      if (typeof value.url === "string") {
        return {
          ...value,
          url: toPublicImageUrl(value.url),
        };
      }
    }

    return normalizeMediaPayload(value);
  }

  return value;
}

export function normalizeMediaPayload(payload) {
  if (payload == null) return payload;

  if (payload instanceof Date) {
    return payload.toISOString();
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeMediaPayload(item));
  }

  if (typeof payload !== "object") {
    return payload;
  }

  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if (key === "image" || key === "og_image" || key === "twitter_image") {
        return [key, normalizeMediaValue(key, value)];
      }

      if (Array.isArray(value) || (value && typeof value === "object")) {
        return [key, normalizeMediaPayload(value)];
      }

      return [key, value];
    })
  );
}
