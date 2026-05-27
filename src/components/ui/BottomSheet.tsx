import React, { useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';
import type { BottomSheetHeight, BaseOverlayProps } from './types';

export interface BottomSheetProps extends BaseOverlayProps {
  /** Controls maximum height of the sheet. Default: 'auto' (content-driven, capped at 85vh). */
  height?: BottomSheetHeight;
  /** Whether to render the iOS-style drag handle at the top. Default: true */
  showDragHandle?: boolean;
}

const FOCUSABLE_SELECTOR =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)) as HTMLElement[];
}

/**
 * BottomSheet — Production-ready slide-up sheet for Aether (mobile-first).
 *
 * Perfect for:
 * - Server pickers, filters, confirmation actions
 * - Settings adjustments, share flows
 * - Any content that feels natural coming from the bottom
 *
 * Features:
 * - Smooth slide-up + fade using spring physics consistent with Aether
 * - Optional native-feeling drag-to-dismiss (vertical drag + velocity threshold)
 * - Beautiful glass surface + rounded top corners
 * - Full focus trap + ESC + focus return + scroll lock (same a11y as Modal)
 * - Drag handle affordance (purely visual by default, functional when dragged)
 * - Three height presets for predictable layouts
 * - Portal + high z-index safe for app shell nav
 *
 * Figma Alignment:
 * - Matches bottom sheet / action sheet patterns in modern VPN and productivity apps.
 * - Uses identical glass, blur, spring, and border tokens as the rest of the library.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <BottomSheet open={open} onClose={() => setOpen(false)} title="Select Server" height="half">
 *     <div className="space-y-2">...list of servers...</div>
 *   </BottomSheet>
 */
export const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      closeOnOverlayClick = true,
      closeOnEsc = true,
      showCloseButton = true,
      className,
      contentClassName,
      children,
      height = 'auto',
      showDragHandle = true,
    },
    ref
  ) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const descId = useId();
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Height presets (mobile-first, safe area aware)
    const heightClasses: Record<BottomSheetHeight, string> = {
      auto: 'max-h-[85dvh]',
      half: 'h-[50dvh] max-h-[50dvh]',
      full: 'h-[92dvh] max-h-[92dvh]',
    };

    // Shared focus trap + keyboard + scroll lock (identical philosophy to Modal)
    useEffect(() => {
      if (!open) return;

      previousFocusRef.current = document.activeElement as HTMLElement | null;

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEsc) {
          e.preventDefault();
          onClose();
          return;
        }

        if (e.key === 'Tab') {
          const focusables = getFocusableElements(contentRef.current);
          if (focusables.length === 0) return;

          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const activeEl = document.activeElement;

          if (e.shiftKey) {
            if (activeEl === first || !contentRef.current?.contains(activeEl)) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (activeEl === last || !contentRef.current?.contains(activeEl)) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown, true);

      const focusTimer = window.setTimeout(() => {
        const focusables = getFocusableElements(contentRef.current);
        if (focusables.length > 0) {
          focusables[0].focus();
        } else if (contentRef.current) {
          contentRef.current.focus();
        }
      }, 60);

      return () => {
        window.clearTimeout(focusTimer);
        document.removeEventListener('keydown', handleKeyDown, true);
        document.body.style.overflow = originalOverflow;

        const toReturn = previousFocusRef.current;
        if (toReturn && typeof toReturn.focus === 'function') {
          window.setTimeout(() => {
            try {
              toReturn.focus();
            } catch {
              /* no-op */
            }
          }, 20);
        }
      };
    }, [open, onClose, closeOnEsc]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    const handleClose = () => onClose();

    // Drag-to-dismiss handler (framer-motion)
    const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      // Dismiss if dragged down significantly OR with strong downward velocity
      const shouldClose = info.offset.y > 120 || info.velocity.y > 600;
      if (shouldClose) {
        onClose();
      }
    };

    const sheetElement = (
      <AnimatePresence>
        {open && (
          <div
            className={cn(
              'fixed inset-0 z-[100] flex items-end justify-center',
              className
            )}
            role="presentation"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={handleBackdropClick}
              aria-hidden="true"
            />

            {/* Sheet panel — draggable on Y axis */}
            <motion.div
              ref={(node) => {
                (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
                }
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              aria-describedby={description ? descId : undefined}
              tabIndex={-1}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.18}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              className={cn(
                'relative w-full touch-pan-y outline-none',
                heightClasses[height]
              )}
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{
                type: 'spring',
                damping: 28,
                stiffness: 260,
                mass: 0.9,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard
                variant="strong"
                padding="none"
                className={cn(
                  'relative flex h-full flex-col overflow-hidden rounded-t-3xl',
                  // Stronger top shadow for the sheet "lift" feeling
                  'shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)]',
                  contentClassName
                )}
              >
                {/* Drag handle + optional header */}
                <div className="flex flex-col">
                  {/* iOS-style drag indicator */}
                  {showDragHandle && (
                    <div className="flex justify-center pt-3 pb-1">
                      <div className="h-1.5 w-11 rounded-full bg-white/20" />
                    </div>
                  )}

                  {/* Title row */}
                  {(title || showCloseButton) && (
                    <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 pb-4 pt-2">
                      {title ? (
                        <h2
                          id={titleId}
                          className="font-semibold text-[17px] tracking-[-0.25px] text-[var(--text-primary)]"
                        >
                          {title}
                        </h2>
                      ) : (
                        <div />
                      )}

                      {showCloseButton && (
                        <button
                          type="button"
                          onClick={handleClose}
                          aria-label="Close sheet"
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)] active:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]"
                        >
                          <X size={18} strokeWidth={2.75} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* a11y description */}
                {description && (
                  <p id={descId} className="sr-only">
                    {description}
                  </p>
                )}

                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 text-[15px] leading-[1.65] text-[var(--text-primary)]">
                  {children}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );

    return createPortal(sheetElement, document.body);
  }
);

BottomSheet.displayName = 'BottomSheet';
