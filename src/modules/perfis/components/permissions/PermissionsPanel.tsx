import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { TextInput } from '@/components/atoms/TextInput';
import { Checkbox } from '@/components/atoms/Checkbox';
import { FormField } from '@/components/molecules/FormField';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ResourceState } from '@/components/molecules/ResourceState';
import { cn } from '@/utils/cn';
import type { Permissao } from '@/services/api/types';

type PermissionFormValues = {
  nome: string;
  label: string;
};

type PermissionsPanelProps = {
  permissions: Permissao[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  onCreate: (payload: PermissionFormValues) => Promise<void> | void;
  onRefresh?: () => void;
  isLoadingList?: boolean;
  isCreating?: boolean;
};

export function PermissionsPanel({
  permissions,
  selectedIds,
  onToggle,
  onCreate,
  onRefresh,
  isLoadingList,
  isCreating,
}: PermissionsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    defaultValues: {
      nome: '',
      label: '',
    },
  });

  const filteredPermissions = useMemo(() => {
    if (!searchTerm) {
      return permissions;
    }
    const term = searchTerm.toLowerCase();
    return permissions.filter(
      (permissao) =>
        permissao.nome.toLowerCase().includes(term) ||
        permissao.label.toLowerCase().includes(term),
    );
  }, [permissions, searchTerm]);

  const onSubmit = async (values: PermissionFormValues) => {
    await onCreate(values);
    reset();
  };

  return (
    <div className="card-surface flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-content sm:text-lg">Permissões</h3>
          <p className="text-sm text-content-subtle">
            Crie novas permissões conforme as necessidades do perfil e gerencie as existentes.
          </p>
        </div>
        {onRefresh ? (
          <Button variant="ghost" onClick={onRefresh} className="w-full sm:w-auto">
            Atualizar lista
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <TextInput
            placeholder="Filtrar permissões por nome ou descrição..."
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
          />

          <ResourceState
            isLoading={Boolean(isLoadingList)}
            isError={false}
          >
            {filteredPermissions.length === 0 ? (
              <EmptyState
                title="Nenhuma permissão encontrada"
                description="Crie uma nova permissão ou ajuste o filtro aplicado."
                icon="🔐"
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredPermissions.map((permissao) => {
                  const checked = selectedIds.includes(permissao.id);
                  return (
                    <button
                      key={permissao.id}
                      type="button"
                      onClick={() => onToggle(permissao.id)}
                      className={cn(
                        'flex flex-col gap-3 rounded-large border p-3 text-left transition sm:p-4',
                        checked
                          ? 'border-primary-400 bg-primary-50 shadow-soft'
                          : 'border-border bg-surface hover:border-primary-300 hover:bg-surface-subtle',
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-content">{permissao.nome}</p>
                          <p className="text-xs text-content-subtle">{permissao.label}</p>
                        </div>
                        <Checkbox checked={checked} onChange={() => onToggle(permissao.id)} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ResourceState>
        </div>

        <div className="flex flex-col gap-4 rounded-large border border-border bg-surface-subtle p-4 sm:p-5">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-content-subtle">Nova permissão</h4>
          <FormField label="Nome técnico" htmlFor="permissao-nome" error={errors.nome?.message} required>
            <TextInput
              id="permissao-nome"
              placeholder="manter-relatorios"
              hasError={Boolean(errors.nome)}
              {...register('nome', {
                required: 'Informe o identificador da permissão.',
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: 'Utilize letras minúsculas, números e hífens.',
                },
              })}
            />
          </FormField>

          <FormField label="Descrição" htmlFor="permissao-label" error={errors.label?.message} required>
            <TextInput
              id="permissao-label"
              placeholder="Permissão para manter relatórios"
              hasError={Boolean(errors.label)}
              {...register('label', {
                required: 'Informe uma descrição legível.',
                minLength: {
                  value: 4,
                  message: 'Informe uma descrição mais detalhada.',
                },
              })}
            />
          </FormField>

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            loading={isCreating}
          >
            Criar permissão
          </Button>
        </div>
      </div>
    </div>
  );
}

