import { useEffect, useMemo } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { TextInput } from '@/components/atoms/TextInput';
import { Checkbox } from '@/components/atoms/Checkbox';
import { FormField } from '@/components/molecules/FormField';
import { ResourceState } from '@/components/molecules/ResourceState';
import { usePerfis } from '@/modules/perfis/hooks/usePerfis';
import { useUsuario, useUpsertUsuario } from '../hooks/useUsuarios';
import { useAuthorization } from '@/hooks/useAuthorization';

type FormValues = {
  nome: string;
  email: string;
  perfisIds: number[];
  perfilPadraoId?: number | null;
  password?: string;
  passwordConfirmation?: string;
  isActive?: boolean;
};

export function UsuarioFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: usuario, isLoading: isLoadingUsuario, isError: isErrorUsuario } = useUsuario(id ? Number(id) : undefined);
  const { data: perfis = [], isLoading: isLoadingPerfis, isError: isErrorPerfis, refetch: refetchPerfis } = usePerfis();
  const upsertMutation = useUpsertUsuario({
    onSuccess: () => {
      navigate('/usuarios', { replace: true });
    },
  });
  const { hasPermission } = useAuthorization();
  const canManageUsuarios = hasPermission('manter-usuarios');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      nome: '',
      email: '',
      perfisIds: [],
      perfilPadraoId: null,
      password: '',
      passwordConfirmation: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (usuario) {
      reset({
        nome: usuario.nome,
        email: usuario.email,
        perfisIds: usuario.perfis.map((perfil) => perfil.id),
        perfilPadraoId: usuario.perfilPadraoId ?? null,
        password: '',
        passwordConfirmation: '',
        isActive: usuario.isActive ?? true,
      });
    }
  }, [reset, usuario]);

  const selectedPerfis = useWatch({
    control,
    name: 'perfisIds',
  }) ?? [];
  const perfilPadraoId = useWatch({
    control,
    name: 'perfilPadraoId',
  });

  useEffect(() => {
    if (selectedPerfis?.length && perfilPadraoId && !selectedPerfis.includes(perfilPadraoId)) {
      setValue('perfilPadraoId', selectedPerfis[0]);
    }
  }, [perfilPadraoId, selectedPerfis, setValue]);

  const onSubmit = (values: FormValues) => {
    upsertMutation.mutate({
      id: id ? Number(id) : undefined,
      payload: {
        nome: values.nome,
        email: values.email,
        perfisIds: values.perfisIds,
        perfilPadraoId: values.perfilPadraoId,
        password: values.password || undefined,
        passwordConfirmation: values.passwordConfirmation || undefined,
        isActive: values.isActive ?? true,
      },
    });
  };

  const isLoading = isLoadingUsuario || isLoadingPerfis || upsertMutation.isPending;
  const isError = isErrorPerfis || isErrorUsuario;

  const perfisDisponiveis = useMemo(() => [...perfis].sort((a, b) => a.nome.localeCompare(b.nome)), [perfis]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      {!canManageUsuarios ? (
        <div className="card-surface flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center">
          <span className="text-4xl">🔒</span>
          <h2 className="text-lg font-semibold text-slate-800">Acesso restrito</h2>
          <p className="max-w-md text-sm text-slate-500">
            Você não possui permissão para manter usuários. Solicite a inclusão da permissão <strong>manter-usuarios</strong> a um administrador.
          </p>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
      ) : null}
      {canManageUsuarios ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{isEditing ? 'Editar usuário' : 'Novo usuário'}</h2>
              <p className="text-sm text-slate-500">
                {isEditing
                  ? 'Atualize as informações de acesso e perfis vinculados.'
                  : 'Defina as credenciais, perfis e permissões do usuário.'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                Voltar
              </Button>
              <Button form="usuario-form" type="submit" loading={upsertMutation.isPending}>
                {isEditing ? 'Salvar alterações' : 'Criar usuário'}
              </Button>
            </div>
          </div>

          <ResourceState
            isLoading={isLoading}
            isError={isError}
            onRetry={() => {
              refetchPerfis();
            }}
          >
        <form
          id="usuario-form"
          className="card-surface grid gap-6 p-6 lg:grid-cols-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField label="Nome completo" htmlFor="nome" error={errors.nome?.message} required>
            <TextInput
              id="nome"
              placeholder="Maria Souza"
              hasError={Boolean(errors.nome)}
              {...register('nome', {
                required: 'Informe o nome do usuário.',
                minLength: {
                  value: 3,
                  message: 'O nome deve ter ao menos 3 caracteres.',
                },
              })}
            />
          </FormField>

          <FormField label="E-mail" htmlFor="email" error={errors.email?.message} required>
            <TextInput
              id="email"
              type="email"
              placeholder="maria@empresa.com"
              hasError={Boolean(errors.email)}
              {...register('email', {
                required: 'Informe um e-mail válido.',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'E-mail inválido.',
                },
              })}
            />
          </FormField>

          <FormField label="Status" htmlFor="isActive">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="isActive" 
                    checked={field.value ?? true}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <label htmlFor="isActive" className="text-sm text-content">
                    Usuário ativo
                  </label>
                </div>
              )}
            />
          </FormField>

          <FormField
            label="Senha"
            htmlFor="password"
            description={isEditing ? 'Preencha apenas se desejar alterar a senha.' : undefined}
            error={errors.password?.message}
            required={!isEditing}
          >
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              hasError={Boolean(errors.password)}
              {...register('password', {
                required: isEditing ? false : 'Informe uma senha temporária.',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter pelo menos 6 caracteres.',
                },
              })}
            />
          </FormField>

          <FormField
            label="Confirmação de senha"
            htmlFor="passwordConfirmation"
            error={errors.passwordConfirmation?.message}
            required={!isEditing}
          >
            <TextInput
              id="passwordConfirmation"
              type="password"
              placeholder="Repita a senha"
              hasError={Boolean(errors.passwordConfirmation)}
              {...register('passwordConfirmation', {
                validate: (value) => {
                  const password = getValues('password');
                  if ((password || value) && value !== password) {
                    return 'As senhas não conferem.';
                  }
                  return true;
                },
              })}
            />
          </FormField>

          <div className="lg:col-span-2">
            <FormField
              label="Perfis"
              description="Selecione um ou mais perfis. As permissões serão herdadas automaticamente."
              error={selectedPerfis.length ? undefined : 'Selecione ao menos um perfil.'}
            >
              <div className="grid gap-3 md:grid-cols-2">
                {perfisDisponiveis.map((perfil) => {
                  const checked = selectedPerfis.includes(perfil.id);
                  return (
                    <div
                      key={perfil.id}
                      className={`rounded-2xl border ${checked ? 'border-primary-400 bg-primary-50' : 'border-secondary-300 bg-white'} p-4`}
                    >
                      <Checkbox
                        checked={checked}
                        onChange={(event) => {
                          const isChecked = event.target.checked;
                          const next = new Set(selectedPerfis);
                          if (isChecked) {
                            next.add(perfil.id);
                          } else {
                            next.delete(perfil.id);
                          }
                          setValue('perfisIds', Array.from(next), { shouldValidate: true });
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{perfil.nome}</span>
                          <span className="text-xs text-slate-500">{perfil.label}</span>
                        </div>
                      </Checkbox>
                    </div>
                  );
                })}
              </div>
            </FormField>
          </div>

          <FormField
            label="Perfil padrão"
            description="Utilizado para herança de permissões prioritárias."
            error={selectedPerfis.length && !perfilPadraoId ? 'Defina um perfil padrão.' : undefined}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {perfisDisponiveis.map((perfil) => {
                const disabled = !selectedPerfis.includes(perfil.id);
                return (
                  <button
                    key={perfil.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => setValue('perfilPadraoId', perfil.id, { shouldValidate: true })}
                    className={`rounded-2xl border p-4 text-left transition ${
                      perfilPadraoId === perfil.id
                        ? 'border-primary-400 bg-primary-50 text-primary-700 shadow-soft'
                        : 'border-secondary-300 bg-white text-slate-700 hover:border-primary-300 hover:bg-secondary-100'
                    } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <p className="text-sm font-semibold">{perfil.nome}</p>
                    <p className="text-xs text-slate-500">Descrição: {perfil.label}</p>
                  </button>
                );
              })}
            </div>
          </FormField>
        </form>
          </ResourceState>
        </>
      ) : null}
    </div>
  );
}

