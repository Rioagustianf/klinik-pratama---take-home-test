import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queuesApi } from "../api/queuesApi";

const QUEUES_QUERY_KEY = "queues";

export const useQueuesQuery = () => {
  return useQuery({
    queryKey: [QUEUES_QUERY_KEY],
    queryFn: () => queuesApi.getQueues(),
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
  });
};

export const useCallQueueMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: queuesApi.callQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUEUES_QUERY_KEY] });
    },
  });
};

export const useUpdateQueueStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      queuesApi.updateQueueStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUEUES_QUERY_KEY] });
    },
  });
};