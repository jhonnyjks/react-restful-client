import { httpClient } from './httpClient';
import type { PerfilSummary, Usuario, UsuarioPayload } from './types';

type UsuarioResponse = {
  id: number;
  name: string;
  email: string;
  is_active?: number;
  default_profile_id?: number | null;
  perfis?: Array<{
    id: number;
    name: string;
    label: string;
  }>;
  created_at?: string;
  updated_at?: string;
};

const mapPerfilSummary = (perfil: NonNullable<UsuarioResponse['perfis']>[number]): PerfilSummary => ({
  id: perfil.id,
  nome: perfil.name,
  label: perfil.label,
});

const mapUsuario = (usuario: UsuarioResponse): Usuario => ({
  id: usuario.id,
  nome: usuario.name,
  email: usuario.email,
  isActive: usuario.is_active === 1,
  perfis: usuario.perfis?.map(mapPerfilSummary) ?? [],
  perfilPadraoId: usuario.default_profile_id,
  createdAt: usuario.created_at,
  updatedAt: usuario.updated_at,
});

const serializePayload = (payload: UsuarioPayload) => ({
  name: payload.nome,
  email: payload.email,
  perfil_padrao_id: payload.perfilPadraoId ?? null,
  perfis: payload.perfisIds,
  password: payload.password,
  password_confirmation: payload.passwordConfirmation ?? payload.password,
  is_active: payload.isActive !== undefined ? (payload.isActive ? 1 : 0) : undefined,
});

export async function listUsuarios(): Promise<Usuario[]> {
  const { data } = await httpClient.get<UsuarioResponse[]>('/usuarios');
  return data.map(mapUsuario);
}

export async function getUsuario(id: number): Promise<Usuario> {
  const { data } = await httpClient.get<UsuarioResponse>(`/usuarios/${id}`);
  return mapUsuario(data);
}

export async function createUsuario(payload: UsuarioPayload): Promise<Usuario> {
  const { data } = await httpClient.post<UsuarioResponse>('/usuarios', serializePayload(payload));
  return mapUsuario(data);
}

export async function updateUsuario(id: number, payload: UsuarioPayload): Promise<Usuario> {
  const { data } = await httpClient.put<UsuarioResponse>(`/usuarios/${id}`, serializePayload(payload));
  return mapUsuario(data);
}

export async function deleteUsuario(id: number): Promise<void> {
  await httpClient.delete(`/usuarios/${id}`);
}

export async function toggleUsuarioActive(id: number): Promise<{ is_active: number }> {
  const { data } = await httpClient.patch<{ is_active: number }>(`/usuarios/${id}/toggle-active`);
  return data;
}

