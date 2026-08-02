import api from "@/lib/axios";

export const patientsApi = {
  getPatients: (params) =>
    api.get("/patients", { params }).then((res) => res.data),

  getPatient: (id) => api.get(`/patients/${id}`).then((res) => res.data),

  createPatient: (data) => api.post("/patients", data).then((res) => res.data),

  updatePatient: (id, data) =>
    api.put(`/patients/${id}`, data).then((res) => res.data),

  deletePatient: (id) => api.delete(`/patients/${id}`).then((res) => res.data),
};
