import { create } from "zustand";

export const useAuth = create((set) => ({
  authUser: JSON.parse(localStorage.getItem("chatapp")) || null,
  setAuthUser: (user) => set({ authUser: user }),
}));
