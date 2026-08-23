import { httpClient } from './httpClient';
import type {
  Scatter,
  ScatterAttachment,
  ScatterEngagement,
  ScatterPayload,
  ScatterSchedule,
} from './types';

type CategoryResponse = { id: string; name: string };

type AttachmentResponse = {
  id: string;
  type: ScatterAttachment['type'];
  mime: string;
  original_name: string;
  size: number;
  sort_order: number;
  download_url?: string;
};

type ScheduleResponse = {
  id: string;
  scatter_id: string;
  scheduled_at: string;
  status: string;
  started_at?: string | null;
  finished_at?: string | null;
  error_message?: string | null;
  groups_total: number;
  groups_sent: number;
  groups_failed?: number;
  members_total: number;
  members_sent: number;
  members_received: number;
  members_read: number;
  replies_group: number;
  replies_private: number;
  reactions?: Record<string, number>;
  reactions_list?: Array<{ emoji: string; count: number }>;
  instances_progress?: Array<{
    instance_id: string;
    instance_name: string;
    groups_total: number;
    groups_sent: number;
    groups_failed: number;
    groups_pending: number;
    current_group?: { id: string; name: string } | null;
  }>;
  last_stats_synced_at?: string | null;
  stats_sync_until?: string | null;
};

type ScatterResponse = {
  id: string;
  name: string;
  description?: string | null;
  message_text?: string | null;
  groups_count: number;
  members_count: number;
  categories: CategoryResponse[];
  attachments?: AttachmentResponse[];
  schedules?: ScheduleResponse[];
  schedules_count?: number;
  created_at?: string;
  updated_at?: string;
};

type EngagementResponse = {
  id: string;
  type: string;
  emoji?: string | null;
  member_id?: string | null;
  participant_name?: string | null;
  participant_number?: string | null;
  message_text?: string | null;
  occurred_at?: string | null;
  member?: {
    id: string;
    lid?: string | null;
    phone_number?: string | null;
    name?: string | null;
  } | null;
};

const mapAttachment = (item: AttachmentResponse): ScatterAttachment => ({
  id: item.id,
  type: item.type,
  mime: item.mime,
  originalName: item.original_name,
  size: item.size,
  sortOrder: item.sort_order,
  downloadUrl: item.download_url,
});

const mapSchedule = (item: ScheduleResponse): ScatterSchedule => ({
  id: item.id,
  scatterId: item.scatter_id,
  scheduledAt: item.scheduled_at,
  status: item.status,
  startedAt: item.started_at,
  finishedAt: item.finished_at,
  errorMessage: item.error_message,
  groupsTotal: item.groups_total,
  groupsSent: item.groups_sent,
  groupsFailed: item.groups_failed ?? 0,
  membersTotal: item.members_total,
  membersSent: item.members_sent,
  membersReceived: item.members_received,
  membersRead: item.members_read,
  repliesGroup: item.replies_group,
  repliesPrivate: item.replies_private,
  reactions: item.reactions ?? {},
  reactionsList: item.reactions_list,
  instancesProgress: (item.instances_progress ?? []).map((progress) => ({
    instanceId: progress.instance_id,
    instanceName: progress.instance_name,
    groupsTotal: progress.groups_total,
    groupsSent: progress.groups_sent,
    groupsFailed: progress.groups_failed,
    groupsPending: progress.groups_pending,
    currentGroup: progress.current_group
      ? { id: progress.current_group.id, name: progress.current_group.name }
      : null,
  })),
  lastStatsSyncedAt: item.last_stats_synced_at,
  statsSyncUntil: item.stats_sync_until,
});

