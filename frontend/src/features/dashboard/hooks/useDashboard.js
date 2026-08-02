import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboardApi";

const DASHBOARD_QUERY_KEY = "dashboard";

// Dashboard metrics — polling ringan agar tetap segar
export const useDashboardQuery = () => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY],
    queryFn: () => dashboardApi.getDashboard(),
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
};