import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api from "@/api/apiInstance";

interface UserStore {
    user: any;
    setUser: (user: any) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>()(persist((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => {
        api.post("/auth/logout").then(() => {
            localStorage.removeItem("token");
        }).catch((err: any) => {
            console.log(err);
        }).finally(() => {
            set({ user: null });
        });

    },
}), {
    name: "user-store",
    storage: createJSONStorage(() => localStorage),
}));
