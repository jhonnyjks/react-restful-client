import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { ResourceState } from '@/components/molecules/ResourceState';
import { formatLocalDateTime } from '@/utils/datetime';
import type { ScatterInstanceProgress } from '@/services/api/types';
import { useScatterEngagements, useScatterSchedule } from '../hooks/useScatters';

type EngagementFilter = { type?: string; emoji?: string } | null;

function ratio(sent: number, total: number) {
  return `${sent} / ${total}`;
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: 'Pendente',
    queued: 'Na fila',
    running: 'Enviando',
    completed: 'Concluído',
    failed: 'Falhou',
    cancelled: 'Cancelado',
  };
  return map[status] ?? status;
}

function instanceStatusText(instance: ScatterInstanceProgress) {
  if (instance.currentGroup) {
    return `Enviando agora: ${instance.currentGroup.name}`;
  }
  if (instance.groupsPending > 0) {
    return 'Aguardando próximo grupo…';
  }
  if (instance.groupsFailed > 0) {
    return `Concluído com ${instance.groupsFailed} falha(s)`;
  }
  return 'Concluído nesta instância';
}

export function ScatterScheduleStatsPage() {
  const { id, scheduleId } = useParams<{ id: string; scheduleId: string }>();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<EngagementFilter>(null);

  const {
    data: schedule,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useScatterSchedule(id, scheduleId);

  const {
    data: engagements = [],
    isLoading: loadingEngagements,
    isError: engagementsError,
  } = useScatterEngagements(id, scheduleId, filter ?? undefined, Boolean(filter));

  const reactionsList = useMemo(() => {
    if (schedule?.reactionsList?.length) {
      return schedule.reactionsList;
    }
    return Object.entries(schedule?.reactions ?? {}).map(([emoji, count]) => ({ emoji, count }));
  }, [schedule]);

  const isLive = schedule?.status === 'running' || schedule?.status === 'queued';

  return (
    <div className="flex w-full flex-1 flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-content sm:text-xl">Estatísticas do envio</h2>
          <p className="mt-1 text-sm text-content-subtle">
            Totais persistidos localmente
            {isLive ? ' · atualizando a cada 2s durante o envio' : ''}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isFetching ? (
            <span className="text-xs text-content-subtle">Atualizando…</span>
          ) : null}
          <Button variant="secondary" onClick={() => navigate(`/scatters/${id}`)}>
            Voltar ao scatter
          </Button>
        </div>
      </div>

      <ResourceState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
        {schedule ? (
          <div className="space-y-4">
            <section className="card-surface flex flex-wrap items-center gap-3 px-4 py-3">
              <Badge variant="subtle">{statusLabel(schedule.status)}</Badge>
              <span className="text-sm text-content-subtle">
                Agendado: {formatLocalDateTime(schedule.scheduledAt)}
              </span>
              {schedule.lastStatsSyncedAt ? (
                <span className="text-sm text-content-subtle">
                  Última sync: {formatLocalDateTime(schedule.lastStatsSyncedAt)}
                </span>
              ) : null}
              {schedule.errorMessage ? (
                <p className="w-full text-sm text-rose-600">{schedule.errorMessage}</p>
              ) : null}
            </section>

            <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
              {/* Coluna 1 — Grupos enviados */}
              <div className="card-surface flex min-h-0 flex-col p-4">
                <div className="shrink-0">
                  <p className="text-xs uppercase tracking-wide text-content-subtle">Grupos enviados</p>
                  <p className="mt-2 text-2xl font-semibold text-content">
                    {ratio(schedule.groupsSent, schedule.groupsTotal)}
                  </p>
                  {(schedule.groupsFailed ?? 0) > 0 ? (
                    <p className="mt-1 text-xs text-rose-600">{schedule.groupsFailed} falha(s)</p>
                  ) : null}
                </div>

                {(schedule.instancesProgress?.length ?? 0) > 0 ? (
                  <ul className="mt-3 max-h-[min(70vh,36rem)] space-y-2 overflow-y-auto border-t border-border pt-3">
                    {schedule.instancesProgress?.map((instance) => {
                      const percent = Math.min(
                        100,
                        Math.round((instance.groupsSent / Math.max(instance.groupsTotal, 1)) * 100),
                      );
                      return (
                        <li key={instance.instanceId} className="rounded-medium border border-border px-3 py-2">
                          <div className="flex items-start justify-between gap-2 text-sm">
                            <span className="min-w-0 break-all font-medium text-content">
                              {instance.instanceName}
                            </span>
                            <span className="shrink-0 text-content-subtle">
                              {instance.groupsSent} / {instance.groupsTotal}
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded bg-slate-100">
                            <div
                              className="h-full bg-primary-500 transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <p className="mt-2 line-clamp-2 text-xs text-content-subtle">
                            {instanceStatusText(instance)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-3 text-xs text-content-subtle">Nenhuma instância materializada ainda.</p>
                )}
              </div>

              {/* Colunas 2–3 — métricas + reações em duas colunas */}
              <div className="flex flex-col gap-4 lg:col-span-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <StatCard
                    label="Membros enviados"
                    value={ratio(schedule.membersSent, schedule.membersTotal)}
                  />
                  <StatCard
                    label="Leituras / recebidos"
                    value={ratio(schedule.membersRead, schedule.membersReceived)}
                  />
                  <EngagementCard
                    label="Respostas no grupo"
                    value={schedule.repliesGroup}
                    onClick={() => setFilter({ type: 'reply_group' })}
                  />
                  <EngagementCard
                    label="Respostas no privado"
                    value={schedule.repliesPrivate}
                    onClick={() => setFilter({ type: 'reply_private' })}
                  />
                </div>

                <section className="card-surface space-y-3 p-4">
                  <h3 className="text-sm font-semibold text-content">Reações por emoji</h3>
                  {reactionsList.length === 0 ? (
                    <p className="text-sm text-content-subtle">Nenhuma reação sincronizada ainda.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {reactionsList.map((item) => (
                        <button
                          key={item.emoji}
                          type="button"
                          className="rounded-medium border border-border px-3 py-2 text-sm hover:border-primary-500"
                          onClick={() => setFilter({ type: 'reaction', emoji: item.emoji })}
                        >
                          <span className="text-lg">{item.emoji}</span> × {item.count}
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </section>
          </div>
        ) : null}
      </ResourceState>

      {filter ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-large bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="font-semibold text-content">
                {filter.type === 'reaction'
                  ? `Reações ${filter.emoji ?? ''}`
                  : filter.type === 'reply_private'
                    ? 'Respostas no privado'
                    : 'Respostas no grupo'}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setFilter(null)}>
                Fechar
              </Button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {loadingEngagements ? (
                <p className="text-sm text-content-subtle">Carregando...</p>
              ) : engagementsError ? (
                <p className="text-sm text-rose-600">Não foi possível carregar a lista.</p>
              ) : engagements.length === 0 ? (
                <p className="text-sm text-content-subtle">Nenhum registro encontrado.</p>
              ) : (
                <ul className="space-y-2">
                  {engagements.map((item) => (
                    <li key={item.id} className="rounded-medium border border-border px-3 py-2 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-content">{item.participantName || 'Sem nome'}</p>
                          {item.occurredAt ? (
                            <p className="text-xs text-content-subtle">{formatLocalDateTime(item.occurredAt)}</p>
                          ) : null}
                        </div>
                        {item.emoji ? <span className="shrink-0 text-lg leading-none">{item.emoji}</span> : null}
                      </div>
                      <p className="text-content-subtle">{formatParticipantNumber(item.participantNumber)}</p>
                      {item.messageText ? (
                        <p className="mt-1 whitespace-pre-wrap text-content">{item.messageText}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface p-4">
      <p className="text-xs uppercase tracking-wide text-content-subtle">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-content">{value}</p>
    </div>
  );
}

function EngagementCard({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="card-surface p-4 text-left transition hover:border-primary-500"
      onClick={onClick}
    >
      <p className="text-xs uppercase tracking-wide text-content-subtle">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-content">{value}</p>
      <p className="mt-1 text-xs text-primary-600">Ver quem respondeu</p>
    </button>
  );
}

function formatParticipantNumber(value?: string | null): string {
  if (!value) {
    return '—';
  }
  const digits = value.replace(/\D+/g, '');
  if (digits.length >= 12 && digits.startsWith('55')) {
    const ddd = digits.slice(2, 4);
    const rest = digits.slice(4);
    if (rest.length === 9) {
      return `+55 (${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
    }
    if (rest.length === 8) {
      return `+55 (${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
    }
  }
  return digits || value;
}
