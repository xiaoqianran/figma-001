import React from 'react';
import { cn } from '@/lib/utils';
import type { GlassVariant, GlassPadding } from './types';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual strength of the glass effect. Defaults to "default". */
  variant?: GlassVariant;
  /** Adds hover/active lift and scale transforms (great for interactive cards). */
  interactive?: boolean;
  /** Consistent inner padding. Maps to common usage patterns in the app. */
  padding?: GlassPadding;
  /** Optional subtle border accent (e.g. when representing active/selected state). */
  accent?: boolean;
}

/**
 * GlassCard — Foundational surface primitive for Aether's signature glassmorphism.
 *
 * Replaces dozens of repeated `glass rounded-3xl p-...` patterns across the app.
 *
 * Figma Alignment:
 * - Matches the elevated glass surfaces used throughout the Levin VPN UI Kit
 *   (cards, modals, list items, stats blocks).
 * - Preserves the exact backdrop-blur + border aesthetic defined in index.css.
 *
 * Phase 1 Note: This is intentionally simple. More sophisticated variants
 * (e.g., with header/footer slots, different radii) can be added later.
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = 'default',
      interactive = false,
      padding = 'md',
      accent = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const paddingClasses: Record<GlassPadding, string> = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    };

    // Accessibility: make interactive cards keyboard-navigable (quick a11y enhancement)
    const htmlProps = props as React.HTMLAttributes<HTMLDivElement>;
    const isInteractiveClickable = interactive && !!htmlProps.onClick;
    const a11yProps = isInteractiveClickable ? {
      role: 'button',
      tabIndex: 0,
      onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          htmlProps.onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      },
      'aria-label': htmlProps['aria-label'],
    } : {};

    return (
      <div
        ref={ref}
        className={cn(
          // Base glass
          variant === 'strong' ? 'glass-strong' : 'glass',
          // Consistent large radius used throughout Aether
          'rounded-3xl',
          // Padding
          paddingClasses[padding],
          // Interactive affordances (matches existing server-card, profile rows, etc.)
          interactive && [
            'transition-all duration-200',
            'active:scale-[0.985]',
            'hover:border-[color:var(--border-strong)]',
            'hover:-translate-y-px',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]',
          ],
          // Optional active/selected accent ring (used in Locations for current server)
          accent && 'border-[var(--accent)]/60 shadow-[0_0_0_1px_var(--accent)]',
          className
        )}
        {...a11yProps}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
