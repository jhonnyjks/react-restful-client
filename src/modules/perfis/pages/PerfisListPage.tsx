import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { TextInput } from '@/components/atoms/TextInput';
import { Badge } from '@/components/atoms/Badge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ResourceState } from '@/components/molecules/ResourceState';
import { DataTable } from '@/components/organisms/DataTable';
import { useDeletePerfil, usePerfis } from '../hooks/usePerfis';
import type { Perfil } from '@/services/api/types';
import { useAuthorization } from '@/hooks/useAuthorization';

export function PerfisListPage() {
  const navigate = useNavigate();
  const { data: perfis = [], isLoading, isError, refetch } = usePerfis();
  const deleteMutation = useDeletePerfil();
  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission } = useAuthorization();
  const canManagePerfis = hasPermission('manter-perfis');

  const filteredPerfis = useMemo(() => {
    if (!searchTerm) {
      return perfis;
    }
    const term = searchTerm.toLowerCase();
    return perfis.filter(
      (perfil) =>
        perfil.nome.toLowerCase().includes(term) ||
        perfil.label.toLowerCase().includes(term) ||
        perfil.permissoes.some((permissao) => permissao.label.toLowerCase().includes(term)),
    );
  }, [searchTerm, perfis]);

  const handleDelete = (perfil: Perfil) => {
    if (!canManagePerfis) {
      return;
    }
    if (window.confirm(`Deseja realmente remover o perfil ${perfil.nome}?`)) {
      deleteMutation.mutate(perfil.id);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-content sm:text-xl">Perfis</h2>
          <p className="mt-1 text-sm text-content-subtle">
            Estruture o modelo de permissões do sistema e atribua acesso granular.
          </p>
        </div>
        <Button onClick={() => navigate('/perfis/novo')} disabled={!canManagePerfis} className="w-full sm:w-auto">
          Novo perfil
        </Button>
      </div>

      <div className="card-surface flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TextInput
            placeholder="Pesquisar por identificador, descrição ou permissão..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
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
            className="w-full sm:max-w-sm"
          />
          <span className="text-sm text-content-subtle">{filteredPerfis.length} perfil(is)</span>
        </div>

        <ResourceState isLoading={isLoading || deleteMutation.isPending} isError={isError} onRetry={() => refetch()}>
          <DataTable
            data={filteredPerfis}
            keyExtractor={(perfil) => perfil.id}
            columns={[
              {
                header: 'Perfil',
                accessor: (perfil) => (
                  <div>
                    <p className="font-medium text-content">{perfil.nome}</p>
                    <p className="text-xs text-content-subtle">{perfil.label}</p>
                  </div>
                ),
              },
              {
                header: 'Permissões vinculadas',
                accessor: (perfil) => (
                  <div className="flex flex-wrap gap-2">
                    {perfil.permissoes.slice(0, 4).map((permissao) => (
                      <Badge key={permissao.id} variant="subtle" className="text-[11px]">
                        {permissao.label}
                      </Badge>
                    ))}
                    {perfil.permissoes.length > 4 ? (
                      <Badge variant="outline" className="text-[11px]">
                        +{perfil.permissoes.length - 4}
                      </Badge>
                    ) : null}
                  </div>
                ),
              },
              {
                header: 'Ações',
                width: '220px',
                accessor: (perfil) => (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/perfis/${perfil.id}`)}
                      disabled={!canManagePerfis}
                      className="flex-1 sm:flex-initial"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-rose-600 hover:bg-rose-50 sm:flex-initial"
                      onClick={() => handleDelete(perfil)}
                      disabled={!canManagePerfis}
                    >
                      Remover
                    </Button>
                  </div>
                ),
              },
            ]}
            emptyState={
              <EmptyState
                title="Nenhum perfil cadastrado"
                description="Crie um perfil para organizar permissões e delegar responsabilidades."
                actionLabel="Cadastrar perfil"
                onAction={() => navigate('/perfis/novo')}
                icon="🛡️"
              />
            }
          />
        </ResourceState>
      </div>
    </div>
  );
}

