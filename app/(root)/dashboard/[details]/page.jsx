import BackgroundForm from "@/components/forms/background";
import BannerForm from "@/components/forms/banner";
import CategoryForm from "@/components/forms/category";
import { ContactForm } from "@/components/forms/contact";
import ContactsForm from "@/components/forms/contacts";
import LicenseForm from "@/components/forms/license";
import NewsForm from "@/components/forms/news";
import PartnerForm from "@/components/forms/partner";
import ProductForm from "@/components/forms/product";
import SelectReview from "@/components/forms/selectReview";
import SertificateForm from "@/components/forms/sertificate";
import TopCategoryForm from "@/components/forms/topCategory";
import Getelements from "@/components/pages/dashboard/getElements";
import { getData } from "@/lib/api.services";
import React from "react";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const formatted =
    params?.details?.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) => c.toUpperCase()) ||
    "Панель управления";
  return buildMetadata({
    title: formatted,
    description: "Рабочая зона для администраторов EAST LINE TELEKOM.",
    path: `/dashboard/${params?.details || ""}`,
    robots: {
      index: false,
      follow: false,
    },
  });
}

// If you're using Next.js app directory, use this function to handle server-side data fetching
const Create = async ({ params }) => {
  // Fetch data here for pre-rendering
  const [topCategories, categories, products] = await Promise.all([
    getData("/api/topCategory", "topCategory"),
    getData("/api/category", "category"),
    getData("/api/product", "product"),
  ]);

  // Handle the page rendering based on params.details
  const renderPage = () => {
    switch (params.details) {
      case "createTopCategory":
        return <TopCategoryForm />;
      case "createCategory":
        return <CategoryForm />;
      case "createProduct":
        return (
          <ProductForm categories={categories} topCategories={topCategories} />
        );
      case "createSertificate":
        return <SertificateForm />;
      case "createPartner":
        return <PartnerForm />;
      case "createLicense":
        return <LicenseForm />;
      case "createNews":
        return <NewsForm />;
      case "createBanner":
        return <BannerForm products={products} categories={categories} />;
      case "createBackground":
        return <BackgroundForm />;
      case "createContact":
        return <ContactsForm />;
      case "selectReview":
        return <SelectReview products={products} categories={categories} />;
      default:
        return (
          <Getelements
            param={params.details}
            topCategories={topCategories}
            products={products}
            categories={categories}
          />
        );
    }
  };

  return <>{renderPage()}</>;
};

export default Create;
