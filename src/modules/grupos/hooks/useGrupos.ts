import { useEffect, useRef, useState } from 'react';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useApiMutation } from '@/hooks/useApiMutation';
import {
  getGruposCategorizationStatus,
  getGruposSyncStatus,
  listGrupos,
  startGruposCategorization,
  startGruposSync,
} from '@/services/api/grupos';
import type { GroupCategorizationRun, GroupSyncRun } from '@/services/api/types';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';

export function useGrupos(options?: { enabled?: boolean }) {
  return useApiQuery({
    queryKey: ['grupos'],
    queryFn: listGrupos,
    enabled: options?.enabled ?? true,
  });
}

function useJobPolling(options: {
  start: () => Promise<{ runId: string; status: string }>;
  getStatus: (runId: string) => Promise<GroupSyncRun>;
  successMessage: string;
  errorMessage: string;
  startErrorMessage: string;
}) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [run, setRun] = useState<GroupSyncRun | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollingRef = useRef<number | null>(null);

  const stopPolling = () => {
    if (pollingRef.current !== null) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setIsPolling(false);
  };

  useEffect(() => () => stopPolling(), []);

  const mutation = useApiMutation<{ runId: string; status: string }, unknown, void>(
    {
      mutationFn: () => options.start(),
      onSuccess: async ({ runId }) => {
        setIsPolling(true);
        setRun({
          id: runId,
          status: 'pending',
          phase: 'queued',
          processed: 0,
          total: 0,
        });

        const poll = async () => {
          try {
            const status = await options.getStatus(runId);
            setRun(status);

            if (status.status === 'completed' || status.status === 'failed') {
              stopPolling();
              await queryClient.invalidateQueries({ queryKey: ['grupos'] });

              if (status.status === 'completed') {
                toast.success({ title: options.successMessage });
              } else {
                toast.error({
                  title: options.errorMessage,
                  description: status.errorMessage ?? undefined,
                });
              }
            }
          } catch {
            stopPolling();
            toast.error({ title: 'Não foi possível acompanhar o progresso da operação.' });
          }
        };

        await poll();
        pollingRef.current = window.setInterval(poll, 1500);
      },
    },
    {
      errorMessage: options.startErrorMessage,
    },
  );

  return {
    ...mutation,
    run,
    isRunning: mutation.isPending || isPolling,
  };
}

export function useSyncGrupos() {
  const job = useJobPolling({
    start: async () => {
      const result = await startGruposSync();
      return { runId: result.syncRunId, status: result.status };
    },
    getStatus: getGruposSyncStatus,
    successMessage: 'Sincronização de grupos concluída.',
    errorMessage: 'Falha na sincronização de grupos.',
    startErrorMessage: 'Erro ao iniciar sincronização de grupos.',
  });

  return {
    ...job,
    syncRun: job.run,
    isSyncing: job.isRunning,
  };
}

export function useCategorizeGrupos() {
  const job = useJobPolling({
    start: async () => {
      const result = await startGruposCategorization();
      return { runId: result.categorizationRunId, status: result.status };
    },
    getStatus: getGruposCategorizationStatus,
    successMessage: 'Categorização de grupos concluída.',
    errorMessage: 'Falha na categorização de grupos.',
    startErrorMessage: 'Erro ao iniciar categorização de grupos.',
  });

  return {
    ...job,
    categorizationRun: job.run as GroupCategorizationRun | null,
    isCategorizing: job.isRunning,
  };
}
