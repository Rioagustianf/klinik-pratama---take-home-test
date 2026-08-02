import api from "@/lib/axios";

export const dashboardApi = {
  getDashboard: () => api.get("/dashboard").then((res) => res.data),
};