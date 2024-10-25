// components/UserList.tsx
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

export default function DragDropComponent({
  data,
  products,
  categories,
  param,
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
      if (param == "changeBanner") {
        // change banner code
        const filterData = updatedUsersList.map((item) => ({
          uniqueId: item.uniqueId,
          bannerId: item.bannerId ? item.bannerId : item.id,
          image: item.image,
          topCategoryId: item.topCategoryId,
          categoryId: item.categoryId,
          productId: item.productId,
        }));
        await axios.post("/api/bannerSort", filterData);
      } else if (param == "changeTopCategory") {
        // change top category code
        const filterData = updatedUsersList.map((item) => ({
          uniqueId: Number(item.uniqueId),
          name: item.name,
          topCategoryId: Number(
            item.topCategoryId ? item.topCategoryId : item.id
          ),
        }));
        await axios.post("/api/topCategorySort", filterData);
      } else if (param === "categorySort") {
        const filterData = updatedUsersList.map((item) => ({
          uniqueId: item.uniqueId,
          id: item.id,
        }));

        await axios.patch("/api/categorySort?all=true", filterData);
      }
      toast.success("Изменено успешно!");
    } catch (error) {
      toast.error("Что-то пошло не так, пожалуйста, обновите сайт!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let res = null;
      try {
        if (param == "changeBanner") {
          res = await axios.get("/api/bannerSort");
        }
        if (param == "changeTopCategory") {
          res = await axios.get("/api/topCategorySort");
          console.log(res);
        }
        if (res.data.data.length > 0) {
          setUsersList(res.data.data?.sort((a, b) => a.uniqueId - b.uniqueId));
        } else {
          setUsersList(data?.sort((a, b) => a.uniqueId - b.uniqueId));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [data, param]);
  if (isLoading) {
    return null;
  }
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
        <Button onClick={handleSave}>
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

// components/SortableUser.tsx

export function SortableUser({ param, user, categories, products, index }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: user.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  let name = "";
  if (param == "changeBanner") {
    if (user.productId) {
      const productFind = products.find((c) => c.id == user.productId);
      name = productFind?.name;
    } else {
      const categoryFind = categories.find((c) => c.id == user.categoryId);
      name = categoryFind?.name;
    }
  } else {
    name = user.name;
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
