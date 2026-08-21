import { httpClient } from './httpClient';
import type { Permissao, PermissaoPayload } from './types';

type PermissaoResponse = {
  id: number;
  name: string;
  label: string;
};

const mapPermissao = (permissao: PermissaoResponse): Permissao => ({
  id: permissao.id,
  nome: permissao.name,
  label: permissao.label,
});

const serializePayload = (payload: PermissaoPayload) => ({
  name: payload.nome,
  label: payload.label,
});

export async function listPermissoes(): Promise<Permissao[]> {
  const { data } = await httpClient.get<PermissaoResponse[]>('/permissoes');
  return data.map(mapPermissao);
}

export async function createPermissao(payload: PermissaoPayload): Promise<Permissao> {
  const { data } = await httpClient.post<PermissaoResponse>('/permissoes', serializePayload(payload));
  return mapPermissao(data);
}

export async function updatePermissao(id: number, payload: PermissaoPayload): Promise<Permissao> {
  const { data } = await httpClient.put<PermissaoResponse>(`/permissoes/${id}`, serializePayload(payload));
  return mapPermissao(data);
}

export async function deletePermissao(id: number): Promise<void> {
  await httpClient.delete(`/permissoes/${id}`);
}

