function normalizeOrder(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}

export function orderCatalogTree(
  topCategories = [],
  topCategoriesSort = [],
  categorySortData = []
) {
  const topCategorySortMap = new Map(
    topCategoriesSort.map((item) => [String(item.topCategoryId), item])
  );
  const categorySortMap = new Map(
    categorySortData.map((item) => [String(item.categoryId), item])
  );

  return [...topCategories]
    .map((topCategory) => {
      const sortEntry = topCategorySortMap.get(String(topCategory.id));
      const orderedCategories = [...(topCategory.categories || [])]
        .map((category) => {
          const categorySort = categorySortMap.get(String(category.id));
          return {
            ...category,
            sortUniqueId: categorySort?.uniqueId,
          };
        })
        .sort((a, b) => {
          const orderDiff =
            normalizeOrder(a.sortUniqueId) - normalizeOrder(b.sortUniqueId);
          if (orderDiff !== 0) {
            return orderDiff;
          }
          return String(a.name || "").localeCompare(String(b.name || ""), "ru");
        });

      return {
        ...topCategory,
        sortOrder: normalizeOrder(sortEntry?.uniqueId),
        categories: orderedCategories,
      };
    })
    .sort((a, b) => {
      const orderDiff = a.sortOrder - b.sortOrder;
      if (orderDiff !== 0) {
        return orderDiff;
      }
      return String(a.name || "").localeCompare(String(b.name || ""), "ru");
    });
}

export function orderCategoriesFlat(
  topCategories = [],
  topCategoriesSort = [],
  categorySortData = []
) {
  return orderCatalogTree(topCategories, topCategoriesSort, categorySortData).flatMap(
    (topCategory) =>
      (topCategory.categories || []).map((category) => ({
        ...category,
        topCategory,
      }))
  );
}
