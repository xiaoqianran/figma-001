import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ToggleProps, ToggleSize } from './types';

const sizeConfig: Record<ToggleSize, { track: string; thumb: string; translate: string }> = {
  sm: { track: 'w-9 h-5', thumb: 'w-4 h-4', translate: 'translate-x-4' },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
};

/**
 * Toggle — Premium switch control for Aether settings and preferences.
 *
 * Delivers the exact Figma Toggle component experience:
 * - Smooth spring-powered thumb animation (Framer Motion)
 * - Glassmorphic dark track with electric accent when active
 * - Subtle inner shadow + crisp white thumb
 * - Full keyboard + ARIA support (role="switch")
 * - Works beautifully inside GlassCard rows (Profile/Settings patterns)
 *
 * @example
 *   <Toggle checked={enabled} onCheckedChange={setEnabled} size="md" />
 *   <Toggle checked={true} onCheckedChange={setEnabled} label="Kill Switch" size="lg" />
 */
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked = false,
      onCheckedChange,
      size = 'md',
      label,
      disabled,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const cfg = sizeConfig[size];
    const isOn = checked;

    const handleClick = () => {
      if (!disabled) {
        onCheckedChange?.(!isOn);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault();
        onCheckedChange?.(!isOn);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label={ariaLabel || label}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'group inline-flex items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/60 transition-opacity',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {/* The switch track + animated thumb */}
        <div
          className={cn(
            'relative flex items-center rounded-full transition-all duration-200 ease-out',
            cfg.track,
            isOn
              ? 'bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] shadow-[0_0_0_1px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]'
              : 'bg-[var(--bg-elevated)] border border-[var(--border-strong)]'
          )}
        >
          <motion.div
            className={cn(
              'absolute top-0.5 left-0.5 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.1)]',
              cfg.thumb
            )}
            animate={{
              x: isOn ? (size === 'sm' ? 16 : size === 'md' ? 20 : 28) : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              mass: 0.8,
            }}
          />
        </div>

        {/* Optional label (right side) */}
        {label && (
          <span className="text-sm font-medium text-[var(--text-primary)] select-none group-active:text-[var(--text-secondary)]">
            {label}
          </span>
        )}
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';
