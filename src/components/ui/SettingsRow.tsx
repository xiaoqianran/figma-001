import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { SettingsRowProps } from './types';

/**
 * SettingsRow — Reusable row for settings lists, profile menus, and navigation hubs.
 *
 * Extracted/refined from duplicated inline patterns in Profile.tsx and similar hubs.
 * Follows Phase 1 component conventions exactly (JSDoc, cn, forwardRef, clean props).
 *
 * @example
 *   // With Toggle on the right
 *   <SettingsRow 
 *     icon={Bell} 
 *     title="Notifications" 
 *     subtitle="Alerts & updates"
 *     rightElement={<Toggle checked={notif} onCheckedChange={setNotif} />} 
 *   />
 *
 *   // Navigation with status badge
 *   <SettingsRow 
 *     icon={Shield} 
 *     title="Kill Switch" 
 *     to="/app/settings/kill-switch"
 *     status={vpnSettings.killSwitch ? 'on' : 'off'} 
 *   />
 *
 * Figma Alignment: Matches settings row / list item visual language from Levin VPN UI Kit.
 */
export const SettingsRow = React.forwardRef<HTMLButtonElement, SettingsRowProps>(
  (
    {
      icon: Icon,
      title,
      subtitle,
      rightElement,
      showChevron = true,
      to,
      status,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const navigate = useNavigate();

    // Robust icon handling: supports lucide-react (forwardRef), regular components, and raw React elements
    const iconNode = React.isValidElement(Icon) 
      ? Icon 
      : Icon 
        ? React.createElement(Icon as React.ElementType, { size: 18 }) 
        : null;

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (to) {
        navigate(to);
      }
      onClick?.(e);
    };

    // Build right side: status badge (if provided) + rightElement or chevron
    const statusBadge = status ? (
      <div className={`status-badge ${status === 'on' ? 'on' : 'off'}`}>
        {status.toUpperCase()}
      </div>
    ) : null;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          // Matches the exact glass row pattern used in Profile and refined across app
          'glass w-full flex items-center justify-between rounded-3xl px-5 py-4 active:scale-[0.985] transition text-left',
          'focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-subtle icon-container flex items-center justify-center flex-shrink-0">
            {iconNode}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-[15px] tracking-[-0.1px]">{title}</div>
            {subtitle && (
              <div className="text-xs text-secondary mt-0.5 leading-tight pr-2">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0 ml-2">
          {rightElement ? (
            rightElement
          ) : (
            <>
              {statusBadge}
              {showChevron && <ChevronRight className="text-tertiary" size={18} />}
            </>
          )}
        </div>
      </button>
    );
  }
);

SettingsRow.displayName = 'SettingsRow';

