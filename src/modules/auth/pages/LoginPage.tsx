import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { TextInput } from '@/components/atoms/TextInput';
import { InfoBox } from '@/components/atoms/InfoBox';
import { FormField } from '@/components/molecules/FormField';
import { useLogin } from '../hooks/useLogin';
import { useSendLoginCode } from '../hooks/useSendLoginCode';
import { useLoginWithCode } from '../hooks/useLoginWithCode';
import { useAuthStore } from '@/store/authStore';
import { appConfig } from '@/utils/appConfig';

type LoginFormValues = {
  email: string;
  password: string;
  code: string;
};

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loginMutation = useLogin();
  const sendCodeMutation = useSendLoginCode();
  const loginWithCodeMutation = useLoginWithCode();
  const [loginMode, setLoginMode] = useState<'password' | 'code'>('password');
  const [codeSent, setCodeSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  });

  const email = watch('email');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (values: LoginFormValues) => {
    if (loginMode === 'password') {
      loginMutation.mutate({
        email: values.email,
        password: values.password,
      });
    } else {
      loginWithCodeMutation.mutate({
        email: values.email,
        code: values.code,
      });
    }
  };

  const handleSendCode = async () => {
    if (!email) {
      return;
    }

    try {
      await sendCodeMutation.mutateAsync(email);
      setCodeSent(true);
      setUserEmail(email);
    } catch (error) {
      // Erro já é tratado pelo hook
    }
  };

  const handleSwitchToCodeMode = async () => {
    setLoginMode('code');
    setValue('password', '');

    // Se tiver email válido, envia o código automaticamente
    if (email && /\S+@\S+\.\S+/.test(email)) {
      try {
        await sendCodeMutation.mutateAsync(email);
        setCodeSent(true);
        setUserEmail(email);
      } catch (error) {
        // Erro já é tratado pelo hook
        setCodeSent(false);
      }
    } else {
      setCodeSent(false);
    }
  };

  const handleSwitchToPasswordMode = () => {
    setLoginMode('password');
    setCodeSent(false);
    setValue('code', '');
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
          <h1 className="text-xl font-semibold text-content sm:text-2xl">{appConfig.appName}</h1>
          <p className="mt-2 text-sm text-content-subtle">
            Utilize suas credenciais para gerenciar usuários, perfis e permissões.
          </p>
        </div>

        <div className="card-surface">
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

            {loginMode === 'password' ? (
              <>
                <FormField
                  label="Senha"
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
                      required: 'Informe sua senha.',
                    })}
                  />
                </FormField>

                <div className="flex flex-col gap-3">
                  <Button type="submit" size="lg" loading={loginMutation.isPending} className="w-full">
                    Entrar
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={handleSwitchToCodeMode}
                    className="w-full"
                  >
                    Entrar sem senha
                  </Button>
                  <Link
                    to="/recuperar-senha"
                    className="text-center text-sm text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </>
            ) : (
              <>
                {codeSent ? (
                  <>
                    <InfoBox
                      title="Código enviado!"
                      description={
                        <>
                          Um código de 4 dígitos foi enviado para seu e-mail para autenticação. Verifique seu e-mail <strong>{userEmail}</strong> e informe o código recebido.
                        </>
                      }
                      variant="success"
                    />

                    <FormField
                      label="Código"
                      htmlFor="code"
                      error={errors.code?.message}
                      required
                    >
                      <Controller
                        name="code"
                        control={control}
                        rules={{
                          required: 'Informe o código recebido.',
                          pattern: {
                            value: /^\d{4}$/,
                            message: 'O código deve ter 4 dígitos.',
                          },
                        }}
                        render={({ field }) => (
                          <TextInput
                            id="code"
                            type="text"
                            placeholder="1234"
                            maxLength={4}
                            inputMode="numeric"
                            hasError={Boolean(errors.code)}
                            {...field}
                            onChange={(e) => {
                              // Remove caracteres não numéricos e limita a 4 dígitos
                              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                              field.onChange(value);
                            }}
                          />
                        )}
                      />
                    </FormField>

                    <div className="flex flex-col gap-3">
                      <Button
                        type="submit"
                        size="lg"
                        loading={loginWithCodeMutation.isPending}
                        className="w-full"
                      >
                        Entrar com código
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleSendCode}
                        loading={sendCodeMutation.isPending}
                        className="w-full"
                      >
                        Reenviar código
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleSwitchToPasswordMode}
                        className="w-full"
                      >
                        Voltar para login com senha
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <InfoBox
                      title="Entrar sem senha"
                      description={
                        sendCodeMutation.isPending
                          ? 'Enviando código para seu e-mail...'
                          : 'Informe seu e-mail e clique em "Enviar código" para receber o código de acesso.'
                      }
                      variant="info"
                    />

                    <Button
                      type="button"
                      size="lg"
                      onClick={handleSendCode}
                      loading={sendCodeMutation.isPending}
                      disabled={!email || !/\S+@\S+\.\S+/.test(email)}
                      className="w-full"
                    >
                      Enviar código
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      onClick={handleSwitchToPasswordMode}
                      className="w-full"
                      disabled={sendCodeMutation.isPending}
                    >
                      Voltar para login com senha
                    </Button>
                  </>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
