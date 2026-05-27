import React from 'react';
import { cn } from '@/lib/utils';
import type { InputProps } from './types';

/**
 * Input — Enhanced form input primitive for Aether supporting the advanced Figma Input matrix.
 *
 * Covers the core matrix from Levin VPN UI Kit:
 * - Types: email, password, tel (phone), text, search, number, code
 * - Variants: default (elevated glass) + filled (muted surface)
 * - States: Default, Active (focus), Error + prefix support for Phone
 *
 * Features:
 * - leftIcon (absolute) + rightElement (toggles etc)
 * - prefix: static content for phone prefixes ("+1", "+44")
 * - label (associated <label>), hint, error with design system colors
 * - Fully forwards native input props (type, value, onChange, autoComplete...)
 *
 * Practical examples for advanced use:
 *   <Input label="PHONE NUMBER" prefix="+1" type="tel" placeholder="(555) 123-4567" />
 *   <Input variant="filled" label="DISCOUNT CODE" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      leftIcon,
      rightElement,
      hint,
      error,
      containerClassName,
      className,
      id,
      variant = 'default',
      prefix,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const hasRightContent = !!rightElement;
    const hasPrefix = !!prefix;
    const hasLeftAdornment = !!(leftIcon || hasPrefix);

    // Variant styles — filled is a practical "subdued" treatment for secondary fields
    const variantClasses = variant === 'filled'
      ? 'bg-[#0A0D12] border-white/5 focus:border-white/20'
      : '';

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-xs tracking-widest text-[#64748B] mb-2 pl-1 block cursor-text">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {hasPrefix && (
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748B] text-sm font-medium pointer-events-none select-none z-10">
              {prefix}
            </div>
          )}

          {leftIcon && (
            <div className={cn(
              "absolute text-[#64748B] pointer-events-none z-10",
              hasPrefix ? "left-[3.25rem]" : "left-5 top-4"
            )}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input',
              hasLeftAdornment && (hasPrefix ? 'pl-[3.75rem]' : 'pl-12'),
              hasRightContent && 'pr-12',
              error && 'border-[#EF4444]/60 focus:border-[#EF4444] focus:ring-[#EF4444]/10',
              variantClasses,
              className
            )}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-5 top-4 text-tertiary z-10">
              {rightElement}
            </div>
          )}
        </div>

        {(hint || error) && (
          <div className={cn(
            'text-[10px] mt-1.5 pl-1',
            error ? 'text-[#EF4444]' : 'text-secondary'
          )}>
            {error || hint}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
