import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define types
interface AuthStore {
  token: string | null;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token: string, user: any) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "authStore", // key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }), // store only token & user
    }
  )
);

export default useAuthStore;