const mapScatter = (item: ScatterResponse): Scatter => ({
  id: item.id,
  name: item.name,
  description: item.description,
  messageText: item.message_text,
  groupsCount: item.groups_count,
  membersCount: item.members_count,
  categories: item.categories ?? [],
  attachments: item.attachments?.map(mapAttachment),
  schedules: item.schedules?.map(mapSchedule),
  schedulesCount: item.schedules_count,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

export async function listScatters(): Promise<Scatter[]> {
  const { data } = await httpClient.get<ScatterResponse[]>('/scatters');
  return data.map(mapScatter);
}

export async function getScatter(id: string): Promise<Scatter> {
  const { data } = await httpClient.get<ScatterResponse>(`/scatters/${id}`);
  return mapScatter(data);
}

export async function createScatter(payload: ScatterPayload): Promise<Scatter> {
  const { data } = await httpClient.post<ScatterResponse>('/scatters', {
    name: payload.name,
    description: payload.description,
    message_text: payload.messageText,
    category_ids: payload.categoryIds,
  });
  return mapScatter(data);
}

export async function updateScatter(id: string, payload: ScatterPayload): Promise<Scatter> {
  const { data } = await httpClient.put<ScatterResponse>(`/scatters/${id}`, {
    name: payload.name,
    description: payload.description,
    message_text: payload.messageText,
    category_ids: payload.categoryIds,
  });
  return mapScatter(data);
}

export async function deleteScatter(id: string): Promise<void> {
  await httpClient.delete(`/scatters/${id}`);
}

export async function uploadScatterAttachment(
  scatterId: string,
  type: ScatterAttachment['type'],
  file: File,
): Promise<ScatterAttachment> {
  const formData = new FormData();
  formData.append('type', type);
  formData.append('file', file);

  const { data } = await httpClient.post<AttachmentResponse>(
    `/scatters/${scatterId}/attachments`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return mapAttachment(data);
}

export async function deleteScatterAttachment(scatterId: string, attachmentId: string): Promise<void> {
  await httpClient.delete(`/scatters/${scatterId}/attachments/${attachmentId}`);
}

export async function createScatterSchedule(scatterId: string, scheduledAt: string): Promise<ScatterSchedule> {
  const { data } = await httpClient.post<ScheduleResponse>(`/scatters/${scatterId}/schedules`, {
    scheduled_at: scheduledAt,
  });
  return mapSchedule(data);
}

export async function updateScatterSchedule(
  scatterId: string,
  scheduleId: string,
  scheduledAt: string,
): Promise<ScatterSchedule> {
  const { data } = await httpClient.put<ScheduleResponse>(
    `/scatters/${scatterId}/schedules/${scheduleId}`,
    { scheduled_at: scheduledAt },
  );
  return mapSchedule(data);
}

export async function deleteScatterSchedule(scatterId: string, scheduleId: string): Promise<void> {
  await httpClient.delete(`/scatters/${scatterId}/schedules/${scheduleId}`);
}

export async function getScatterSchedule(scatterId: string, scheduleId: string): Promise<ScatterSchedule> {
  const { data } = await httpClient.get<ScheduleResponse>(
    `/scatters/${scatterId}/schedules/${scheduleId}`,
  );
  return mapSchedule(data);
}

export async function listScatterEngagements(
  scatterId: string,
  scheduleId: string,
  params?: { type?: string; emoji?: string },
): Promise<ScatterEngagement[]> {
  const { data } = await httpClient.get<EngagementResponse[]>(
    `/scatters/${scatterId}/schedules/${scheduleId}/engagements`,
    { params },
  );

  return data.map((item) => ({
    id: item.id,
    type: item.type,
    emoji: item.emoji,
    memberId: item.member_id,
    member: item.member
      ? {
          id: item.member.id,
          lid: item.member.lid,
          phoneNumber: item.member.phone_number,
          name: item.member.name,
        }
      : null,
    participantName: item.participant_name ?? item.member?.name ?? null,
    participantNumber: item.participant_number ?? item.member?.phone_number ?? item.member?.lid ?? null,
    messageText: item.message_text,
    occurredAt: item.occurred_at,
  }));
}

export type SuggestScatterCategoriesPayload = {
  name?: string | null;
  description?: string | null;
  messageText?: string | null;
  scatterId?: string;
  clientAttachments?: Array<{
    type: 'image' | 'document' | 'voice';
    originalName: string;
    mime: string;
    data?: string;
  }>;
};

export async function suggestScatterCategories(
  payload: SuggestScatterCategoriesPayload,
): Promise<{ categoryIds: string[]; categories: Array<{ id: string; name: string }> }> {
  const { data } = await httpClient.post<{
    category_ids: string[];
    categories: Array<{ id: string; name: string }>;
  }>('/scatters/suggest-categories', {
    name: payload.name,
    description: payload.description,
    message_text: payload.messageText,
    scatter_id: payload.scatterId,
    client_attachments: payload.clientAttachments?.map((item) => ({
      type: item.type,
      original_name: item.originalName,
      mime: item.mime,
      data: item.data,
    })),
  });

  return {
    categoryIds: data.category_ids,
    categories: data.categories,
  };
}
