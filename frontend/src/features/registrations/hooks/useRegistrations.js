import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { registrationsApi } from "../api/registrationsApi";

const REGISTRATIONS_QUERY_KEY = "registrations";
const DOCTORS_QUERY_KEY = "doctors";

export const useRegistrationsQuery = (params) => {
  return useQuery({
    queryKey: [REGISTRATIONS_QUERY_KEY, params],
    queryFn: () => registrationsApi.getRegistrations(params),
    keepPreviousData: true,
  });
};


export const useDoctorsQuery = () => {
  return useQuery({
    queryKey: [DOCTORS_QUERY_KEY],
    queryFn: () => registrationsApi.getDoctors(),
  });
};


export const useCreateRegistrationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registrationsApi.createRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REGISTRATIONS_QUERY_KEY] });
    },
  });
};

export const useUpdateRegistrationStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      registrationsApi.updateRegistrationStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REGISTRATIONS_QUERY_KEY] });
    },
  });
};