import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConnectionStatus } from './types';

export interface VPNOrbProps {
  /** Current connection status. Directly maps to Figma Elements/VPN states. */
  status: ConnectionStatus;
  /** Diameter of the orb in pixels (default 260 matches current hero size). */
  size?: number;
  /** Called when the user taps the orb (if not disabled). */
  onToggle?: () => void;
  /** Disable interactions (e.g. during certain states). */
  disabled?: boolean;
  /** Optional custom labels for each state. Falls back to beautiful defaults. */
  labels?: {
    idle?: React.ReactNode;
    connecting?: React.ReactNode;
    connected?: React.ReactNode;
  };
  /** Accessibility label */
  'aria-label'?: string;
}

/**
 * VPNOrb — The Hero Element of Aether.
 *
 * This is the single most important and memorable interaction in the entire product.
 * Extracted from Home.tsx while preserving 100% of the obsessive craft:
 * - Multi-layer glows and gradient ring
 * - Spring-powered scale and pulse animations
 * - Rotating data ring when connected
 * - State-driven text with AnimatePresence
 * - Perfect tap feedback
 *
 * Figma Alignment:
 * - Maps to Elements/VPN component set (Disconnected / Connecting / Connected)
 * - Designed to be visually and emotionally superior to the reference.
 *
 * Usage in Home:
 *   <VPNOrb
 *     status={isConnecting ? 'connecting' : isConnected ? 'connected' : 'idle'}
 *     onToggle={handleToggle}
 *     disabled={isConnecting}
 *   />
 */
export const VPNOrb = React.forwardRef<HTMLButtonElement, VPNOrbProps>(
  (
    {
      status,
      size = 260,
      onToggle,
      disabled,
      labels,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const isConnected = status === 'connected';
    const isConnecting = status === 'connecting';

    const defaultLabels = {
      idle: 'TAP TO CONNECT',
      connecting: 'CONNECTING...',
      connected: 'PROTECTED',
    };

    const currentLabel =
      labels?.[status] ??
      defaultLabels[status as keyof typeof defaultLabels] ??
      defaultLabels.idle;

    const colorClass = isConnected
      ? 'text-[#22D3EE]'
      : isConnecting
      ? 'text-[#22D3EE]'
      : 'text-[var(--text-secondary)]';

    const scaleClass = isConnected ? 'scale-110' : 'scale-100';

    return (
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Outer subtle glow rings (exact match to current design) */}
        <div className="absolute inset-0 rounded-full border border-white/5" />
        <div className="absolute inset-[18px] rounded-full border border-white/5" />

        <motion.button
          ref={ref}
          onClick={onToggle}
          disabled={disabled}
          whileTap={{ scale: 0.96 }}
          aria-label={ariaLabel || 'Toggle VPN connection'}
          className={cn(
            'orb w-full h-full flex flex-col items-center justify-center cursor-pointer disabled:cursor-default',
            isConnected && 'connected orb-pulse',
            disabled && 'opacity-70'
          )}
        >
          <div className={cn('transition-all duration-500', scaleClass)}>
            <Power
              size={Math.round(Number(size) * 0.26)} // ~68px at 260
              strokeWidth={1.5}
              className={cn('transition-colors', colorClass)}
            />
          </div>

          <div className="mt-4 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'font-medium tracking-wider text-sm',
                  isConnected
                    ? 'text-emerald-400 tracking-[1.5px]'
                    : isConnecting
                    ? 'text-[#22D3EE]'
                    : 'text-[var(--text-secondary)] tracking-[1.5px]'
                )}
              >
                {currentLabel}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.button>

        {/* Subtle rotating data ring — only when connected */}
        {isConnected && (
          <motion.div
            className="absolute inset-0 rounded-full border border-[#22D3EE]/30 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>
    );
  }
);

VPNOrb.displayName = 'VPNOrb';
