import { getCsrfCookie, httpClient } from './httpClient';
import type { SessionPerfil, SessionUser } from '@/store/authStore';

export type LoginPayload = {
  email: string;
  password: string;
};

export type SendLoginCodePayload = {
  email: string;
};

export type LoginWithCodePayload = {
  email: string;
  code: string;
};

export type AuthResponse = {
  token: string;
  token_type: string;
  user: {
    id: number;
    nome: string;
    email: string;
  };
  perfis: Array<{
    id: number;
    nome: string;
    label: string;
    padrao?: boolean;
  }>;
  permissoes: string[];
};

export async function login(payload: LoginPayload) {
  await getCsrfCookie();
  const { data } = await httpClient.post<AuthResponse>('/auth/login', payload);

  return {
    token: data.token,
    token_type: data.token_type,
    user: mapUser(data.user),
    perfis: data.perfis?.map(mapPerfil) ?? [],
    permissoes: data.permissoes ?? [],
  };
}

export async function logout() {
  await getCsrfCookie();
  await httpClient.post('/auth/logout');
}

export async function refreshToken() {
  await getCsrfCookie();
  const { data } = await httpClient.post<AuthResponse>('/auth/refresh');
  return {
    token: data.token,
    token_type: data.token_type,
    user: mapUser(data.user),
    perfis: data.perfis?.map(mapPerfil) ?? [],
    permissoes: data.permissoes ?? [],
  };
}

export async function sendLoginCode(payload: SendLoginCodePayload) {
  await getCsrfCookie();
  const { data } = await httpClient.post<{ message: string }>('/auth/send-login-code', payload);
  return data;
}

export async function loginWithCode(payload: LoginWithCodePayload) {
  await getCsrfCookie();
  const { data } = await httpClient.post<AuthResponse>('/auth/login-with-code', payload);
  return {
    token: data.token,
    token_type: data.token_type,
    user: mapUser(data.user),
    perfis: data.perfis?.map(mapPerfil) ?? [],
    permissoes: data.permissoes ?? [],
  };
}

function mapUser(user: AuthResponse['user']): SessionUser {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
  };
}

function mapPerfil(perfil: AuthResponse['perfis'][number]): SessionPerfil {
  return {
    id: perfil.id,
    nome: perfil.nome,
    label: perfil.label,
    padrao: perfil.padrao,
  };
}

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export async function forgotPassword(payload: ForgotPasswordPayload) {
  await getCsrfCookie();
  const { data } = await httpClient.post<{ message: string }>('/auth/forgot-password', payload);
  return data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  await getCsrfCookie();
  const { data } = await httpClient.post<{ message: string }>('/auth/reset-password', payload);
  return data;
}
