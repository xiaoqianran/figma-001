import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SelectProps } from './types';

/**
 * Select — Styled native select dropdown matching Aether Input visual language.
 *
 * Practical reusable primitive for forms (server picker, protocol choice, country, etc).
 * Uses the exact same label / hint / error / container treatment as the enhanced Input.
 *
 * - Supports `options` array (recommended) OR standard <option> children for full control.
 * - Right chevron indicator (non-interactive).
 * - Full native keyboard + form semantics preserved.
 *
 * Figma alignment: Matches Dropdown / Select patterns from the Levin design system.
 *
 * Example:
 *   <Select
 *     label="PROTOCOL"
 *     options={[
 *       { value: 'wireguard', label: 'WireGuard' },
 *       { value: 'openvpn', label: 'OpenVPN' },
 *     ]}
 *     value={protocol}
 *     onChange={(e) => setProtocol(e.target.value)}
 *   />
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      containerClassName,
      className,
      options,
      placeholder,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label htmlFor={selectId} className="text-xs tracking-widest text-[#64748B] mb-2 pl-1 block cursor-text">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'input appearance-none pr-10 cursor-pointer',
              error && 'border-[#EF4444]/60 focus:border-[#EF4444] focus:ring-[#EF4444]/10',
              className
            )}
            {...props}
          >
            {placeholder && !props.value && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
            {children}
          </select>

          {/* Consistent chevron indicator (matches rightElement treatment) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none">
            <ChevronDown size={16} />
          </div>
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

Select.displayName = 'Select';