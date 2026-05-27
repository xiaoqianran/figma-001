import React from 'react';
import { cn } from '@/lib/utils';
import type { RadioGroupProps, RadioOption } from './types';

/**
 * RadioGroup — Simple controlled radio button group.
 *
 * Delivers clean Aether-styled radios (glass circle + accent fill when selected).
 * Designed to complete the atomic form control set alongside Checkbox + Toggle + Select + Input.
 *
 * Fully native under the hood (great for forms, keyboard nav, screen readers).
 *
 * Example:
 *   <RadioGroup
 *     label="PREFERRED PROTOCOL"
 *     options={[
 *       { value: 'wg', label: 'WireGuard (recommended)', description: 'Fastest & modern' },
 *       { value: 'ovpn', label: 'OpenVPN' },
 *     ]}
 *     value={protocol}
 *     onValueChange={setProtocol}
 *   />
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(({
  value,
  onValueChange,
  options,
  label,
  hint,
  error,
  className,
  name: providedName,
  orientation = 'vertical',
}, _ref) => {
  const generatedName = React.useId();
  const groupName = providedName || generatedName;
  const hasMessage = !!(hint || error);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="text-xs tracking-widest text-[#64748B] mb-3 pl-1">
          {label}
        </div>
      )}

      <div
        role="radiogroup"
        className={cn(
          'space-y-2',
          orientation === 'horizontal' && 'flex flex-wrap gap-x-6 gap-y-2 space-y-0'
        )}
      >
        {options.map((option: RadioOption) => {
          const isSelected = value === option.value;
          const radioId = `${groupName}-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={radioId}
              className={cn(
                'group flex items-start gap-3 cursor-pointer select-none',
                option.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="radio"
                  id={radioId}
                  name={groupName}
                  value={option.value}
                  checked={isSelected}
                  onChange={(e) => {
                    if (!option.disabled) onValueChange?.(e.target.value);
                  }}
                  disabled={option.disabled}
                  className="sr-only peer"
                />
                {/* Custom radio visual — circle + inner dot on select */}
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 transition-all duration-150 flex items-center justify-center',
                    'border-[var(--border-strong)] bg-[var(--bg-elevated)]',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-[#3B82F6]/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--bg-base)]',
                    isSelected && 'border-[#3B82F6]',
                    option.disabled && 'opacity-60'
                  )}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#22D3EE]" />
                  )}
                </div>
              </div>

              <div className="min-w-0 pt-px">
                <div className="text-sm font-medium text-[var(--text-primary)] group-active:text-[var(--text-secondary)]">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-[11px] leading-snug text-secondary mt-0.5 pr-1">
                    {option.description}
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {hasMessage && (
        <div className={cn(
          'text-[10px] mt-2 pl-1',
          error ? 'text-[#EF4444]' : 'text-secondary'
        )}>
          {error || hint}
        </div>
      )}
    </div>
  );
});

RadioGroup.displayName = 'RadioGroup';