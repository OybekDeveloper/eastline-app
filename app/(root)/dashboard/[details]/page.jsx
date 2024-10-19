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
import db from "@/db/db";
import { ApiService } from "@/lib/api.services";
import React from "react";

// If you're using Next.js app directory, use this function to handle server-side data fetching
const Create = async ({ params }) => {
  // Fetch data here for pre-rendering
  const [topCategories, categories, products] = await Promise.all([
    ApiService.getData("/api/topCategory", "topCategory"),
    ApiService.getData("/api/category", "category"),
    ApiService.getData("/api/product", "product"),
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
