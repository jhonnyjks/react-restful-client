export type Permissao = {
  id: number;
  nome: string;
  label: string;
};

export type Perfil = {
  id: number;
  nome: string;
  label: string;
  perfilPaiId?: number | null;
  permissoes: Permissao[];
};

export type PerfilSummary = Pick<Perfil, 'id' | 'nome' | 'label'>;

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  perfilPadraoId?: number | null;
  perfis: PerfilSummary[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UsuarioPayload = {
  nome: string;
  email: string;
  perfisIds: number[];
  perfilPadraoId?: number | null;
  password?: string;
  passwordConfirmation?: string;
  isActive?: boolean;
};

export type PerfilPayload = {
  nome: string;
  label: string;
  permissoesIds: number[];
  perfilPaiId?: number | null;
};

export type PermissaoPayload = {
  nome: string;
  label: string;
};

export type GrupoInstance = {
  id: string;
  name: string;
  status: string;
  isActive: boolean;
};

export type GrupoCategory = {
  id: string;
  name?: string | null;
  description?: string | null;
};

export type Grupo = {
  id: string;
  wahaId: string;
  name: string;
  description?: string | null;
  membersCount: number;
  categorizedAt?: string | null;
  instances: GrupoInstance[];
  permissibleCategories?: GrupoCategory[];
  forbiddenCategories?: GrupoCategory[];
  createdAt?: string;
  updatedAt?: string;
};

export type GroupSyncRun = {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | string;
  phase?: string | null;
  processed: number;
  total: number;
  errorMessage?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type GroupCategorizationRun = GroupSyncRun;

export type Categoria = {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
};

export type ScatterAttachmentType = 'image' | 'video' | 'document' | 'voice';

export type ScatterAttachment = {
  id: string;
  type: ScatterAttachmentType;
  mime: string;
  originalName: string;
  size: number;
  sortOrder: number;
  downloadUrl?: string;
};

export type ScatterScheduleStatus =
  | 'pending'
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | string;

export type ScatterInstanceProgress = {
  instanceId: string;
  instanceName: string;
  groupsTotal: number;
  groupsSent: number;
  groupsFailed: number;
  groupsPending: number;
  currentGroup?: { id: string; name: string } | null;
};

export type ScatterSchedule = {
  id: string;
  scatterId: string;
  scheduledAt: string;
  status: ScatterScheduleStatus;
  startedAt?: string | null;
  finishedAt?: string | null;
  errorMessage?: string | null;
  groupsTotal: number;
  groupsSent: number;
  groupsFailed?: number;
  membersTotal: number;
  membersSent: number;
  membersReceived: number;
  membersRead: number;
  repliesGroup: number;
  repliesPrivate: number;
  reactions: Record<string, number>;
  reactionsList?: Array<{ emoji: string; count: number }>;
  instancesProgress?: ScatterInstanceProgress[];
  lastStatsSyncedAt?: string | null;
  statsSyncUntil?: string | null;
};

export type Scatter = {
  id: string;
  name: string;
  description?: string | null;
  messageText?: string | null;
  groupsCount: number;
  membersCount: number;
  categories: Array<{ id: string; name: string }>;
  attachments?: ScatterAttachment[];
  schedules?: ScatterSchedule[];
  schedulesCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ScatterPayload = {
  name: string;
  description?: string | null;
  messageText?: string | null;
  categoryIds: string[];
};

export type ScatterMember = {
  id: string;
  lid?: string | null;
  phoneNumber?: string | null;
  name?: string | null;
};

export type ScatterEngagement = {
  id: string;
  type: 'reaction' | 'reply_group' | 'reply_private' | string;
  emoji?: string | null;
  memberId?: string | null;
  member?: ScatterMember | null;
  participantName?: string | null;
  participantNumber?: string | null;
  messageText?: string | null;
  occurredAt?: string | null;
};

