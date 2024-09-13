import { create } from "zustand";

export const useEvent = create((set) => ({
  reflesh: false,
  tableReview: [],
  tableSelectReview: [],
  changeTableData: [],
  setTableData: (data) => set(() => ({ changeTableData: data ? data : [] })),
  setReflesh: () => set((state) => ({ reflesh: !state.reflesh })),
  setTableReview: (selectData, data) =>
    set(() => ({
      tableReview: selectData,
      tableSelectReview: data,
    })),
}));
