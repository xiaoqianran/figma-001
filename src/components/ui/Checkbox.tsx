import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CheckboxProps } from './types';

/**
 * Checkbox — Simple, fully accessible checkbox component.
 *
 * Visual language: subtle glass track + crisp white check on accent gradient when active.
 * Replaces ad-hoc checkbox implementations (e.g. the one in Security.tsx).
 *
 * Supports label + description for richer settings rows.
 *
 * Example:
 *   <Checkbox
 *     checked={agree}
 *     onCheckedChange={setAgree}
 *     label="I agree to the Terms"
 *     description="You can revoke consent at any time in Settings."
 *   />
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      onCheckedChange,
      label,
      description,
      disabled,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'group flex items-start gap-3 cursor-pointer select-none',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          {/* Custom visual box — matches Aether glass + accent language */}
          <div
            className={cn(
              'w-5 h-5 rounded-md border transition-all duration-150 flex items-center justify-center',
              'border-[var(--border-strong)] bg-[var(--bg-elevated)]',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-[#3B82F6]/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--bg-base)]',
              checked && 'border-[#3B82F6] bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] shadow-sm',
              disabled && 'opacity-60'
            )}
          >
            {checked && (
              <Check size={13} className="text-white" strokeWidth={3.5} />
            )}
          </div>
        </div>

        {(label || description) && (
          <div className="min-w-0 pt-px">
            {label && (
              <div className="text-sm font-medium text-[var(--text-primary)] group-active:text-[var(--text-secondary)]">
                {label}
              </div>
            )}
            {description && (
              <div className="text-[11px] leading-snug text-secondary mt-0.5 pr-1">
                {description}
              </div>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';