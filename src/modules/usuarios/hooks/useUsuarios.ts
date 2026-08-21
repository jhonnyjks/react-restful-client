import { useApiQuery } from '@/hooks/useApiQuery';
import { useApiMutation } from '@/hooks/useApiMutation';
import { createUsuario, deleteUsuario, getUsuario, listUsuarios, toggleUsuarioActive, updateUsuario } from '@/services/api/usuarios';
import type { Usuario, UsuarioPayload } from '@/services/api/types';
import { useQueryClient } from '@tanstack/react-query';

export function useUsuarios(options?: { enabled?: boolean }) {
  return useApiQuery({
    queryKey: ['usuarios'],
    queryFn: listUsuarios,
    enabled: options?.enabled ?? true,
  });
}

export function useUsuario(id?: number) {
  return useApiQuery(
    {
      queryKey: ['usuarios', id],
      queryFn: () => {
        if (!id) {
          throw new Error('ID do usuário não informado');
        }
        return getUsuario(id);
      },
      enabled: Boolean(id),
    },
    {
      errorMessage: 'Não foi possível carregar o usuário.',
    },
  );
}

export function useUpsertUsuario(options?: { onSuccess?: (usuario: Usuario) => void }) {
  const queryClient = useQueryClient();

  return useApiMutation<Usuario, unknown, { id?: number; payload: UsuarioPayload }>(
    {
      mutationFn: ({ id, payload }) => (id ? updateUsuario(id, payload) : createUsuario(payload)),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        options?.onSuccess?.(data);
      },
    },
    {
      successMessage: 'Usuário salvo com sucesso.',
      errorMessage: 'Erro ao salvar usuário.',
    },
  );
}

export function useDeleteUsuario(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useApiMutation<void, unknown, number>(
    {
      mutationFn: (id) => deleteUsuario(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        options?.onSuccess?.();
      },
    },
    {
      successMessage: 'Usuário removido.',
      errorMessage: 'Erro ao remover usuário.',
    },
  );
}

export function useToggleUsuarioActive(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useApiMutation<{ is_active: number }, unknown, number>(
    {
      mutationFn: (id) => toggleUsuarioActive(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        options?.onSuccess?.();
      },
    },
    {
      successMessage: 'Status do usuário atualizado.',
      errorMessage: 'Erro ao atualizar status do usuário.',
    },
  );
}

