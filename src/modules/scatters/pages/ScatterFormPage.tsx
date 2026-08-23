import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { TextArea } from '@/components/atoms/TextArea';
import { TextInput } from '@/components/atoms/TextInput';
import { FormField } from '@/components/molecules/FormField';
import { ResourceState } from '@/components/molecules/ResourceState';
import { useAuthorization } from '@/hooks/useAuthorization';
import { parseApiError } from '@/utils/error';
import { applyParsedApiErrorsToForm } from '@/utils/formErrors';
import { formatLocalDateTime, localInputToUtcIso } from '@/utils/datetime';
import type { ScatterAttachment } from '@/services/api/types';
import { WhatsAppMessagePreview } from '../components/WhatsAppMessagePreview';
import {
  useCategorias,
  useCreateScatterSchedule,
  useDeleteScatterAttachment,
  useDeleteScatterSchedule,
  useScatter,
  useSuggestScatterCategories,
  useUploadScatterAttachment,
  useUpsertScatter,
} from '../hooks/useScatters';

type FormValues = {
  name: string;
  description: string;
  messageText: string;
  categoryIds: string[];
};

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

export function ScatterFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { hasPermission } = useAuthorization();
  const canManage = hasPermission('manter-scatters');

  const { data: scatter, isLoading, isError, refetch } = useScatter(id);
  const { data: categorias = [], isLoading: loadingCategorias } = useCategorias();
  const upsertMutation = useUpsertScatter({
    onSuccess: (savedId) => {
      if (!isEditing) {
        navigate(`/scatters/${savedId}`, { replace: true });
      }
    },
  });
  const uploadMutation = useUploadScatterAttachment(id);
  const deleteAttachmentMutation = useDeleteScatterAttachment(id);
  const createScheduleMutation = useCreateScatterSchedule(id);
  const deleteScheduleMutation = useDeleteScatterSchedule(id);
  const suggestCategoriesMutation = useSuggestScatterCategories();

  const [scheduleAt, setScheduleAt] = useState('');
  const [localPreviewFiles, setLocalPreviewFiles] = useState<
    Array<{
      type: ScatterAttachment['type'];
      originalName: string;
      mime: string;
      previewUrl?: string | null;
      file?: File;
    }>
  >([]);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      messageText: '',
      categoryIds: [],
    },
  });

  const watchedText = useWatch({ control, name: 'messageText' });
  const watchedCategories = useWatch({ control, name: 'categoryIds' });

  useEffect(() => {
    if (!scatter) {
      return;
    }
    reset({
      name: scatter.name,
      description: scatter.description ?? '',
      messageText: scatter.messageText ?? '',
      categoryIds: scatter.categories.map((category) => category.id),
    });
  }, [scatter, reset]);

  useEffect(() => {
    return () => {
      localPreviewFiles.forEach((file) => {
        if (file.previewUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, [localPreviewFiles]);

  const previewAttachments = useMemo(() => {
    const remote =
      scatter?.attachments?.map((attachment) => ({
        type: attachment.type,
        originalName: attachment.originalName,
        mime: attachment.mime,
        previewUrl: null as string | null,
      })) ?? [];
    return [...remote, ...localPreviewFiles];
  }, [scatter?.attachments, localPreviewFiles]);

  const onSubmit = handleSubmit(async (values) => {
    if (!canManage) {
      return;
    }
    setFormError(null);

    if (!values.name.trim()) {
      setError('name', { type: 'manual', message: 'Informe o nome do scatter.' });
      return;
    }
    if (!values.messageText.trim() && (scatter?.attachments?.length ?? 0) === 0 && localPreviewFiles.length === 0) {
      setError('messageText', {
        type: 'manual',
        message: 'Informe o texto da mensagem ou anexe um arquivo.',
      });
      return;
    }
    if (!values.categoryIds.length) {
      setError('categoryIds', { type: 'manual', message: 'Selecione ao menos uma categoria.' });
      return;
    }

    try {
      await upsertMutation.mutateAsync({
        id,
        payload: {
          name: values.name.trim(),
          description: values.description.trim() || null,
          messageText: values.messageText.trim() || null,
          categoryIds: values.categoryIds,
        },
      });
    } catch (error) {
      const parsed = parseApiError(error);
      const mapped = applyParsedApiErrorsToForm(parsed, setError, {
        name: 'name',
        description: 'description',
        message_text: 'messageText',
        category_ids: 'categoryIds',
      });
      if (!mapped) {
        setFormError(parsed.message);
      }
    }
  });

  const handleUpload = async (type: ScatterAttachment['type'], fileList: FileList | null) => {
    if (!fileList?.[0] || !canManage) {
      return;
    }
    const file = fileList[0];
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setLocalPreviewFiles((current) => [
      ...current,
      { type, originalName: file.name, mime: file.type, previewUrl, file },
    ]);

    if (!id) {
      setFormError('Salve o scatter antes de enviar anexos.');
      return;
    }

    try {
      await uploadMutation.mutateAsync({ type, file });
      setLocalPreviewFiles([]);
    } catch {
      // toast handled by mutation
    }
  };

  const handleAiSelectCategories = async () => {
    if (!canManage) {
      return;
    }

    setFormError(null);
    const values = getValues();
    const hasRemoteAttachments = (scatter?.attachments?.length ?? 0) > 0;
    const hasLocalAttachments = localPreviewFiles.some((item) => item.type !== 'video');
    const hasText =
      values.messageText.trim() !== '' || values.description.trim() !== '' || values.name.trim() !== '';

    if (!hasText && !hasRemoteAttachments && !hasLocalAttachments) {
      setFormError('Informe texto ou anexos (exceto vídeo) para a IA analisar.');
      return;
    }

    try {
      const clientAttachments = await Promise.all(
        localPreviewFiles
          .filter((item) => item.type !== 'video')
          .map(async (item) => {
            const base = {
              type: item.type as 'image' | 'document' | 'voice',
              originalName: item.originalName,
              mime: item.mime,
            };
            if (item.type === 'image' && item.file) {
              const data = await fileToBase64(item.file);
              return { ...base, data };
            }
            return base;
          }),
      );

      const result = await suggestCategoriesMutation.mutateAsync({
        name: values.name.trim() || null,
        description: values.description.trim() || null,
        messageText: values.messageText.trim() || null,
        scatterId: id,
        clientAttachments,
      });

      if (result.categoryIds.length === 0) {
        setFormError('A IA não encontrou categorias compatíveis com este conteúdo.');
        return;
      }

      setValue('categoryIds', result.categoryIds, { shouldValidate: true, shouldDirty: true });
    } catch (error) {
      const parsed = parseApiError(error);
      setFormError(parsed.message);
    }
  };

  const handleAddSchedule = async () => {
    if (!id || !scheduleAt || !canManage) {
      return;
    }
    const iso = localInputToUtcIso(scheduleAt);
    try {
      await createScheduleMutation.mutateAsync(iso);
      setScheduleAt('');
    } catch {
      // toast handled
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-content sm:text-xl">
            {isEditing ? 'Editar scatter' : 'Novo scatter'}
          </h2>
          <p className="mt-1 text-sm text-content-subtle">
            Monte a mensagem, escolha categorias e programe os envios.
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/scatters')}>
          Voltar
        </Button>
      </div>

      <ResourceState
        isLoading={isEditing && (isLoading || loadingCategorias)}
        isError={isEditing && isError}
        onRetry={() => refetch()}
      >
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="card-surface space-y-4 p-4 sm:p-5">
              <h3 className="text-base font-semibold text-content">Identificação</h3>
              <FormField label="Nome" htmlFor="name" error={errors.name?.message} required>
                <TextInput
                  id="name"
                  hasError={Boolean(errors.name)}
                  disabled={!canManage}
                  {...register('name', { required: 'Informe o nome.' })}
                />
              </FormField>
              <FormField label="Descrição" htmlFor="description" error={errors.description?.message}>
                <TextArea
                  id="description"
                  rows={3}
                  hasError={Boolean(errors.description)}
                  disabled={!canManage}
                  {...register('description')}
                />
              </FormField>
            </section>

            <section className="card-surface space-y-4 p-4 sm:p-5">
              <h3 className="text-base font-semibold text-content">Mensagem</h3>
              <FormField label="Texto" htmlFor="messageText" error={errors.messageText?.message}>
                <TextArea
                  id="messageText"
                  rows={6}
                  hasError={Boolean(errors.messageText)}
                  disabled={!canManage}
                  {...register('messageText')}
                />
              </FormField>

              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ['image', 'Imagem', 'image/*'],
                    ['video', 'Vídeo', 'video/*'],
                    ['document', 'Documento', '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.csv'],
                    ['voice', 'Áudio', 'audio/*'],
                  ] as const
                ).map(([type, label, accept]) => (
                  <label
                    key={type}
                    className="flex cursor-pointer flex-col gap-1 rounded-medium border border-dashed border-border px-3 py-3 text-sm"
                  >
                    <span className="font-medium text-content">{label}</span>
                    <input
                      type="file"
                      accept={accept}
                      disabled={!canManage || uploadMutation.isPending}
                      className="text-xs"
                      onChange={(event) => {
                        void handleUpload(type, event.target.files);
                        event.target.value = '';
                      }}
                    />
                  </label>
                ))}
              </div>

              {scatter?.attachments && scatter.attachments.length > 0 ? (
                <ul className="space-y-2">
                  {scatter.attachments.map((attachment) => (
                    <li
                      key={attachment.id}
                      className="flex items-center justify-between gap-3 rounded-medium border border-border px-3 py-2 text-sm"
                    >
                      <span className="truncate">
                        <Badge variant="subtle" className="mr-2 text-[10px]">
                          {attachment.type}
                        </Badge>
                        {attachment.originalName}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={!canManage}
                        onClick={() => deleteAttachmentMutation.mutate(attachment.id)}
                      >
                        Remover
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section className="card-surface space-y-4 p-4 sm:p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-content">Categorias</h3>
                  <p className="text-sm text-content-subtle">
                    O scatter atinge grupos com relação permitida em pelo menos uma categoria.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={!canManage || suggestCategoriesMutation.isPending}
                    loading={suggestCategoriesMutation.isPending}
                    onClick={() => void handleAiSelectCategories()}
                  >
                    IA Seleciona
                  </Button>
                  {isEditing ? (
                    <p className="text-sm text-content-subtle">
                      Alvos estimados: <strong>{scatter?.groupsCount ?? 0}</strong> grupos /{' '}
                      <strong>{scatter?.membersCount ?? 0}</strong> membros
                    </p>
                  ) : null}
                </div>
              </div>

              <FormField label="Selecionar categorias" error={errors.categoryIds?.message} required>
                <Controller
                  control={control}
                  name="categoryIds"
                  rules={{ validate: (value) => value.length > 0 || 'Selecione ao menos uma categoria.' }}
                  render={({ field }) => (
                    <div className="grid max-h-64 gap-2 overflow-y-auto rounded-medium border border-border p-3 sm:grid-cols-2">
                      {categorias.map((categoria) => {
                        const checked = field.value.includes(categoria.id);
                        return (
                          <Checkbox
                            key={categoria.id}
                            checked={checked}
                            disabled={!canManage}
                            className="items-start"
                            onChange={(event) => {
                              if (event.target.checked) {
                                field.onChange([...field.value, categoria.id]);
                              } else {
                                field.onChange(field.value.filter((item) => item !== categoria.id));
                              }
                            }}
                          >
                            <span>
                              <span className="font-medium text-content">{categoria.name}</span>
                              {categoria.description ? (
                                <span className="block text-xs text-content-subtle">{categoria.description}</span>
                              ) : null}
                            </span>
                          </Checkbox>
                        );
                      })}
                    </div>
                  )}
                />
              </FormField>
              <p className="text-xs text-content-subtle">{watchedCategories?.length ?? 0} categoria(s) selecionada(s)</p>
            </section>

            <section className="card-surface space-y-4 p-4 sm:p-5">
              <h3 className="text-base font-semibold text-content">Cronograma</h3>
              {!isEditing ? (
                <p className="text-sm text-content-subtle">Salve o scatter para adicionar horários de envio.</p>
              ) : (
                <>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <FormField label="Data e hora" htmlFor="scheduleAt" className="flex-1">
                      <TextInput
                        id="scheduleAt"
                        type="datetime-local"
                        value={scheduleAt}
                        disabled={!canManage}
                        onChange={(event) => setScheduleAt(event.target.value)}
                      />
                    </FormField>
                    <Button
                      type="button"
                      disabled={!canManage || !scheduleAt || createScheduleMutation.isPending}
                      onClick={() => void handleAddSchedule()}
                    >
                      Adicionar envio
                    </Button>
                  </div>

                  <ul className="space-y-2">
                    {(scatter?.schedules ?? []).map((schedule) => (
                      <li
                        key={schedule.id}
                        className="flex flex-col gap-2 rounded-medium border border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-content">
                            {formatLocalDateTime(schedule.scheduledAt)}
                          </p>
                          <p className="text-xs text-content-subtle">
                            {statusLabel(schedule.status)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/scatters/${id}/schedules/${schedule.id}`)}
                          >
                            Estatísticas
                          </Button>
                          {schedule.status === 'pending' ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={!canManage}
                              onClick={() => deleteScheduleMutation.mutate(schedule.id)}
                            >
                              Remover
                            </Button>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={!canManage || upsertMutation.isPending} loading={upsertMutation.isPending}>
                Salvar scatter
              </Button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-4 lg:self-start">
            <WhatsAppMessagePreview text={watchedText} attachments={previewAttachments} />
          </aside>
        </form>
      </ResourceState>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Falha ao ler arquivo.'));
        return;
      }
      const commaIndex = result.indexOf(',');
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Falha ao ler arquivo.'));
    reader.readAsDataURL(file);
  });
}
