import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useApiMutation } from '@/hooks/useApiMutation';
import { listCategorias } from '@/services/api/categorias';
import {
  createScatter,
  createScatterSchedule,
  deleteScatter,
  deleteScatterAttachment,
  deleteScatterSchedule,
  getScatter,
  getScatterSchedule,
  listScatterEngagements,
  listScatters,
  suggestScatterCategories,
  updateScatter,
  updateScatterSchedule,
  uploadScatterAttachment,
} from '@/services/api/scatters';
import type { ScatterAttachment, ScatterPayload } from '@/services/api/types';

export function useScatters() {
  return useApiQuery({
    queryKey: ['scatters'],
    queryFn: listScatters,
  });
}

export function useScatter(id?: string) {
  return useApiQuery({
    queryKey: ['scatters', id],
    queryFn: () => getScatter(id!),
    enabled: Boolean(id),
  });
}

export function useCategorias() {
  return useApiQuery({
    queryKey: ['categorias'],
    queryFn: listCategorias,
  });
}

export function useUpsertScatter(options?: { onSuccess?: (id: string) => void }) {
  const queryClient = useQueryClient();

  return useApiMutation(
    {
      mutationFn: async (vars: { id?: string; payload: ScatterPayload }) => {
        if (vars.id) {
          return updateScatter(vars.id, vars.payload);
        }
        return createScatter(vars.payload);
      },
      onSuccess: (scatter) => {
        queryClient.invalidateQueries({ queryKey: ['scatters'] });
        queryClient.invalidateQueries({ queryKey: ['scatters', scatter.id] });
        options?.onSuccess?.(scatter.id);
      },
    },
    { successMessage: 'Scatter salvo com sucesso.', errorMessage: 'Não foi possível salvar o scatter.' },
  );
}

export function useDeleteScatter() {
  const queryClient = useQueryClient();
  return useApiMutation(
    {
      mutationFn: deleteScatter,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scatters'] }),
    },
    { successMessage: 'Scatter removido.', errorMessage: 'Não foi possível remover o scatter.' },
  );
}

export function useUploadScatterAttachment(scatterId?: string) {
  const queryClient = useQueryClient();
  return useApiMutation(
    {
      mutationFn: (vars: { type: ScatterAttachment['type']; file: File }) =>
        uploadScatterAttachment(scatterId!, vars.type, vars.file),
      onSuccess: () => {
        if (scatterId) {
          queryClient.invalidateQueries({ queryKey: ['scatters', scatterId] });
        }
      },
    },
    { successMessage: 'Anexo enviado.', errorMessage: 'Falha ao enviar anexo.' },
  );
}

export function useDeleteScatterAttachment(scatterId?: string) {
  const queryClient = useQueryClient();
  return useApiMutation(
    {
      mutationFn: (attachmentId: string) => deleteScatterAttachment(scatterId!, attachmentId),
      onSuccess: () => {
        if (scatterId) {
          queryClient.invalidateQueries({ queryKey: ['scatters', scatterId] });
        }
      },
    },
    { successMessage: 'Anexo removido.', errorMessage: 'Falha ao remover anexo.' },
  );
}

export function useCreateScatterSchedule(scatterId?: string) {
  const queryClient = useQueryClient();
  return useApiMutation(
    {
      mutationFn: (scheduledAt: string) => createScatterSchedule(scatterId!, scheduledAt),
      onSuccess: () => {
        if (scatterId) {
          queryClient.invalidateQueries({ queryKey: ['scatters', scatterId] });
        }
      },
    },
    { successMessage: 'Agendamento criado.', errorMessage: 'Falha ao criar agendamento.' },
  );
}

export function useUpdateScatterSchedule(scatterId?: string) {
  const queryClient = useQueryClient();
  return useApiMutation(
    {
      mutationFn: (vars: { scheduleId: string; scheduledAt: string }) =>
        updateScatterSchedule(scatterId!, vars.scheduleId, vars.scheduledAt),
      onSuccess: () => {
        if (scatterId) {
          queryClient.invalidateQueries({ queryKey: ['scatters', scatterId] });
        }
      },
    },
    { successMessage: 'Agendamento atualizado.', errorMessage: 'Falha ao atualizar agendamento.' },
  );
}

export function useDeleteScatterSchedule(scatterId?: string) {
  const queryClient = useQueryClient();
  return useApiMutation(
    {
      mutationFn: (scheduleId: string) => deleteScatterSchedule(scatterId!, scheduleId),
      onSuccess: () => {
        if (scatterId) {
          queryClient.invalidateQueries({ queryKey: ['scatters', scatterId] });
        }
      },
    },
    { successMessage: 'Agendamento removido.', errorMessage: 'Falha ao remover agendamento.' },
  );
}

export function useSuggestScatterCategories() {
  return useApiMutation(
    { mutationFn: suggestScatterCategories },
    {
      successMessage: 'Categorias sugeridas pela IA.',
      errorMessage: 'Não foi possível sugerir categorias.',
    },
  );
}

export function useScatterSchedule(scatterId?: string, scheduleId?: string) {
  return useQuery({
    queryKey: ['scatters', scatterId, 'schedules', scheduleId],
    queryFn: () => getScatterSchedule(scatterId!, scheduleId!),
    enabled: Boolean(scatterId && scheduleId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'queued' || status === 'running') {
        return 2000;
      }
      if (query.state.data?.statsSyncUntil) {
        const until = new Date(query.state.data.statsSyncUntil).getTime();
        if (until > Date.now()) {
          return 30_000;
        }
      }
      return false;
    },
  });
}

export function useScatterEngagements(
  scatterId?: string,
  scheduleId?: string,
  filters?: { type?: string; emoji?: string },
  enabled = false,
) {
  return useQuery({
    queryKey: ['scatters', scatterId, 'schedules', scheduleId, 'engagements', filters],
    queryFn: () => listScatterEngagements(scatterId!, scheduleId!, filters),
    enabled: Boolean(scatterId && scheduleId && enabled),
  });
}
