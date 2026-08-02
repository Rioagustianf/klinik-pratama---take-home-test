import api from "@/lib/axios";

export const medicalRecordsApi = {
  submitMedicalRecord: (data) =>
    api.post("/medical-records", data).then((res) => res.data),
  getPatientHistory: (patientId) =>
    api.get(`/medical-records/${patientId}`).then((res) => res.data),
  createPrescription: (data) =>
    api.post("/prescriptions", data).then((res) => res.data),
  getPrescription: (id) =>
    api.get(`/prescriptions/${id}`).then((res) => res.data),
};