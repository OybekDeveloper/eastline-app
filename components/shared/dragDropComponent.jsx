"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import Loader from "./loader";
import toast from "react-hot-toast";
import { getData, patchData, postData } from "@/lib/api.services";

export default function DragDropComponent({
  data,
  products,
  categories,
  param,
  id,
}) {
  const [usersList, setUsersList] = useState(
    data.sort((a, b) => a.uniqueId - b.uniqueId)
  );
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function onDragEnd(event) {
    const { active, over } = event;
    if (active.id === over?.id) {
      return;
    }
    setUsersList((users) => {
      const oldIndex = users.findIndex((user) => user.id === active.id);
      const newIndex = users.findIndex((user) => user.id === over?.id);
      return arrayMove(users, oldIndex, newIndex);
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSave = async () => {
    const updatedUsersList = usersList.map((item, idx) => ({
      ...item,
      uniqueId: idx + 1,
    }));

    try {
      setLoading(true);
      if (param === "changeBanner") {
        const filterData = updatedUsersList.map((item) => ({
          uniqueId: item.uniqueId,
          bannerId: item.bannerId ? item.bannerId : item.id,
          image: item.image,
          topCategoryId: item.topCategoryId,
          categoryId: item.categoryId,
          productId: item.productId,
        }));
        await postData("/api/bannerSort", filterData, "banner");
      } else if (param === "changeTopCategory") {
        const filterData = updatedUsersList.map((item) => ({
          uniqueId: Number(item.uniqueId),
          name: item.name,
          topCategoryId: String(
            item.topCategoryId ? item.topCategoryId : item.id
          ),
        }));
        await postData("/api/topCategorySort", filterData, "topCategory");
      } else if (param === "categorySort") {
        const filterData = updatedUsersList.map((item) => ({
          ...item,
          uniqueId: item.uniqueId,
          id: item.id,
        }));
        await patchData("/api/categorySort?all=true", filterData, "category");
      } else if (param === "productSort") {
        const filterData = updatedUsersList.map((item) => ({
          uniqueId: item.uniqueId,
          productId: item.productId ? item.productId : item.id,
          categoryId: item.categoryId,
          name: item.name,
        }));

        await Promise.all(
          filterData.map((product) =>
            postData("/api/productSort", product, "product").then((res) => {
              console.log({ productS: res });
            })
          )
        );
      }
      toast.success("Изменено успешно!");
    } catch (error) {
      console.log(error);
      toast.error("Что-то пошло не так, пожалуйста, обновите сайт!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let res = null;
      try {
        if (param === "changeBanner") {
          res = await getData("/api/bannerSort", "banner");
        } else if (param === "changeTopCategory") {
          res = await getData("/api/topCategorySort", "topCategory");
        } else if (param === "productSort") {
          res = await getData("/api/productSort", "product");
          res = res.filter((rs) => String(rs.categoryId) == String(id));
          console.log({ data, res });
        }
          setUsersList(data?.sort((a, b) => a.uniqueId - b.uniqueId));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [data, param]);

  if (isLoading) {
    return null;
  }

  console.log({ usersList });

  return (
    <div className="space-y-2">
      <ul className="bg-white shadow-md rounded-lg">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={usersList}
            strategy={verticalListSortingStrategy}
          >
            {usersList.map((user, idx) => (
              <SortableUser
                key={user.id}
                user={user}
                products={products}
                categories={categories}
                index={idx}
                param={param}
              />
            ))}
          </SortableContext>
        </DndContext>
      </ul>
      <div className="w-full flex justify-end items-center">
        <Button disabled={loading} onClick={handleSave}>
          {loading ? (
            <div className="flex items-center gap-4">
              <Loader />
              Загрузка...
            </div>
          ) : (
            "Сохранять"
          )}
        </Button>
      </div>
    </div>
  );
}

export function SortableUser({ param, user, categories, products, index }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: user.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  let name = "";
  if (param === "changeBanner") {
    if (user.productId) {
      const productFind = products.find((c) => c.id === user.productId);
      name = productFind?.name || "Unknown Product";
    } else {
      const categoryFind = categories.find((c) => c.id === user.categoryId);
      name = categoryFind?.name || "Unknown Category";
    }
  } else if (param === "productSort") {
    name = user?.name;
  } else {
    name = user.name || "Unknown";
  }

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="gap-4 textSmall2 flex items-center border-b border-gray-200 py-2 px-4 touch-action-none"
    >
      <h1>{index + 1}</h1>
      <div className="ml-4 text-gray-700">{name}</div>
    </li>
  );
}
