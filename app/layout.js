import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import db from "@/db/db";
import { Toaster } from "react-hot-toast";
import { EdgeStoreProvider } from "@/lib/edgestore";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EAST LINE",
  description: "EAST LINE TELEKOM", // Consider adding a more descriptive and keyword-rich meta description
  // Additional Open Graph and Twitter meta tags (optional)
  og: {
    type: "website",
    title: "EAST LINE",
    description: "EAST LINE TELEKOM", // Use the same description here or a unique one
    url: "https://eastline-app.vercel.app/", // Replace with your actual website URL
    image: "https://eastline-app.vercel.app//logo.svg", // Replace with the URL of your website's main image
  },
  twitter: {
    card: "summary_large_image",
    title: "EAST LINE",
    description: "EAST LINE TELEKOM", // Use the same description here or a unique one
    image: "https://eastline-app.vercel.app//logo.svg", // Replace with the URL of your website's main image
  },
  // Additional meta tags for SEO, indexing, and customization (optional)
  keywords: ["east line", "east line telecom" /* Add more relevant keywords */], // Define relevant keywords
  author: "EAST LINE TELEKOM", // Or the name of your company/individual
  robots: "index, follow", // Allow search engines to index and follow your website
  canonical: "https://eastline-app.vercel.app/", // Set the canonical URL to prevent duplicate content issues
  viewport: "width=device-width, initial-scale=1", // Ensure proper responsiveness across devices
  charSet: "utf-8", // Specify the character encoding for global accessibility
};

export default  function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen relative flex flex-col`}
      >
        <EdgeStoreProvider>
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
          <Header  />
          <div className="grow">{children}</div>
          <Footer />
          {/* <ChatBot /> */}
          <Toaster position="bottom-right" reverseOrder={false} />
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
