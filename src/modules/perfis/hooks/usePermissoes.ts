import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useApiMutation } from '@/hooks/useApiMutation';
import { createPermissao, deletePermissao, listPermissoes, updatePermissao } from '@/services/api/permissoes';
import type { Permissao, PermissaoPayload } from '@/services/api/types';

export function usePermissoes() {
  return useApiQuery({
    queryKey: ['permissoes'],
    queryFn: listPermissoes,
  });
}

export function useUpsertPermissao(options?: { onSuccess?: (permissao: Permissao) => void }) {
  const queryClient = useQueryClient();

  return useApiMutation<Permissao, unknown, { id?: number; payload: PermissaoPayload }>(
    {
      mutationFn: ({ id, payload }) => (id ? updatePermissao(id, payload) : createPermissao(payload)),
      onSuccess: (permissao) => {
        queryClient.invalidateQueries({ queryKey: ['permissoes'] });
        options?.onSuccess?.(permissao);
      },
    },
    {
      successMessage: 'Permissão salva com sucesso.',
      errorMessage: 'Erro ao salvar permissão.',
    },
  );
}

export function useDeletePermissao(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useApiMutation<void, unknown, number>(
    {
      mutationFn: (id) => deletePermissao(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['permissoes'] });
        options?.onSuccess?.();
      },
    },
    {
      successMessage: 'Permissão removida.',
      errorMessage: 'Erro ao remover permissão.',
    },
  );
}

