import { useForm } from 'react-hook-form';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { TextInput } from '@/components/atoms/TextInput';
import { InfoBox } from '@/components/atoms/InfoBox';
import { FormField } from '@/components/molecules/FormField';
import { useForgotPassword } from '../hooks/usePasswordReset';
import { useAuthStore } from '@/store/authStore';
import { appConfig } from '@/utils/appConfig';
import { ResetPasswordPage } from './ResetPasswordPage';

type ForgotPasswordFormValues = {
  email: string;
};

export function ForgotPasswordPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [searchParams] = useSearchParams();
  const forgotPasswordMutation = useForgotPassword();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Se tiver token e email, renderiza a página de reset
  if (token && email) {
    return <ResetPasswordPage />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate({
      email: values.email,
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
          <h1 className="text-xl font-semibold text-content sm:text-2xl">Recuperar Senha</h1>
          <p className="mt-2 text-sm text-content-subtle">
            Informe seu e-mail para receber um link de recuperação de senha.
          </p>
        </div>

        <div className="card-surface">
          {forgotPasswordMutation.isSuccess ? (
            <InfoBox
              variant="success"
              title="E-mail enviado!"
              description="Se o e-mail informado estiver cadastrado, você receberá um link de recuperação de senha. Verifique sua caixa de entrada e spam."
            />
          ) : (
            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleSubmit(onSubmit)}>
              <FormField
                label="E-mail"
                htmlFor="email"
                error={errors.email?.message}
                required
              >
                <TextInput
                  id="email"
                  type="email"
                  placeholder="seuemail@empresa.com"
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

              <Button type="submit" size="lg" loading={forgotPasswordMutation.isPending} className="w-full">
                Enviar link de recuperação
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
