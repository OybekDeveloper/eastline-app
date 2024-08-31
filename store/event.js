import { create } from "zustand";

export const useEvent = create((set) => ({
  reflesh: false,
  changeTableData: [],
  setTableData: (data) => set(() => ({ changeTableData: data ? data : [] })),
  setReflesh: () => set((state) => ({ reflesh: !state.reflesh })),
}));
