import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ButtonVariant, ButtonSize } from './types';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant. Matches the existing premium button system. */
  variant?: ButtonVariant;
  /** Size preset. Covers all current usage patterns in the app. */
  size?: ButtonSize;
  /** Shows loading spinner and disables interactions. */
  loading?: boolean;
  /** Icon rendered before the label. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode;
  /** Makes the button take full width of its container. */
  fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-14 px-6 text-base',
  xl: 'h-[58px] px-6 text-[15px]',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

/**
 * Button — Core interactive primitive for Aether.
 *
 * Replaces all manual "btn btn-primary", "btn btn-secondary", "btn btn-ghost" usage.
 *
 * Figma Alignment:
 * - Directly supports the Button component from Levin VPN UI Kit.
 * - Primary uses the signature electric cyan-blue gradient.
 * - Preserves exact micro-interactions (active:scale-[0.985], hover lifts, transitions).
 *
 * Phase 1 scope: All current visual and behavioral fidelity + loading state.
 * Future: Icon-only variant, asChild composition, more Figma sizes/states.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'lg',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={cn(
          // Base button styles from design system
          'btn',
          variantClasses[variant],
          // Size
          sizeClasses[size],
          // Width
          fullWidth && 'w-full',
          // Loading state
          loading && 'cursor-wait',
          // Disabled
          isDisabled && 'opacity-60 pointer-events-none',
          // Extra safety for icon + text alignment when using justify-start (social buttons etc.)
          'inline-flex items-center justify-center gap-2',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>
        )}

        <span className={loading ? 'opacity-70' : ''}>{children}</span>

        {!loading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
