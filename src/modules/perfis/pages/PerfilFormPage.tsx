import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { TextInput } from '@/components/atoms/TextInput';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import { ResourceState } from '@/components/molecules/ResourceState';
import { usePermissoes, useUpsertPermissao } from '../hooks/usePermissoes';
import { PermissionsPanel } from '../components/permissions/PermissionsPanel';
import { usePerfil, usePerfis, useUpsertPerfil } from '../hooks/usePerfis';
import { useAuthorization } from '@/hooks/useAuthorization';

type FormValues = {
  nome: string;
  label: string;
  perfilPaiId?: number | null;
  permissoesIds: number[];
};

export function PerfilFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: perfil, isLoading: isLoadingPerfil, isError: isErrorPerfil } = usePerfil(id ? Number(id) : undefined);
  const { data: perfis = [], isLoading: isLoadingPerfis, isError: isErrorPerfis, refetch: refetchPerfis } = usePerfis();
  const { data: permissoes = [], isLoading: isLoadingPermissoes, refetch: refetchPermissoes } = usePermissoes();
  const { hasPermission } = useAuthorization();
  const canManagePerfis = hasPermission('manter-perfis');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      nome: '',
      label: '',
      perfilPaiId: null,
      permissoesIds: [],
    },
  });

  const upsertPerfilMutation = useUpsertPerfil({
    onSuccess: (savedPerfil) => {
      navigate(`/perfis/${savedPerfil.id}`, { replace: true });
    },
  });
  const upsertPermissaoMutation = useUpsertPermissao({
    onSuccess: (novaPermissao) => {
      setValue('permissoesIds', [...new Set([...watch('permissoesIds'), novaPermissao.id])]);
    },
  });

  useEffect(() => {
    if (perfil) {
      setValue('nome', perfil.nome);
      setValue('label', perfil.label);
      setValue('perfilPaiId', perfil.perfilPaiId ?? null);
      setValue(
        'permissoesIds',
        perfil.permissoes.map((permissao) => permissao.id),
      );
    }
  }, [perfil, setValue]);

  const selectedPermissoes = watch('permissoesIds') ?? [];

  const perfisParaSelecao = useMemo(
    () =>
      perfis
        .filter((p) => (id ? p.id !== Number(id) : true))
        .sort((a, b) => a.nome.localeCompare(b.nome)),
    [id, perfis],
  );

  const permissoesOrdenadas = useMemo(
    () => [...permissoes].sort((a, b) => a.label.localeCompare(b.label)),
    [permissoes],
  );

  const onSubmit = (values: FormValues) => {
    upsertPerfilMutation.mutate({
      id: id ? Number(id) : undefined,
      payload: {
        nome: values.nome,
        label: values.label,
        perfilPaiId: values.perfilPaiId ?? null,
        permissoesIds: values.permissoesIds,
      },
    });
  };

  const togglePermissao = (permissaoId: number) => {
    setValue(
      'permissoesIds',
      selectedPermissoes.includes(permissaoId)
        ? selectedPermissoes.filter((idAtual) => idAtual !== permissaoId)
        : [...selectedPermissoes, permissaoId],
      { shouldValidate: true },
    );
  };

  const handleCreatePermissao = async (payload: { nome: string; label: string }) => {
    await upsertPermissaoMutation.mutateAsync({ payload });
    await refetchPermissoes();
  };

  const isLoading = isLoadingPerfil || isLoadingPerfis || isLoadingPermissoes || upsertPerfilMutation.isPending;
  const isError = isErrorPerfil || isErrorPerfis;

  return (
    <div className="flex flex-1 flex-col gap-6">
      {!canManagePerfis ? (
        <div className="card-surface flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center">
          <span className="text-4xl">🚫</span>
          <h2 className="text-lg font-semibold text-slate-800">Acesso restrito</h2>
          <p className="max-w-md text-sm text-slate-500">
            Você não possui permissão para manter perfis. Solicite a inclusão da permissão <strong>manter-perfis</strong> a um administrador.
          </p>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
      ) : null}
      {canManagePerfis ? (
        <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{isEditing ? 'Editar perfil' : 'Novo perfil'}</h2>
          <p className="text-sm text-slate-500">
            Estruture permissões de acordo com a responsabilidade do perfil.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Voltar
          </Button>
          <Button form="perfil-form" type="submit" loading={upsertPerfilMutation.isPending}>
            {isEditing ? 'Salvar alterações' : 'Criar perfil'}
          </Button>
        </div>
      </div>

      <ResourceState
        isLoading={isLoading}
        isError={isError}
        onRetry={() => {
          refetchPerfis();
          refetchPermissoes();
        }}
      >
        <form
          id="perfil-form"
          className="card-surface grid gap-6 p-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <FormField label="Nome técnico" htmlFor="perfil-nome" error={errors.nome?.message} required>
              <TextInput
                id="perfil-nome"
                placeholder="gestor-negocio"
                hasError={Boolean(errors.nome)}
                {...register('nome', {
                  required: 'Informe o identificador do perfil.',
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: 'Utilize letras minúsculas, números e hífens.',
                  },
                })}
              />
            </FormField>

            <FormField label="Título" htmlFor="perfil-label" error={errors.label?.message} required>
              <TextInput
                id="perfil-label"
                placeholder="Gestor de Negócio"
                hasError={Boolean(errors.label)}
                {...register('label', {
                  required: 'Informe o nome exibido do perfil.',
                  minLength: {
                    value: 4,
                    message: 'Informe um título mais descritivo.',
                  },
                })}
              />
            </FormField>
          </div>

          <FormField label="Perfil pai" htmlFor="perfil-pai">
            <Select
              id="perfil-pai"
              value={watch('perfilPaiId') ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                setValue('perfilPaiId', value ? Number(value) : null);
              }}
            >
              <option value="">Nenhum</option>
              {perfisParaSelecao.map((perfilBase) => (
                <option key={perfilBase.id} value={perfilBase.id}>
                  {perfilBase.nome}
                </option>
              ))}
            </Select>
          </FormField>

          <PermissionsPanel
            permissions={permissoesOrdenadas}
            selectedIds={selectedPermissoes}
            onToggle={togglePermissao}
            onCreate={handleCreatePermissao}
            onRefresh={() => refetchPermissoes()}
            isLoadingList={isLoadingPermissoes}
            isCreating={upsertPermissaoMutation.isPending}
          />
        </form>
      </ResourceState>
        </>
      ) : null}
    </div>
  );
}

