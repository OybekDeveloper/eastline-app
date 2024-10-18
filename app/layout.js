import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { Toaster } from "react-hot-toast";
import ChatBot from "@/components/shared/chat-bot";
import { ApiService } from "@/lib/api.services";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EAST LINE TELEKOM",
  description: "EAST LINE TELEKOM",
  og: {
    type: "website",
    title: "EAST LINE TELEKOM",
    description: "EAST LINE TELEKOM",
    url: "https://eastline-app.vercel.app/",
    image: "https://eastline-app.vercel.app/logo.svg",
  },
  twitter: {
    card: "summary_large_image",
    title: "EAST LINE TELEKOM",
    description: "EAST LINE TELEKOM",
    image: "https://eastline-app.vercel.app/logo.svg",
  },
  keywords: ["  ", "east line telecom"],
  author: "EAST LINE TELEKOM",
  robots: "index, follow",
  canonical: "https://eastline-app.vercel.app/",
  viewport: "width=device-width, initial-scale=1",
  charSet: "utf-8",
};

export default async function RootLayout({ children }) {
  const topCategories = await ApiService.getData(
    "/api/topCategory",
    "topCategory"
  );
  const topCategoriesSort = await ApiService.getData(
    "/api/topCategorySort",
    "topCategory"
  );
  const productsData = await ApiService.getData("/api/product", "product");
  const background = await ApiService.getData("/api/background", "background");
  const contactData = await ApiService.getData("/api/contact", "contact");

  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="C3o3vKTwERqa9wb0mxW-jzSXaYZzoj8bv14Vj7JoPKc"
        />
        <meta name="yandex-verification" content="e332936c74782e28" />
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.og.title} />
        <meta property="og:description" content={metadata.og.description} />
        <meta property="og:url" content={metadata.og.url} />
        <meta property="og:image" content={metadata.og.image} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta
          name="twitter:description"
          content={metadata.twitter.description}
        />
        <meta name="twitter:image" content={metadata.twitter.image} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <meta name="author" content={metadata.author} />
        <meta name="robots" content={metadata.robots} />
        <link rel="canonical" href={metadata.canonical} />
        <meta name="viewport" content={metadata.viewport} />
        <meta charSet={metadata.charSet} />
        <title>{metadata.title}</title>
      </head>
      <body
        className={`${inter.className} min-h-screen relative flex flex-col`}
      >
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
          topCategoriesSort={topCategoriesSort}
          contactData={contactData[0]}
          background={background}
          topCategories={topCategories}
          productsData={productsData}
        />
        <div className="grow">{children}</div>
        <Footer contactData={contactData[0]} />
        <ChatBot />
        <Toaster position="bottom-left" reverseOrder={false} />
      </body>
    </html>
  );
}
