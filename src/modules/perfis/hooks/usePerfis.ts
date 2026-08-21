import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useApiMutation } from '@/hooks/useApiMutation';
import {
  createPerfil,
  deletePerfil,
  getPerfil,
  listPerfis,
  updatePerfil,
} from '@/services/api/perfis';
import type { Perfil, PerfilPayload } from '@/services/api/types';

export function usePerfis() {
  return useApiQuery({
    queryKey: ['perfis'],
    queryFn: listPerfis,
  });
}

export function usePerfil(id?: number) {
  return useApiQuery(
    {
      queryKey: ['perfis', id],
      queryFn: () => {
        if (!id) {
          throw new Error('ID do perfil não informado.');
        }
        return getPerfil(id);
      },
      enabled: Boolean(id),
    },
    {
      errorMessage: 'Não foi possível carregar o perfil.',
    },
  );
}

export function useUpsertPerfil(options?: { onSuccess?: (perfil: Perfil) => void }) {
  const queryClient = useQueryClient();

  return useApiMutation<Perfil, unknown, { id?: number; payload: PerfilPayload }>(
    {
      mutationFn: ({ id, payload }) => (id ? updatePerfil(id, payload) : createPerfil(payload)),
      onSuccess: (perfil) => {
        queryClient.invalidateQueries({ queryKey: ['perfis'] });
        options?.onSuccess?.(perfil);
      },
    },
    {
      successMessage: 'Perfil salvo com sucesso.',
      errorMessage: 'Erro ao salvar perfil.',
    },
  );
}

export function useDeletePerfil(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useApiMutation<void, unknown, number>(
    {
      mutationFn: (id) => deletePerfil(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['perfis'] });
        options?.onSuccess?.();
      },
    },
    {
      successMessage: 'Perfil removido.',
      errorMessage: 'Erro ao remover perfil.',
    },
  );
}

