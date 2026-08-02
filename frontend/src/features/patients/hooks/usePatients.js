import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsApi } from "../api/patientsApi";

const PATIENTS_QUERY_KEY = "patients";

export const usePatientsQuery = (params) => {
  return useQuery({
    queryKey: [PATIENTS_QUERY_KEY, params],
    queryFn: () => patientsApi.getPatients(params),
    keepPreviousData: true,
  });
};

export const usePatientDetailQuery = (id) => {
  return useQuery({
    queryKey: [PATIENTS_QUERY_KEY, id],
    queryFn: () => patientsApi.getPatient(id),
    enabled: !!id,
  });
};

export const useCreatePatientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientsApi.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries([PATIENTS_QUERY_KEY]);
    },
  });
};

export const useUpdatePatientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => patientsApi.updatePatient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries([PATIENTS_QUERY_KEY]);
      queryClient.invalidateQueries([PATIENTS_QUERY_KEY, id]);
    },
  });
};

export const useDeletePatientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientsApi.deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries([PATIENTS_QUERY_KEY]);
    },
  });
};
