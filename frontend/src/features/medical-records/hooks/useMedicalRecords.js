import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicalRecordsApi } from "../api/medicalRecordsApi";

const MEDICAL_RECORDS_QUERY_KEY = "medical-records";

export const usePatientHistoryQuery = (patientId) => {
  return useQuery({
    queryKey: [MEDICAL_RECORDS_QUERY_KEY, "history", patientId],
    queryFn: () => medicalRecordsApi.getPatientHistory(patientId),
    enabled: !!patientId,
  });
};

export const useSubmitMedicalRecordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: medicalRecordsApi.submitMedicalRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICAL_RECORDS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["queues"] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
};

export const useCreatePrescriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: medicalRecordsApi.createPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICAL_RECORDS_QUERY_KEY] });
    },
  });
};