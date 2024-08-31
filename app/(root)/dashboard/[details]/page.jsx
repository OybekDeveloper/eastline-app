import BannerForm from "@/components/forms/banner";
import CategoryForm from "@/components/forms/category";
import LicenseForm from "@/components/forms/license";
import NewsForm from "@/components/forms/news";
import PartnerForm from "@/components/forms/partner";
import ProductForm from "@/components/forms/product";
import SertificateForm from "@/components/forms/sertificate";
import TopCategoryForm from "@/components/forms/topCategory";
import Getelements from "@/components/pages/dashboard/getElements";
import db from "@/db/db";
import React from "react";

async function Create({ params }) {
  const topCategories = await db.topCategory.findMany({
    include: {
      categories: true,
    },
  });
  const categories = await db.category.findMany({
    include: {
      products: true,
    },
  });
  const products = await db.product.findMany();
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
        return (
          <BannerForm
            products={products}
            categories={categories}
          />
        );

      default:
        return <Getelements param={params.details} />;
    }
  };
  return <>{renderPage()}</>;
}
export default Create;
