import { create } from "zustand";

export const useStore = create((set) => ({
  prenotazioni: [],
  fieldsets: [],

  addFieldset: () =>
    set((state) => ({
      fieldsets: [...state.fieldsets, { id: Date.now() }],
    })),

  removeFieldset: (id) =>
    set((state) => ({
      fieldsets: state.fieldsets.filter((f) => f.id !== id),
    })),
}));