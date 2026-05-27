import React from 'react';
import { cn } from '@/lib/utils';
import type { FormFieldProps } from './types';

/**
 * FormField — Lightweight wrapper providing consistent label + messaging layout
 * for any form control (Input, Select, Checkbox, custom fields, etc).
 *
 * Keeps visual language identical to the enhanced Input component.
 * Use when you want label/hint/error without duplicating the markup.
 *
 * Example:
 *   <FormField label="COUNTRY" hint="Used for server recommendations">
 *     <Select ... />
 *   </FormField>
 *
 *   <FormField label="ENABLE FEATURE">
 *     <Checkbox ... />
 *   </FormField>
 */
export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, hint, error, children, id, className, hideLabel = false }, ref) => {
    const generatedId = React.useId();
    const fieldId = id || generatedId;
    const hasMessage = !!(hint || error);

    // Associate label with first focusable child if id provided (best-effort for native controls)
    const labeledChildren = React.Children.map(children, (child, index) => {
      if (index === 0 && React.isValidElement(child) && label && !hideLabel) {
        // Only inject htmlFor/id relationship on the first element if it accepts them
        const childProps = child.props as Record<string, unknown>;
        const childType = (child as { type?: string | React.ComponentType }).type;
        const typeStr = typeof childType === 'string' ? childType : undefined;
        if (!childProps.id && (typeStr === 'input' || typeStr === 'select' || typeStr === 'textarea')) {
          return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, { id: fieldId });
        }
      }
      return child;
    });

    return (
      <div ref={ref} className={cn('w-full', className)}>
        {label && (
          <label
            htmlFor={!hideLabel ? fieldId : undefined}
            className={cn(
              'text-xs tracking-widest text-[#64748B] mb-2 pl-1 block cursor-text',
              hideLabel && 'sr-only'
            )}
          >
            {label}
          </label>
        )}

        <div>
          {labeledChildren ?? children}
        </div>

        {hasMessage && (
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

FormField.displayName = 'FormField';