import { topCategory } from "@/components/tableColumns/topCategory";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { buildCategoryPath } from "@/lib/slugs";

const NavigationProduct = (props) => {
  const { topProductsData, categoryData, product } = props;

  return (
    <div className="w-[95%] flex-col lg:w-10/12 lg:mx-auto justify-end items-start md:justify-center mx-0 ml-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{topProductsData[0]?.name}</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <BreadcrumbLink
                href={buildCategoryPath(topProductsData[0], categoryData[0])}
              >
                {categoryData[0]?.name}
              </BreadcrumbLink>
            </BreadcrumbPage>
          </BreadcrumbItem>
          {product && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product[0]?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default NavigationProduct;
