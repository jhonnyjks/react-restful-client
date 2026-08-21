import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { TextInput } from '@/components/atoms/TextInput';
import { Badge } from '@/components/atoms/Badge';
import { DataTable } from '@/components/organisms/DataTable';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ResourceState } from '@/components/molecules/ResourceState';
import { useDeleteUsuario, useToggleUsuarioActive, useUsuarios } from '../hooks/useUsuarios';
import type { Usuario } from '@/services/api/types';
import { useAuthorization } from '@/hooks/useAuthorization';

export function UsuariosListPage() {
  const navigate = useNavigate();
  const { data: usuarios = [], isLoading, isError, refetch } = useUsuarios();
  const deleteMutation = useDeleteUsuario();
  const toggleActiveMutation = useToggleUsuarioActive();
  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission } = useAuthorization();
  const canManageUsuarios = hasPermission('manter-usuarios');

  const filteredUsuarios = useMemo(() => {
    if (!searchTerm) {
      return usuarios;
    }
    const term = searchTerm.toLowerCase();
    return usuarios.filter(
      (usuario) =>
        usuario.nome.toLowerCase().includes(term) ||
        usuario.email.toLowerCase().includes(term) ||
        usuario.perfis.some((perfil) => perfil.nome.toLowerCase().includes(term)),
    );
  }, [searchTerm, usuarios]);

  const handleDelete = (usuario: Usuario) => {
    if (!canManageUsuarios) {
      return;
    }
    if (window.confirm(`Deseja realmente remover o usuário ${usuario.nome}?`)) {
      deleteMutation.mutate(usuario.id);
    }
  };

  const handleToggleActive = (usuario: Usuario) => {
    if (!canManageUsuarios) {
      return;
    }
    const action = usuario.isActive ? 'desativar' : 'ativar';
    if (window.confirm(`Deseja realmente ${action} o usuário ${usuario.nome}?`)) {
      toggleActiveMutation.mutate(usuario.id);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-content sm:text-xl">Usuários</h2>
          <p className="mt-1 text-sm text-content-subtle">
            Gerencie usuários, perfis vinculados e permissões de acesso.
          </p>
        </div>
        <Button onClick={() => navigate('/usuarios/novo')} disabled={!canManageUsuarios} className="w-full sm:w-auto">
          Novo usuário
        </Button>
      </div>

      <div className="card-surface flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TextInput
            placeholder="Pesquisar por nome, e-mail ou perfil..."
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
          <span className="text-sm text-content-subtle">
            {filteredUsuarios.length} resultado(s)
          </span>
        </div>

        <ResourceState isLoading={isLoading || deleteMutation.isPending || toggleActiveMutation.isPending} isError={isError} onRetry={() => refetch()}>
          <DataTable
            data={filteredUsuarios}
            keyExtractor={(usuario) => usuario.id}
            columns={[
              {
                header: 'Nome',
                accessor: (usuario) => (
                  <div>
                    <p className="font-medium text-content">{usuario.nome}</p>
                    <p className="text-xs text-content-subtle">{usuario.email}</p>
                  </div>
                ),
              },
              {
                header: 'Perfis vinculados',
                accessor: (usuario) => (
                  <div className="flex flex-wrap gap-2">
                    {usuario.perfis.map((perfil) => (
                      <Badge key={perfil.id} variant="subtle" className="text-[11px]">
                        {perfil.nome}
                      </Badge>
                    ))}
                  </div>
                ),
              },
              {
                header: 'Status',
                width: '100px',
                accessor: (usuario) => (
                  <Badge 
                    variant="subtle"
                    className={`text-[11px] ${
                      usuario.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {usuario.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                ),
              },
              {
                header: 'Ações',
                width: '280px',
                accessor: (usuario) => (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/usuarios/${usuario.id}`)}
                      disabled={!canManageUsuarios}
                      className="flex-1 sm:flex-initial"
                    >
                      Editar
                    </Button>
                    <Button
                      variant={usuario.isActive ? 'ghost' : 'secondary'}
                      size="sm"
                      className={`flex-1 sm:flex-initial ${
                        usuario.isActive 
                          ? 'text-amber-600 hover:bg-amber-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      onClick={() => handleToggleActive(usuario)}
                      disabled={!canManageUsuarios || toggleActiveMutation.isPending}
                    >
                      {usuario.isActive ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-rose-600 hover:bg-rose-50 sm:flex-initial"
                      onClick={() => handleDelete(usuario)}
                      disabled={!canManageUsuarios}
                    >
                      Remover
                    </Button>
                  </div>
                ),
              },
            ]}
            emptyState={
              <EmptyState
                title="Nenhum usuário encontrado"
                description="Cadastre um novo usuário ou ajuste os filtros aplicados."
                actionLabel="Cadastrar usuário"
                onAction={() => navigate('/usuarios/novo')}
                icon="👤"
              />
            }
          />
        </ResourceState>
      </div>
    </div>
  );
}

