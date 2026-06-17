import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { actionsApi } from '@/lib/api';
import { Action, UserAction } from '@/types';

export function useActions() {
  const queryClient = useQueryClient();

  const { data: currentAction, isLoading: isLoadingCurrent } = useQuery<Action>({
    queryKey: ['actions', 'current'],
    queryFn: actionsApi.getCurrent,
  });

  const { data: actionHistory, isLoading: isLoadingHistory } = useQuery<UserAction[]>({
    queryKey: ['actions', 'history'],
    queryFn: actionsApi.getHistory,
  });

  const { mutate: assignAction } = useMutation({
    mutationFn: actionsApi.assignNext,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions', 'current'] });
    },
  });

  const { mutate: updateActionStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'completed' | 'skipped' }) =>
      actionsApi.update(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
    },
  });

  return {
    currentAction,
    actionHistory,
    assignAction,
    updateActionStatus,
    isLoading: isLoadingCurrent || isLoadingHistory,
  };
}
