const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://elt.uz";
const siteUrl = rawSiteUrl.endsWith("/")
  ? rawSiteUrl.slice(0, -1)
  : rawSiteUrl;

export const siteConfig = {
  name: "EAST LINE TELEKOM",
  company: "OOO «EAST LINE TELEKOM»",
  description:
    "EAST LINE TELEKOM поставляет системы безопасности, мини АТС и оборудование для видеонаблюдения с установкой и обслуживанием по всему Узбекистану.",
  siteUrl,
  locale: "ru_RU",
  keywords: [
    "системы безопасности",
    "мини АТС",
    "видеонаблюдение Ташкент",
    "East Line Telekom",
    "телеком оборудование Узбекистан",
  ],
  contactEmail: "info@elt.uz",
  defaultImage: new URL("/img/ServiceBanner.jpg", siteUrl).toString(),
  address: "г. Ташкент, Яшнабадский район, ул. Махзуна, 1-тупик, дом 14А",
};

export const absoluteUrl = (path = "/") => {
  if (!path) return siteUrl;
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
};

const SEO_LIMITS = {
  title: 60,
  description: 160,
};
const KEYWORD_LIMIT = 25;
const DEFAULT_ROBOTS = "index, follow";
const TWITTER_CARD_CHOICES = ["summary", "summary_large_image"];
const ALLOWED_OG_TYPES = new Set([
  "website",
  "article",
  "book",
  "profile",
  "music.song",
  "music.album",
  "music.playlist",
  "music.radio_station",
  "video.movie",
  "video.episode",
  "video.tv_show",
  "video.other",
]);

