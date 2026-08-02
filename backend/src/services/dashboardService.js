import { getDashboardStats } from '../repositories/dashboardRepository.js';

export const getDashboardMetrics = async () => {
  return await getDashboardStats();
};