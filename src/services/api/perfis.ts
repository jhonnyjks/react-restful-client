import { httpClient } from './httpClient';
import type { Perfil, PerfilPayload, Permissao } from './types';

type PermissaoResponse = {
  id: number;
  name: string;
  label: string;
};

type PerfilResponse = {
  id: number;
  name: string;
  label: string;
  parent_id?: number | null;
  permissoes?: PermissaoResponse[];
};

const mapPermissao = (permissao: PermissaoResponse): Permissao => ({
  id: permissao.id,
  nome: permissao.name,
  label: permissao.label,
});

const mapPerfil = (perfil: PerfilResponse): Perfil => ({
  id: perfil.id,
  nome: perfil.name,
  label: perfil.label,
  perfilPaiId: perfil.parent_id ?? null,
  permissoes: perfil.permissoes?.map(mapPermissao) ?? [],
});

const serializePayload = (payload: PerfilPayload) => ({
  name: payload.nome,
  label: payload.label,
  parent_id: payload.perfilPaiId ?? null,
  permissoes: payload.permissoesIds,
});

export async function listPerfis(): Promise<Perfil[]> {
  const { data } = await httpClient.get<PerfilResponse[]>('/perfis');
  return data.map(mapPerfil);
}

export async function getPerfil(id: number): Promise<Perfil> {
  const { data } = await httpClient.get<PerfilResponse>(`/perfis/${id}`);
  return mapPerfil(data);
}

export async function createPerfil(payload: PerfilPayload): Promise<Perfil> {
  const { data } = await httpClient.post<PerfilResponse>('/perfis', serializePayload(payload));
  return mapPerfil(data);
}

export async function updatePerfil(id: number, payload: PerfilPayload): Promise<Perfil> {
  const { data } = await httpClient.put<PerfilResponse>(`/perfis/${id}`, serializePayload(payload));
  return mapPerfil(data);
}

export async function deletePerfil(id: number): Promise<void> {
  await httpClient.delete(`/perfis/${id}`);
}

