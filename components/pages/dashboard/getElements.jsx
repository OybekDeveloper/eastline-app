"use client";

import { DataTable } from "@/components/shared/data-table";
import { topCategory } from "@/components/tableColumns/topCategory";
import { category } from "@/components/tableColumns/category";
import { product } from "@/components/tableColumns/product";
import { sertificate } from "@/components/tableColumns/sertificate";
import { extractEntityName } from "@/lib/utils";
import { partner } from "@/components/tableColumns/partner";
import { license } from "@/components/tableColumns/license";
import { news } from "@/components/tableColumns/news";
import CurrencySum from "@/components/forms/currency";
import Admin from "@/components/forms/admin";
import { banner } from "@/components/tableColumns/banner";
import { useEffect, useState } from "react";
import { useEvent } from "@/store/event";
import axios from "axios";
import { background } from "@/components/tableColumns/background";
import { contacts } from "@/components/tableColumns/contacts";

function Getelements({ param, topCategories, products, categories }) {
  const { reflesh, setTableData } = useEvent();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const entityName = extractEntityName(param);

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get(`/api/${entityName}`, {
          next: { tags: [`${param}`] },
        });
        setTableData(res.data.data);
        setData(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [entityName, reflesh]);

  function getColumn(prop) {
    switch (prop) {
      case "changeTopCategory":
        return topCategory;

      case "changeCategory":
        return category;

      case "changeProduct":
        return product;

      case "changeSertificate":
        return sertificate;

      case "changePartner":
        return partner;

      case "changeLicense":
        return license;

      case "changeNews":
        return news;
      case "changeBanner":
        return banner;
      case "changeBackground":
        return background;
      case "changeContact":
        return contacts;

      default:
        return null;
    }
  }

  return (
    <div className="w-full  py-10">
      {param == "changeCurrency" ? (
        <CurrencySum />
      ) : param == "changeAdmin" ? (
        <Admin />
      ) : (
        <div className="container mx-auto">
          <DataTable
            param={param}
            columns={getColumn(param)}
            data={data}
            loading={loading}
            topCategories={topCategories}
            products={products}
            categories={categories}
          />
        </div>
      )}
    </div>
  );
}

export default Getelements;
