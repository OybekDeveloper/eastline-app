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

const defaultOgImage = {
  url: siteConfig.defaultImage,
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} hero image`,
};

export const buildMetadata = ({
  title = siteConfig.name,
  description = siteConfig.description,
  path = "/",
  images = [],
  type = "website",
  robots,
} = {}) => {
  const canonical = absoluteUrl(path);
  const imageList =
    images && images.length
      ? images
      : [
          {
            url: defaultOgImage.url,
            width: defaultOgImage.width,
            height: defaultOgImage.height,
            alt: defaultOgImage.alt,
          },
        ];

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type,
      locale: siteConfig.locale,
      images: imageList,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageList.map((image) =>
        typeof image === "string" ? image : image.url
      ),
    },
    robots,
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
