import api from "@/lib/axios";

export const registrationsApi = {
  getRegistrations: (params) =>
    api.get("/registrations", { params }).then((res) => res.data),

  getDoctors: () => api.get("/doctors").then((res) => res.data),

  createRegistration: (data) =>
    api.post("/registrations", data).then((res) => res.data),

  updateRegistrationStatus: (id, data) =>
    api.put(`/registrations/${id}`, data).then((res) => res.data),
};