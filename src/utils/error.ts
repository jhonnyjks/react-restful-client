import type { AxiosError } from 'axios';

type ApiErrorDetail = {
  message: string;
  field?: string;
};

export type ParsedApiError = {
  status?: number;
  message: string;
  details?: ApiErrorDetail[];
};

export function parseApiError(error: unknown): ParsedApiError {
  const defaultError: ParsedApiError = {
    message: 'Ocorreu um erro inesperado. Tente novamente.',
  };

  if (!isAxiosError(error)) {
    return defaultError;
  }

  const status = error.response?.status;
  const responseData = error.response?.data;

  if (!responseData || typeof responseData !== 'object') {
    return {
      ...defaultError,
      status,
    };
  }

  const data = responseData as Record<string, unknown>;

  // Laravel retorna erros de validação (422) diretamente no objeto raiz
    // Exemplo: { "email": ["O campo email já está sendo utilizado."] }
    if (status === 422) {
    if (typeof data.message === 'string' && data.message.trim() !== '') {
      return {
        status,
        message: data.message,
      };
    }

    const validationErrors: Record<string, unknown> = {};
    let hasValidationErrors = false;
    const chavesIgnoradas = new Set([
      'message',
      'error',
      'errors',
      'exception',
      'file',
      'line',
      'trace',
    ]);

    // Verifica se há erros diretamente no objeto (formato Laravel padrão)
    Object.entries(data).forEach(([key, value]) => {
      if (!chavesIgnoradas.has(key)) {
        if (Array.isArray(value) || typeof value === 'string') {
          validationErrors[key] = value;
          hasValidationErrors = true;
        }
      }
    });

    // Se encontrou erros de validação no formato direto
    if (hasValidationErrors) {
      const details: ApiErrorDetail[] = Object.entries(validationErrors).flatMap(([field, messages]) => {
        if (Array.isArray(messages)) {
          return messages.map((message) => ({
            field,
            message: String(message),
          }));
        }

        if (typeof messages === 'string') {
          return [
            {
              field,
              message: messages,
            },
          ];
        }

        return [];
      });

      // Se há apenas um erro, usa a mensagem específica como título
      if (details.length === 1) {
        return {
          status,
          message: details[0].message,
          details,
        };
      }

      return {
        status,
        message: 'Verifique os dados informados.',
        details,
      };
    }
  }

  if (typeof data.message === 'string') {
    return {
      status,
      message: data.message,
    };
  }

  if (typeof data.error === 'string') {
    return {
      status,
      message: data.error,
    };
  }

  if (data.errors && typeof data.errors === 'object') {
    const errorsRecord = data.errors as Record<string, unknown>;
    const details: ApiErrorDetail[] = Object.entries(errorsRecord).flatMap(([field, messages]) => {
      if (Array.isArray(messages)) {
        return messages.map((message) => ({
          field,
          message: String(message),
        }));
      }

      if (typeof messages === 'string') {
        return [
          {
            field,
            message: messages,
          },
        ];
      }

      return [];
    });

    // Se há apenas um erro, usa a mensagem específica como título
    if (details.length === 1) {
      return {
        status,
        message: details[0].message,
        details,
      };
    }

    return {
      status,
      message: 'Verifique os dados informados.',
      details,
    };
  }

  return {
    status,
    message: defaultError.message,
  };
}

function isAxiosError(error: unknown): error is AxiosError {
  return Boolean(error) && typeof error === 'object' && error !== null && 'isAxiosError' in error;
}

