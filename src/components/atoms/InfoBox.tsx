import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type InfoBoxVariant = 'info' | 'success' | 'warning' | 'error';

type InfoBoxProps = {
  title: string;
  description?: string | ReactNode;
  variant?: InfoBoxVariant;
  className?: string;
};

const variantStyles: Record<InfoBoxVariant, string> = {
  info: 'border-primary-200 bg-primary-50 text-primary-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
};

const descriptionStyles: Record<InfoBoxVariant, string> = {
  info: 'text-primary-700',
  success: 'text-emerald-700',
  warning: 'text-amber-700',
  error: 'text-rose-700',
};

/**
 * InfoBox - Componente Atom para exibir mensagens informativas
 * 
 * Segue o padrão Atomic Design e o sistema de design do projeto.
 * Usado para exibir informações, avisos, sucessos ou erros de forma consistente.
 * 
 * @example
 * ```tsx
 * <InfoBox
 *   title="Informe seu e-mail"
 *   description="Verificaremos se você já possui cadastro para continuar."
 *   variant="info"
 * />
 * ```
 */
export function InfoBox({ title, description, variant = 'info', className }: InfoBoxProps) {
  return (
    <div
      className={cn(
        'rounded-medium border p-4 text-sm',
        variantStyles[variant],
        className,
      )}
    >
      <p className="font-medium">{title}</p>
      {description && (
        <div className={cn('mt-1 text-xs', descriptionStyles[variant])}>
          {description}
        </div>
      )}
    </div>
  );
}

