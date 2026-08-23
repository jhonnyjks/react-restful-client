import { useEffect, useMemo, useState } from 'react';
import type { ScatterAttachment } from '@/services/api/types';
import { extractFirstUrl, fetchLinkPreview, type LinkPreview } from '@/services/api/linkPreview';

type PreviewAttachment = Pick<ScatterAttachment, 'type' | 'originalName' | 'mime'> & {
  previewUrl?: string | null;
};

type WhatsAppMessagePreviewProps = {
  text?: string | null;
  attachments?: PreviewAttachment[];
};

function renderTextWithLinks(text: string) {
  const parts = text.split(/(https?:\/\/[^\s<>"']+)/gi);
  return parts.map((part, index) => {
    if (/^https?:\/\//i.test(part)) {
      const cleaned = part.replace(/[),.]+$/g, '');
      return (
        <span key={`${cleaned}-${index}`} className="text-[#53BDEB] underline-offset-2">
          {cleaned}
        </span>
      );
    }
    return <span key={`t-${index}`}>{part}</span>;
  });
}

export function WhatsAppMessagePreview({ text, attachments = [] }: WhatsAppMessagePreviewProps) {
  const hasContent = Boolean((text && text.trim()) || attachments.length > 0);
  const firstUrl = useMemo(() => (text ? extractFirstUrl(text) : null), [text]);
  const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);

  useEffect(() => {
    if (!firstUrl) {
      setLinkPreview(null);
      setLinkLoading(false);
      return;
    }

    let cancelled = false;
    setLinkLoading(true);
    const timer = window.setTimeout(() => {
      void fetchLinkPreview(firstUrl)
        .then((preview) => {
          if (!cancelled) {
            setLinkPreview(preview);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setLinkPreview({
              url: firstUrl,
              domain: (() => {
                try {
                  return new URL(firstUrl).hostname.replace(/^www\./, '');
                } catch {
                  return firstUrl;
                }
              })(),
              title: null,
              description: null,
              image: null,
            });
          }
        })
        .finally(() => {
          if (!cancelled) {
            setLinkLoading(false);
          }
        });
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [firstUrl]);

  const showLinkCard = Boolean(firstUrl && (linkPreview || linkLoading));

  return (
    <div className="mx-auto w-full max-w-[320px]">
      <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900 shadow-xl">
        <div className="bg-[#075E54] px-4 py-3 text-white">
          <p className="text-xs uppercase tracking-wide text-emerald-100/80">Prévia WhatsApp</p>
          <p className="text-sm font-semibold">Grupo alvo</p>
        </div>
        <div
          className="min-h-[420px] bg-[#0B141A] px-3 py-4"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.03) 0, transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.04) 0, transparent 35%)',
          }}
        >
          {!hasContent ? (
            <p className="rounded-lg bg-[#202C33] px-3 py-2 text-sm text-slate-400">
              Digite a mensagem ou adicione um arquivo para pré-visualizar.
            </p>
          ) : (
            <div className="ml-auto max-w-[92%] space-y-1">
              {attachments.map((attachment, index) => (
                <div
                  key={`${attachment.originalName}-${index}`}
                  className="overflow-hidden rounded-lg rounded-tr-sm bg-[#005C4B] text-white shadow"
                >
                  {attachment.type === 'image' && attachment.previewUrl ? (
                    <img
                      src={attachment.previewUrl}
                      alt={attachment.originalName}
                      className="max-h-48 w-full object-cover"
                    />
                  ) : null}
                  {attachment.type === 'video' ? (
                    <div className="flex h-28 items-center justify-center bg-black/30 text-sm">
                      Vídeo · {attachment.originalName}
                    </div>
                  ) : null}
                  {attachment.type === 'document' ? (
                    <div className="flex items-center gap-2 px-3 py-2 text-sm">
                      <span className="rounded bg-white/10 px-2 py-1 text-xs">DOC</span>
                      <span className="truncate">{attachment.originalName}</span>
                    </div>
                  ) : null}
                  {attachment.type === 'voice' ? (
                    <div className="flex items-center gap-2 px-3 py-2 text-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-300" />
                      Áudio · {attachment.originalName}
                    </div>
                  ) : null}
                  {attachment.type === 'image' && !attachment.previewUrl ? (
                    <div className="px-3 py-2 text-sm">Imagem · {attachment.originalName}</div>
                  ) : null}
                </div>
              ))}

              {(text && text.trim()) || showLinkCard ? (
                <div className="overflow-hidden rounded-lg rounded-tr-sm bg-[#005C4B] text-white shadow">
                  {showLinkCard ? (
                    <div className="bg-[#025144]">
                      {linkLoading && !linkPreview?.image ? (
                        <div className="flex h-36 items-center justify-center bg-black/20 text-xs text-emerald-100/70">
                          Carregando prévia do link…
                        </div>
                      ) : null}
                      {linkPreview?.image ? (
                        <img
                          src={linkPreview.image}
                          alt={linkPreview.title ?? 'Prévia do link'}
                          className="max-h-44 w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                      <div className="space-y-1 border-l-[3px] border-[#1FA855] bg-black/15 px-3 py-2">
                        {linkPreview?.title ? (
                          <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">
                            {linkPreview.title}
                          </p>
                        ) : linkLoading ? (
                          <p className="h-4 w-[80%] animate-pulse rounded bg-white/10" />
                        ) : null}
                        {linkPreview?.description ? (
                          <p className="line-clamp-2 text-[12px] leading-snug text-emerald-50/80">
                            {linkPreview.description}
                          </p>
                        ) : null}
                        <p className="truncate text-[11px] uppercase tracking-wide text-emerald-100/55">
                          {linkPreview?.domain ?? ''}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {text && text.trim() ? (
                    <div className="px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap">
                      {renderTextWithLinks(text)}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <p className="pr-1 text-right text-[10px] text-emerald-100/70">agora</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
