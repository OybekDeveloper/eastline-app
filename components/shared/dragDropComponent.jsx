export default function DragDropComponent({
  data,
  products,
  categories,
  param,
}) {
  const [usersList, setUsersList] = useState(
    data.slice().sort((a, b) => a.uniqueId - b.uniqueId) // Initial sort
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
      const sortedUsers = arrayMove(users, oldIndex, newIndex).map((user, idx) => ({
        ...user,
        uniqueId: idx + 1,
      }));
      return sortedUsers.sort((a, b) => a.uniqueId - b.uniqueId); // Ensure sorted order after drag
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
        await axios.post("/api/bannerSort", filterData);
      } else if (param === "changeTopCategory") {
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
        if (param === "changeBanner") {
          res = await axios.get("/api/bannerSort");
        }
        if (param === "changeTopCategory") {
          res = await axios.get("/api/topCategorySort");
          console.log(res);
        }
        if (res && res.data.data.length > 0) {
          setUsersList(res.data.data.sort((a, b) => a.uniqueId - b.uniqueId));
        } else {
          setUsersList(data.slice().sort((a, b) => a.uniqueId - b.uniqueId));
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
                key={user.uniqueId}
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
