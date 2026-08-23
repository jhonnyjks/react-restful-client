import { httpClient } from './httpClient';
import type { Categoria } from './types';

type CategoriaResponse = {
  id: string;
  name: string;
  description?: string | null;
  parent_id?: string | null;
};

export async function listCategorias(): Promise<Categoria[]> {
  const { data } = await httpClient.get<CategoriaResponse[]>('/categorias');
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    parentId: item.parent_id,
  }));
}
