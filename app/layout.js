import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { Toaster } from "react-hot-toast";
import ChatBot from "@/components/shared/chat-bot";
import { getData } from "@/lib/api.services";
import JsonLd from "@/components/seo/json-ld";
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  siteConfig,
} from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.company }],
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.siteUrl,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.defaultImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} hero image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.defaultImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function RootLayout({ children }) {
  let topCategories = [];
  let categorySortData = [];
  let topCategoriesSort = [];
  let productsData = [];
  let background = [];
  let contactData = [];
  try {
    [
      topCategories,
      categorySortData,
      topCategoriesSort,
      productsData,
      background,
      contactData,
    ] = await Promise.all([
      getData("/api/topCategory", "topCategory"),
      getData("/api/categorySort", "category"),
      getData("/api/topCategorySort", "topCategory"),
      getData("/api/product", "product"),
      getData("/api/background", "background"),
      getData("/api/contact", "contact"),
    ]);
  } catch (error) {
    console.error("Error rendering RootLayout:", error);
  }

  const hasDataError = !topCategories.length && !categorySortData.length;
  const organizationSchema = buildOrganizationJsonLd(contactData?.[0]);
  const websiteSchema = buildWebsiteJsonLd();

  return (
    <html lang="ru">
      <body className={`${inter.className} min-h-screen relative flex flex-col`}>
        <JsonLd id="organization-schema" data={organizationSchema} />
        <JsonLd id="website-schema" data={websiteSchema} />
        <NextTopLoader
          color="hsl(210 40% 96.1%)"
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
                      <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={999999999}
          showAtBottom={false}
        />
        <Header
          categorySortData={categorySortData}
          topCategoriesSort={topCategoriesSort}
          contactData={contactData?.[0]}
          background={background}
          topCategories={topCategories}
          productsData={productsData}
        />
        <div className="grow">
          {hasDataError ? (
            <div className="p-10 text-center text-sm text-red-600">
              Не удалось загрузить контент. Попробуйте обновить страницу позже.
            </div>
          ) : (
            children
          )}
        </div>
        <Footer contactData={contactData?.[0]} />
        <ChatBot />
        <Toaster position="bottom-left" reverseOrder={false} />
      </body>
    </html>
  );
}
