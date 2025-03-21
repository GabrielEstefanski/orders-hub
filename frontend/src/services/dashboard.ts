import { create } from "zustand";
import api from "./api";
import DashboardSummary from "../types/DashboardSummary";

interface DashboardStore {
  data: Record<string, DashboardSummary | null>;
  loading: boolean;
  error: string | null;
  fetchData: (filter: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  data: {},
  loading: false,
  error: null,
  
  fetchData: async (filter) => {
    set({ loading: true, error: null });

    try {
      const dashboardData = await api.get<DashboardSummary>(`/dashboard/summary?filter=${filter}`);
      set((state) => ({
        data: { ...state.data, [filter]: dashboardData },
        loading: false,
      }));
    } catch (error) {
      console.error("Erro ao buscar os dados do dashboard: ", error);
      set({ error: "Erro ao carregar dados", loading: false });
    }
  },
}));
