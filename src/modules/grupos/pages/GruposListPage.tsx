import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { TextInput } from '@/components/atoms/TextInput';
import { Badge } from '@/components/atoms/Badge';
import { DataTable } from '@/components/organisms/DataTable';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Pagination } from '@/components/molecules/Pagination';
import { ResourceState } from '@/components/molecules/ResourceState';
import { useCategorizeGrupos, useGrupos, useSyncGrupos } from '../hooks/useGrupos';
import { useAuthorization } from '@/hooks/useAuthorization';
import type { GroupSyncRun } from '@/services/api/types';

const PAGE_SIZE = 15;

const syncPhaseLabels: Record<string, string> = {
  queued: 'Na fila',
  instances: 'Sincronizando instâncias',
  groups: 'Sincronizando grupos',
  done: 'Concluído',
};

const categorizePhaseLabels: Record<string, string> = {
  queued: 'Na fila',
  categorization: 'Categorizando grupos',
  done: 'Concluído',
};

function ProgressBanner({
  label,
  run,
}: {
  label: string;
  run: GroupSyncRun;
}) {
  const total = Math.max(run.total, 1);
  const percent = Math.min(100, Math.round((run.processed / total) * 100));

  return (
    <div className="card-surface px-4 py-3 text-sm text-content-subtle">
      Progresso: {label} ({run.processed}/{total})
      <div className="mt-2 h-2 overflow-hidden rounded bg-slate-100">
        <div className="h-full bg-primary-500 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function GruposListPage() {
  const { data: grupos = [], isLoading, isError, refetch } = useGrupos();
  const syncMutation = useSyncGrupos();
  const categorizeMutation = useCategorizeGrupos();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { hasPermission } = useAuthorization();
  const canManageGrupos = hasPermission('manter-grupos');
  const isBusy = syncMutation.isSyncing || categorizeMutation.isCategorizing;

  const filteredGrupos = useMemo(() => {
    if (!searchTerm) {
      return grupos;
    }
    const term = searchTerm.toLowerCase();
    return grupos.filter(
      (grupo) =>
        grupo.name.toLowerCase().includes(term) ||
        (grupo.description ?? '').toLowerCase().includes(term) ||
        grupo.instances.some((instance) => instance.name.toLowerCase().includes(term)) ||
        [...(grupo.permissibleCategories ?? []), ...(grupo.forbiddenCategories ?? [])].some((category) =>
          (category.name ?? '').toLowerCase().includes(term),
        ),
    );
  }, [searchTerm, grupos]);

  const totalPages = Math.max(1, Math.ceil(filteredGrupos.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedGrupos = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredGrupos.slice(start, start + PAGE_SIZE);
  }, [filteredGrupos, currentPage]);

  const syncProgressLabel = useMemo(() => {
    const run = syncMutation.syncRun;
    if (!run || !syncMutation.isSyncing) {
      return null;
    }
    return syncPhaseLabels[run.phase ?? ''] ?? run.phase ?? 'Processando';
  }, [syncMutation.isSyncing, syncMutation.syncRun]);

  const categorizeProgressLabel = useMemo(() => {
    const run = categorizeMutation.categorizationRun;
    if (!run || !categorizeMutation.isCategorizing) {
      return null;
    }
    return categorizePhaseLabels[run.phase ?? ''] ?? run.phase ?? 'Processando';
  }, [categorizeMutation.isCategorizing, categorizeMutation.categorizationRun]);

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-content sm:text-xl">Grupos</h2>
          <p className="mt-1 text-sm text-content-subtle">
            Visualize grupos sincronizados do WAHA, sincronize e categorize manualmente.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            variant="secondary"
            onClick={() => categorizeMutation.mutate()}
            disabled={!canManageGrupos || isBusy}
            className="w-full sm:w-auto"
          >
            {categorizeMutation.isCategorizing ? 'Categorizando...' : 'Categorizar'}
          </Button>
          <Button
            onClick={() => syncMutation.mutate()}
            disabled={!canManageGrupos || isBusy}
            className="w-full sm:w-auto"
          >
            {syncMutation.isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
        </div>
      </div>

      {syncProgressLabel && syncMutation.syncRun ? (
        <ProgressBanner label={syncProgressLabel} run={syncMutation.syncRun} />
      ) : null}

      {categorizeProgressLabel && categorizeMutation.categorizationRun ? (
        <ProgressBanner label={categorizeProgressLabel} run={categorizeMutation.categorizationRun} />
      ) : null}

      <div className="card-surface flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TextInput
            placeholder="Pesquisar por nome do grupo ou instância..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full sm:max-w-sm"
            startAdornment={
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <span className="text-sm text-content-subtle">{filteredGrupos.length} resultado(s)</span>
        </div>

        <ResourceState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
          <DataTable
            data={paginatedGrupos}
            keyExtractor={(grupo) => grupo.id}
            columns={[
              {
                header: 'Nome',
                accessor: (grupo) => <span className="font-medium text-content">{grupo.name}</span>,
              },
              {
                header: 'Descrição',
                accessor: (grupo) => (
                  <span className="line-clamp-2 text-sm text-content-subtle">
                    {grupo.description?.trim() ? grupo.description : '—'}
                  </span>
                ),
              },
              {
                header: 'Instâncias',
                accessor: (grupo) => (
                  <div className="flex flex-wrap gap-2">
                    {grupo.instances.length === 0 ? (
                      <span className="text-xs text-content-subtle">—</span>
                    ) : (
                      grupo.instances.map((instance) => (
                        <Badge key={instance.id} variant="subtle" className="text-[11px]">
                          {instance.name}
                        </Badge>
                      ))
                    )}
                  </div>
                ),
              },
              {
                header: 'Categorias',
                accessor: (grupo) => {
                  const permissible = [...new Set(
                    (grupo.permissibleCategories ?? [])
                      .map((category) => category.name?.trim())
                      .filter((name): name is string => Boolean(name)),
                  )];

                  return (
                    <span className="line-clamp-2 text-sm text-content">
                      {permissible.length > 0 ? permissible.join(', ') : '—'}
                    </span>
                  );
                },
              },
              {
                header: 'Proibidas',
                accessor: (grupo) => {
                  const forbidden = [...new Set(
                    (grupo.forbiddenCategories ?? [])
                      .map((category) => category.name?.trim())
                      .filter((name): name is string => Boolean(name)),
                  )];

                  return (
                    <span className="line-clamp-2 text-sm font-medium text-rose-600">
                      {forbidden.length > 0 ? forbidden.join(', ') : '—'}
                    </span>
                  );
                },
              },
              {
                header: 'Membros',
                width: '100px',
                accessor: (grupo) => <span className="text-sm text-content">{grupo.membersCount}</span>,
              },
            ]}
            emptyState={
              <EmptyState
                title="Nenhum grupo encontrado"
                description="Sincronize os grupos a partir do WAHA para começar."
                actionLabel={canManageGrupos ? 'Sincronizar agora' : undefined}
                onAction={canManageGrupos ? () => syncMutation.mutate() : undefined}
              />
            }
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredGrupos.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="grupos"
          />
        </ResourceState>
      </div>
    </div>
  );
}