const defaultOgImage = {
  url: siteConfig.defaultImage,
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} hero image`,
};

const sanitizeMetaString = (value, maxLength) => {
  if (typeof value !== "string") return undefined;
  const cleaned = value
    .replace(/<[^>]+>/g, "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (!cleaned) return undefined;
  if (typeof maxLength === "number" && cleaned.length > maxLength) {
    return cleaned.slice(0, maxLength).trim();
  }
  return cleaned;
};

const normalizeKeywordList = (raw) => {
  const values = Array.isArray(raw)
    ? raw
    : typeof raw === "string"
    ? raw.split(/[,;]/)
    : [];
  const normalized = values
    .map((value) => sanitizeMetaString(value, 40))
    .filter(Boolean);
  const unique = [...new Set(normalized)];
  return unique.slice(0, KEYWORD_LIMIT);
};

const sanitizeUrl = (value) => {
  if (!value) return undefined;
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!trimmed) return undefined;
  const cleaned = trimmed.replace(/\s+/g, "");
  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned;
  }
  return absoluteUrl(cleaned.startsWith("/") ? cleaned : `/${cleaned}`);
};

const normalizeImageEntry = (value) => {
  if (!value) return undefined;
  if (typeof value === "string") {
    const url = sanitizeUrl(value);
    if (!url) return undefined;
    return {
      url,
      alt: siteConfig.name,
    };
  }
  if (typeof value === "object" && value.url) {
    const url = sanitizeUrl(value.url);
    if (!url) return undefined;
    const image = {
      url,
      alt: sanitizeMetaString(value.alt) || siteConfig.name,
    };
    if (value.width) {
      const width = Number(value.width);
      if (!Number.isNaN(width)) image.width = width;
    }
    if (value.height) {
      const height = Number(value.height);
      if (!Number.isNaN(height)) image.height = height;
    }
    return image;
  }
  return undefined;
};

const buildOpenGraphImages = (rawInput) => {
  const candidates = Array.isArray(rawInput)
    ? rawInput
    : rawInput
    ? [rawInput]
    : [];
  const images = candidates
    .map((candidate) => normalizeImageEntry(candidate))
    .filter(Boolean);
  if (images.length) return images;
  return [
    {
      url: defaultOgImage.url,
      width: defaultOgImage.width,
      height: defaultOgImage.height,
      alt: defaultOgImage.alt,
    },
  ];
};

const buildTwitterImages = (twitterImage, openGraphImages) => {
  const images = [];
  if (twitterImage) {
    const normalized = normalizeImageEntry(twitterImage);
    if (normalized?.url) {
      images.push(normalized.url);
    }
  }
  if (!images.length) {
    images.push(
      ...openGraphImages.map((image) => image.url).filter(Boolean)
    );
  }
  return images;
};

const sanitizeCustomMeta = (value) => {
  if (!value || typeof value !== "object") return undefined;
  const sanitized = {};
  Object.entries(value).forEach(([key, val]) => {
    const cleanedKey = sanitizeMetaString(key, 50);
    const cleanedValue = sanitizeMetaString(
      typeof val === "string" ? val : String(val),
      160
    );
    if (cleanedKey && cleanedValue) {
      sanitized[cleanedKey] = cleanedValue;
    }
  });
  return Object.keys(sanitized).length ? sanitized : undefined;
};

const normalizeStructuredData = (value) => {
  if (!value) return undefined;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === "object" ? parsed : undefined;
    } catch (error) {
      console.error("Invalid structured data JSON:", error);
      return undefined;
    }
  }
  if (typeof value === "object") {
    return value;
  }
  return undefined;
};

const sanitizeOpenGraph = (raw) => {
  if (!raw || typeof raw !== "object") return undefined;
  const rawOgType = sanitizeMetaString(raw.og_type, 30);
  const normalizedOgType = rawOgType?.toLowerCase();
  return {
    og_title: sanitizeMetaString(raw.og_title, SEO_LIMITS.title),
    og_description: sanitizeMetaString(raw.og_description, SEO_LIMITS.description),
    og_image: normalizeImageEntry(raw.og_image),
    og_type: ALLOWED_OG_TYPES.has(normalizedOgType)
      ? normalizedOgType
      : undefined,
    og_locale: sanitizeMetaString(raw.og_locale, 20),
  };
};

const sanitizeTwitter = (raw) => {
  if (!raw || typeof raw !== "object") return undefined;
  const card =
    typeof raw.twitter_card === "string" &&
    TWITTER_CARD_CHOICES.includes(raw.twitter_card)
      ? raw.twitter_card
      : undefined;
  return {
    twitter_card: card,
    twitter_title: sanitizeMetaString(raw.twitter_title, SEO_LIMITS.title),
    twitter_description: sanitizeMetaString(
      raw.twitter_description,
      SEO_LIMITS.description
    ),
    twitter_image: normalizeImageEntry(raw.twitter_image),
  };
};

const sanitizeSeoRecord = (raw = {}) => {
  if (!raw || typeof raw !== "object") return {};
  return {
    meta_title: sanitizeMetaString(raw.meta_title, SEO_LIMITS.title),
    meta_description: sanitizeMetaString(raw.meta_description, SEO_LIMITS.description),
    meta_keywords: normalizeKeywordList(raw.meta_keywords),
    meta_robots: sanitizeMetaString(raw.meta_robots, 120),
    canonical_url: sanitizeUrl(raw.canonical_url),
    open_graph: sanitizeOpenGraph(raw.open_graph),
    twitter: sanitizeTwitter(raw.twitter),
    structured_data: normalizeStructuredData(raw.structured_data),
    custom_meta: sanitizeCustomMeta(raw.custom_meta),
  };
};

const mergeObjects = (primary = {}, fallback = {}) => ({
  ...fallback,
  ...primary,
});

const mergeSeoRecords = (primary = {}, fallback = {}) => {
  const mergedCustomMeta = {
    ...(fallback.custom_meta || {}),
    ...(primary.custom_meta || {}),
  };
  const keywords =
    primary.meta_keywords?.length
      ? primary.meta_keywords
      : fallback.meta_keywords?.length
      ? fallback.meta_keywords
      : undefined;
  return {
    meta_title: primary.meta_title ?? fallback.meta_title,
    meta_description: primary.meta_description ?? fallback.meta_description,
    meta_keywords: keywords,
    meta_robots: primary.meta_robots ?? fallback.meta_robots,
    canonical_url: primary.canonical_url ?? fallback.canonical_url,
    open_graph: mergeObjects(primary.open_graph, fallback.open_graph),
    twitter: mergeObjects(primary.twitter, fallback.twitter),
    structured_data: primary.structured_data ?? fallback.structured_data,
    custom_meta:
      Object.keys(mergedCustomMeta).length > 0 ? mergedCustomMeta : undefined,
  };
};

const DEFAULT_SEO_RECORD = {
  meta_title: siteConfig.name,
  meta_description: siteConfig.description,
  meta_keywords: siteConfig.keywords,
  meta_robots: DEFAULT_ROBOTS,
  open_graph: {
    og_title: siteConfig.name,
    og_description: siteConfig.description,
    og_image: {
      url: defaultOgImage.url,
      width: defaultOgImage.width,
      height: defaultOgImage.height,
      alt: defaultOgImage.alt,
    },
    og_type: "website",
    og_locale: siteConfig.locale,
  },
  twitter: {
    twitter_card: "summary_large_image",
    twitter_title: siteConfig.name,
    twitter_description: siteConfig.description,
    twitter_image: {
      url: siteConfig.defaultImage,
      alt: `${siteConfig.name} hero image`,
    },
  },
};

const DEFAULT_SEO = sanitizeSeoRecord(DEFAULT_SEO_RECORD);

const buildCustomMetaTags = (customMeta) => {
  if (!customMeta) return undefined;
  return customMeta;
};

export const sanitizeSeoInput = (raw) => sanitizeSeoRecord(raw);

export const prepareSeoPayload = (payload = {}) => {
  const sanitizedSeo = sanitizeSeoInput(payload.seo || {});
  const legacySeo = sanitizeSeoInput({
    meta_title: payload.meta_title,
    meta_description: payload.meta_description,
  });
  const mergedSeo = {
    ...legacySeo,
    ...sanitizedSeo,
  };
  const cleaned = JSON.parse(JSON.stringify(mergedSeo));
  return Object.keys(cleaned).length ? cleaned : null;
};

export const buildMetadata = ({
  seo,
  fallbackSeo,
  title,
  description,
  path = "/",
  images,
  type = "website",
  robots,
  canonical,
  customMeta,
} = {}) => {
  const overrideSeo = sanitizeSeoRecord({
    meta_title: title,
    meta_description: description,
    meta_robots: robots,
    canonical_url: canonical,
    custom_meta: customMeta,
  });

  const fallback = mergeSeoRecords(
    sanitizeSeoRecord(fallbackSeo),
    DEFAULT_SEO
  );

  const resolvedSeo = mergeSeoRecords(
    overrideSeo,
    mergeSeoRecords(sanitizeSeoRecord(seo), fallback)
  );

  const finalTitle =
    resolvedSeo.meta_title || DEFAULT_SEO.meta_title || siteConfig.name;
  const finalDescription =
    resolvedSeo.meta_description || DEFAULT_SEO.meta_description || siteConfig.description;
  const fallbackCanonical = path ? absoluteUrl(path) : siteConfig.siteUrl;
  const canonicalUrl = resolvedSeo.canonical_url || fallbackCanonical;
  const imageSource = images ?? resolvedSeo.open_graph?.og_image;
  const openGraphImages = buildOpenGraphImages(imageSource);
  const robotsDirective =
    resolvedSeo.meta_robots || DEFAULT_SEO.meta_robots || DEFAULT_ROBOTS;
  const keywords =
    resolvedSeo.meta_keywords?.length
      ? resolvedSeo.meta_keywords
      : DEFAULT_SEO.meta_keywords;
  const openGraphTitle =
    resolvedSeo.open_graph?.og_title || finalTitle || siteConfig.name;
  const openGraphDescription =
    resolvedSeo.open_graph?.og_description || finalDescription;
  const openGraphTypeFromSeo = resolvedSeo.open_graph?.og_type;
  const normalizedType = typeof type === "string" ? type.toLowerCase() : undefined;
  const openGraphType =
    openGraphTypeFromSeo && ALLOWED_OG_TYPES.has(openGraphTypeFromSeo)
      ? openGraphTypeFromSeo
      : normalizedType && ALLOWED_OG_TYPES.has(normalizedType)
      ? normalizedType
      : "website";
  const openGraphLocale =
    resolvedSeo.open_graph?.og_locale || siteConfig.locale;
  const twitterCard =
    TWITTER_CARD_CHOICES.includes(resolvedSeo.twitter?.twitter_card)
      ? resolvedSeo.twitter.twitter_card
      : "summary_large_image";
  const twitterTitle =
    resolvedSeo.twitter?.twitter_title || finalTitle || siteConfig.name;
  const twitterDescription =
    resolvedSeo.twitter?.twitter_description || finalDescription;
  const twitterImages = buildTwitterImages(
    resolvedSeo.twitter?.twitter_image,
    openGraphImages
  );
  const additionalMeta = buildCustomMetaTags(resolvedSeo.custom_meta);

  return {
    title: finalTitle,
    description: finalDescription,
    keywords,
    robots: robotsDirective,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: openGraphLocale,
      type: openGraphType,
      images: openGraphImages,
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImages,
    },
    ...(additionalMeta && { other: additionalMeta }),
  };
};

export const buildBreadcrumbJsonLd = (items = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path || "/"),
  })),
});

export const buildCollectionPageJsonLd = ({
  name,
  description,
  url,
  items = [],
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url: absoluteUrl(url),
  isPartOf: siteConfig.siteUrl,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  },
});

export const buildProductJsonLd = ({
  product,
  url,
  categoryName,
  price,
  currency = "UZS",
  availability = "https://schema.org/InStock",
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product?.name,
  description: product?.description,
  sku: product?.id,
  category: categoryName,
  brand: {
    "@type": "Brand",
    name: product?.brand || siteConfig.name,
  },
  image: product?.image || [],
  offers: {
    "@type": "Offer",
    url: absoluteUrl(url),
    priceCurrency: currency,
    price: price,
    itemCondition: "https://schema.org/NewCondition",
    availability,
  },
});

export const buildOrganizationJsonLd = (contactData) => {
  const {
    company_name,
    address,
    phone1,
    phone2,
    email,
    telegram,
    telegram_bot,
    instagram,
    facebook,
    youtube,
  } = contactData || {};

  const sameAs = [telegram, telegram_bot, instagram, facebook, youtube].filter(
    Boolean
  );

  const contactPoint = [phone1, phone2]
    .filter(Boolean)
    .map((phone) => ({
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "sales",
      availableLanguage: ["ru", "uz"],
    }));

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company_name || siteConfig.company,
    url: siteConfig.siteUrl,
    email: email || siteConfig.contactEmail,
    logo: new URL("/img/Logo.svg", siteConfig.siteUrl).toString(),
    sameAs,
    address: {
      "@type": "PostalAddress",
      streetAddress: address || siteConfig.address,
      addressCountry: "UZ",
    },
    contactPoint,
  };
};

export const buildWebsiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.siteUrl}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const buildContactPageJsonLd = (contactData) => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  description:
    "Контактная информация EAST LINE TELEKOM для коммерческих запросов и поддержки.",
  url: absoluteUrl("/contacts"),
  mainEntity: {
    "@type": "Organization",
    name: contactData?.company_name || siteConfig.company,
    email: contactData?.email || siteConfig.contactEmail,
    telephone: contactData?.phone1 || "",
    address: {
      "@type": "PostalAddress",
      streetAddress: contactData?.address || siteConfig.address,
      addressCountry: "UZ",
    },
  },
});
