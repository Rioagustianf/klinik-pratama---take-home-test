import api from "@/lib/axios";

export const queuesApi = {
  getQueues: () => api.get("/queues").then((res) => res.data),
  callQueue: (id) => api.put(`/queues/${id}/call`).then((res) => res.data),
  updateQueueStatus: (id, data) =>
    api.put(`/queues/${id}/status`, data).then((res) => res.data),
};