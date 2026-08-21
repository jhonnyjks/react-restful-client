import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { TextInput } from '@/components/atoms/TextInput';
import { InfoBox } from '@/components/atoms/InfoBox';
import { FormField } from '@/components/molecules/FormField';
import { useResetPassword } from '../hooks/usePasswordReset';
import { useAuthStore } from '@/store/authStore';
import { appConfig } from '@/utils/appConfig';

type ResetPasswordFormValues = {
  password: string;
  password_confirmation: string;
};

export function ResetPasswordPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [searchParams] = useSearchParams();
  const resetPasswordMutation = useResetPassword();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  const password = watch('password');

  useEffect(() => {
    if (!token || !email) {
      // Se não tiver token ou email, pode redirecionar ou mostrar erro
    }
  }, [token, email]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-md">
          <div className="card-surface">
            <InfoBox
              variant="error"
              title="Link inválido"
              description="O link de recuperação de senha é inválido ou expirado. Solicite um novo link de recuperação."
            />
            <div className="mt-6 text-center">
              <Link
                to="/recuperar-senha"
                className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
              >
                Solicitar novo link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!token || !email) {
      return;
    }

    resetPasswordMutation.mutate({
      token,
      email,
      password: values.password,
      password_confirmation: values.password_confirmation,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-large bg-primary-500 text-xl font-bold text-content-on-color sm:h-16 sm:w-16 sm:text-2xl">
            {appConfig.appName
              .split(' ')
              .map((word: string) => word[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <h1 className="text-xl font-semibold text-content sm:text-2xl">Redefinir Senha</h1>
          <p className="mt-2 text-sm text-content-subtle">
            Defina uma nova senha para sua conta.
          </p>
        </div>

        <div className="card-surface">
          {resetPasswordMutation.isSuccess ? (
            <InfoBox
              variant="success"
              title="Senha redefinida!"
              description="Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login."
            />
          ) : (
            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleSubmit(onSubmit)}>
              <FormField
                label="Nova senha"
                htmlFor="password"
                error={errors.password?.message}
                required
              >
                <TextInput
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  hasError={Boolean(errors.password)}
                  {...register('password', {
                    required: 'Informe uma nova senha.',
                    minLength: {
                      value: 6,
                      message: 'A senha deve ter pelo menos 6 caracteres.',
                    },
                  })}
                />
              </FormField>

              <FormField
                label="Confirmar nova senha"
                htmlFor="password_confirmation"
                error={errors.password_confirmation?.message}
                required
              >
                <TextInput
                  id="password_confirmation"
                  type="password"
                  placeholder="••••••••"
                  hasError={Boolean(errors.password_confirmation)}
                  {...register('password_confirmation', {
                    required: 'Confirme sua nova senha.',
                    validate: (value) => {
                      if (value !== password) {
                        return 'As senhas não coincidem.';
                      }
                      return true;
                    },
                  })}
                />
              </FormField>

              <Button type="submit" size="lg" loading={resetPasswordMutation.isPending} className="w-full">
                Redefinir senha
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
            >
              Voltar para login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
