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
import { ApiService } from "@/lib/api.services";

export default function DragDropComponent({
  data,
  products,
  categories,
  param,
}) {
  const [usersList, setUsersList] = useState(data);

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
    console.log(updatedUsersList, "11111111111111");

    if (param == "changeBanner") {
      // change banner code
      const filterData = updatedUsersList.map((item) => ({
        uniqueId: item.uniqueId,
        bannerId: item.id,
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
        topCategoryId: Number(item.id),
      }));
      console.log(filterData);

      await axios.post("/api/topCategorySort", filterData);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let res = null;
      try {
        if (param == "changeBanner") {
          res = await ApiService.getData("/api/bannerSort");
        }
        if (param == "changeTopCategory") {
          res = await ApiService.getData("/api/topCategorySort");
        }
        console.log(res,"This is res");

        if (res) {
          setUsersList(res);
          console.log(res);
        } else {
          setUsersList(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [data]);

  console.log(usersList, "this is faucasdfas");

  return (
    <div className="space-y-2">
      <h2 className="font-bold mb-4 textNormal3">Регулирование</h2>
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
              />
            ))}
          </SortableContext>
        </DndContext>
      </ul>
      <div className="w-full flex justify-end items-center">
        <Button onClick={handleSave}>Сохранять</Button>
      </div>
    </div>
  );
}

// components/SortableUser.tsx

export function SortableUser({ user, categories, products, index }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: user.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const product = products.find((c) => c.id == user.productId);
  const category = products.find((c) => c.categoryId == user.categoryId);
  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="gap-4 textSmall3 flex items-center border-b border-gray-200 py-2 px-4 touch-action-none"
    >
      <h1>{index + 1}</h1>
      {product ? (
        <div className="ml-4 text-gray-700">{product?.name}</div>
      ) : category ? (
        <div className="ml-4 text-gray-700">{category?.name}</div>
      ) : (
        <h1>{user.name}</h1>
      )}
    </li>
  );
}
