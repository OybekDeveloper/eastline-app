"use client";

import axios from "axios";
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
import { ApiService } from "@/lib/api.services";

function Getelements({ param }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refleshData, setRefleshData] = useState(false);
  const entityName = extractEntityName(param);

  const handleReflesh = () => {
    setRefleshData(!refleshData);
  };

  useEffect(() => {
    async function getData() {
      try {
        const res = await ApiService.getData(`/api/${entityName}`);
        setData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [entityName, refleshData]);

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
            columns={getColumn(param)}
            data={data}
            loading={loading}
            handleReflesh={handleReflesh}
          />
        </div>
      )}
    </div>
  );
}

export default Getelements;
