import { httpClient } from './httpClient';
import type { Grupo, GroupCategorizationRun, GroupSyncRun } from './types';

type GrupoInstanceResponse = {
  id: string;
  name: string;
  status: string;
  is_active: boolean;
};

type GrupoCategoryResponse = {
  id: string;
  name?: string | null;
  description?: string | null;
};

type GrupoResponse = {
  id: string;
  waha_id: string;
  name: string;
  description?: string | null;
  members_count: number;
  categorized_at?: string | null;
  instances: GrupoInstanceResponse[];
  permissible_categories?: GrupoCategoryResponse[];
  forbidden_categories?: GrupoCategoryResponse[];
  created_at?: string;
  updated_at?: string;
};

type SyncStartResponse = {
  sync_run_id: string;
  status: string;
};

type CategorizeStartResponse = {
  categorization_run_id: string;
  status: string;
};

type JobStatusResponse = {
  id: string;
  status: string;
  phase?: string | null;
  processed: number;
  total: number;
  error_message?: string | null;
  created_at?: string;
  updated_at?: string;
};

const mapGrupo = (grupo: GrupoResponse): Grupo => ({
  id: grupo.id,
  wahaId: grupo.waha_id,
  name: grupo.name,
  description: grupo.description,
  membersCount: grupo.members_count,
  categorizedAt: grupo.categorized_at,
  instances: (grupo.instances ?? []).map((instance) => ({
    id: instance.id,
    name: instance.name,
    status: instance.status,
    isActive: Boolean(instance.is_active),
  })),
  permissibleCategories: grupo.permissible_categories?.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
  })),
  forbiddenCategories: grupo.forbidden_categories?.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
  })),
  createdAt: grupo.created_at,
  updatedAt: grupo.updated_at,
});

const mapJobRun = (run: JobStatusResponse): GroupSyncRun => ({
  id: run.id,
  status: run.status,
  phase: run.phase,
  processed: run.processed,
  total: run.total,
  errorMessage: run.error_message,
  createdAt: run.created_at,
  updatedAt: run.updated_at,
});

export async function listGrupos(): Promise<Grupo[]> {
  const { data } = await httpClient.get<GrupoResponse[]>('/grupos');
  return data.map(mapGrupo);
}

export async function getGrupo(id: string): Promise<Grupo> {
  const { data } = await httpClient.get<GrupoResponse>(`/grupos/${id}`);
  return mapGrupo(data);
}

export async function startGruposSync(): Promise<{ syncRunId: string; status: string }> {
  const { data } = await httpClient.post<SyncStartResponse>('/grupos/sync');
  return {
    syncRunId: data.sync_run_id,
    status: data.status,
  };
}

export async function getGruposSyncStatus(syncRunId: string): Promise<GroupSyncRun> {
  const { data } = await httpClient.get<JobStatusResponse>(`/grupos/sync/${syncRunId}`);
  return mapJobRun(data);
}

export async function startGruposCategorization(): Promise<{ categorizationRunId: string; status: string }> {
  const { data } = await httpClient.post<CategorizeStartResponse>('/grupos/categorizar');
  return {
    categorizationRunId: data.categorization_run_id,
    status: data.status,
  };
}

export async function getGruposCategorizationStatus(
  categorizationRunId: string,
): Promise<GroupCategorizationRun> {
  const { data } = await httpClient.get<JobStatusResponse>(`/grupos/categorizar/${categorizationRunId}`);
  return mapJobRun(data);
}
