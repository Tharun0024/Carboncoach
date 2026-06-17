import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentApi } from '@/lib/api';
import { Assessment } from '@/types';

export function useAssessment() {
  const queryClient = useQueryClient();

  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ['assessments'],
    queryFn: assessmentApi.getAll,
  });

  const { mutate: createAssessment } = useMutation({
    mutationFn: assessmentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });

  return { assessments, createAssessment, isLoading };
}
