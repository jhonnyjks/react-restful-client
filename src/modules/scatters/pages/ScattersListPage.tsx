import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { TextInput } from '@/components/atoms/TextInput';
import { DataTable } from '@/components/organisms/DataTable';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ResourceState } from '@/components/molecules/ResourceState';
import { useAuthorization } from '@/hooks/useAuthorization';
import { useDeleteScatter, useScatters } from '../hooks/useScatters';
import type { Scatter } from '@/services/api/types';

export function ScattersListPage() {
  const navigate = useNavigate();
  const { data: scatters = [], isLoading, isError, refetch } = useScatters();
  const deleteMutation = useDeleteScatter();
  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission } = useAuthorization();
  const canManage = hasPermission('manter-scatters');

  const filtered = useMemo(() => {
    if (!searchTerm) {
      return scatters;
    }
    const term = searchTerm.toLowerCase();
    return scatters.filter(
      (scatter) =>
        scatter.name.toLowerCase().includes(term) ||
        (scatter.description ?? '').toLowerCase().includes(term) ||
        scatter.categories.some((category) => category.name.toLowerCase().includes(term)),
    );
  }, [scatters, searchTerm]);

  const handleDelete = (scatter: Scatter) => {
    if (!canManage) {
      return;
    }
    if (window.confirm(`Remover o scatter "${scatter.name}"?`)) {
      deleteMutation.mutate(scatter.id);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-content sm:text-xl">Scatters</h2>
          <p className="mt-1 text-sm text-content-subtle">
            Envie mensagens programadas para grupos por categoria.
          </p>
        </div>
        <Button onClick={() => navigate('/scatters/novo')} disabled={!canManage} className="w-full sm:w-auto">
          Novo scatter
        </Button>
      </div>

      <div className="card-surface flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TextInput
            placeholder="Pesquisar por nome, descrição ou categoria..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full sm:max-w-sm"
          />
          <span className="text-sm text-content-subtle">{filtered.length} resultado(s)</span>
        </div>

        <ResourceState
          isLoading={isLoading || deleteMutation.isPending}
          isError={isError}
          onRetry={() => refetch()}
        >
          <DataTable
            data={filtered}
            keyExtractor={(scatter) => scatter.id}
            emptyState={
              <EmptyState
                title="Nenhum scatter encontrado"
                description="Crie um scatter para começar a programar envios."
              />
            }
            columns={[
              {
                header: 'Nome',
                accessor: (scatter) => (
                  <div>
                    <p className="font-medium text-content">{scatter.name}</p>
                    <p className="text-xs text-content-subtle line-clamp-2">{scatter.description || '—'}</p>
                  </div>
                ),
              },
              {
                header: 'Categorias',
                accessor: (scatter) => (
                  <div className="flex flex-wrap gap-2">
                    {scatter.categories.length === 0 ? (
                      <span className="text-xs text-content-subtle">Nenhuma</span>
                    ) : (
                      scatter.categories.map((category) => (
                        <Badge key={category.id} variant="subtle" className="text-[11px]">
                          {category.name}
                        </Badge>
                      ))
                    )}
                  </div>
                ),
              },
              {
                header: 'Grupos',
                width: '90px',
                accessor: (scatter) => scatter.groupsCount,
              },
              {
                header: 'Membros',
                width: '100px',
                accessor: (scatter) => scatter.membersCount,
              },
              {
                header: 'Ações',
                width: '180px',
                accessor: (scatter) => (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      className="!px-2 !py-1 text-xs"
                      onClick={() => navigate(`/scatters/${scatter.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="secondary"
                      className="!px-2 !py-1 text-xs"
                      disabled={!canManage}
                      onClick={() => handleDelete(scatter)}
                    >
                      Remover
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </ResourceState>
      </div>
    </div>
  );
}
