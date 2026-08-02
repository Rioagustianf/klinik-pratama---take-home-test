import { getDashboardMetrics } from '../services/dashboardService.js';
import { sendSuccess } from '../utils/response.js';

export const getDashboard = async (req, res) => {
  const stats = await getDashboardMetrics();
  return sendSuccess(res, stats, 'Dashboard metrics berhasil diambil');
};