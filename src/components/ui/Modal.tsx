import React, { useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';
import type { ModalSize, BaseOverlayProps } from './types';

export interface ModalProps extends BaseOverlayProps {
  /** Visual size of the modal. Default: 'md' */
  size?: ModalSize;
}

const FOCUSABLE_SELECTOR =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)) as HTMLElement[];
}

/**
 * Modal — Production-ready centered dialog overlay for Aether.
 *
 * Features:
 * - Beautiful spring-powered fade + scale entrance/exit (matches Aether motion language)
 * - Full glassmorphism using existing .glass-strong + design tokens
 * - Complete accessibility: focus trap, ESC key, aria roles/labels, focus return on close
 * - Body scroll lock while open
 * - Close on backdrop click (configurable)
 * - Optional title + description (a11y + visual header)
 * - Close button with refined focus states
 * - Multiple sizes
 * - Portal rendered to body (z-[100])
 *
 * Figma Alignment:
 * - Follows the elevated glass dialog / alert surfaces from the Levin VPN UI Kit.
 * - Uses the exact same glass, border, shadow, and spring tokens as Phase 1 primitives.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <Modal open={open} onClose={() => setOpen(false)} title="Confirm Disconnect" size="sm">
 *     <p>Are you sure?</p>
 *     <div className="flex gap-3 mt-6">
 *       <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
 *       <Button onClick={confirm}>Disconnect</Button>
 *     </div>
 *   </Modal>
 */
export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
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
      size = 'md',
    },
    ref
  ) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const descId = useId();
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const sizeClasses: Record<ModalSize, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'w-full max-w-[min(100vw-2rem,640px)]',
    };

    // Focus trap, ESC, scroll lock, and focus restoration
    useEffect(() => {
      if (!open) return;

      previousFocusRef.current = document.activeElement as HTMLElement | null;

      // Lock body scroll (preserve previous value for clean restore)
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        // ESC close
        if (e.key === 'Escape' && closeOnEsc) {
          e.preventDefault();
          onClose();
          return;
        }

        // Focus trap (Tab / Shift+Tab)
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

      // Focus management — give Framer Motion a moment to mount the panel
      const focusTimer = window.setTimeout(() => {
        const focusables = getFocusableElements(contentRef.current);
        if (focusables.length > 0) {
          focusables[0].focus();
        } else if (contentRef.current) {
          // Fallback: make the dialog itself focusable
          contentRef.current.focus();
        }
      }, 48);

      return () => {
        window.clearTimeout(focusTimer);
        document.removeEventListener('keydown', handleKeyDown, true);

        // Restore scroll
        document.body.style.overflow = originalOverflow;

        // Return focus to the element that opened the modal
        const toReturn = previousFocusRef.current;
        if (toReturn && typeof toReturn.focus === 'function') {
          // Slight delay lets exit animation complete visually
          window.setTimeout(() => {
            try {
              toReturn.focus();
            } catch {
              /* no-op */
            }
          }, 16);
        }
      };
    }, [open, onClose, closeOnEsc]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    const handleClose = () => {
      onClose();
    };

    const modalElement = (
      <AnimatePresence>
        {open && (
          <div
            className={cn(
              'fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6',
              className
            )}
            role="presentation"
          >
            {/* Backdrop — elegant dark + blur matching Aether aesthetic */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={handleBackdropClick}
              aria-hidden="true"
            />

            {/* The dialog panel */}
            <motion.div
              ref={(node) => {
                // Support both internal ref and forwarded ref
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
              className={cn('relative w-full outline-none', sizeClasses[size])}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: 6 }}
              transition={{
                type: 'spring',
                damping: 26,
                stiffness: 300,
                mass: 0.75,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard
                variant="strong"
                padding="none"
                className={cn(
                  'relative overflow-hidden rounded-3xl',
                  // Extra elevation for dialogs
                  'shadow-[0_25px_80px_-15px_rgba(0,0,0,0.55)]',
                  contentClassName
                )}
              >
                {/* Header (title + close) */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
                    {title ? (
                      <h2
                        id={titleId}
                        className="font-semibold text-[17px] tracking-[-0.3px] text-[var(--text-primary)] pr-2"
                      >
                        {title}
                      </h2>
                    ) : (
                      <span />
                    )}

                    {showCloseButton && (
                      <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close dialog"
                        className="ml-auto flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)] active:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]"
                      >
                        <X size={18} strokeWidth={2.75} />
                      </button>
                    )}
                  </div>
                )}

                {/* Screen-reader only description */}
                {description && (
                  <p id={descId} className="sr-only">
                    {description}
                  </p>
                )}

                {/* Content slot — scrollable if tall */}
                <div className="max-h-[68vh] overflow-y-auto overscroll-contain px-6 py-6 text-[15px] leading-[1.65] text-[var(--text-primary)]">
                  {children}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );

    return createPortal(modalElement, document.body);
  }
);

Modal.displayName = 'Modal';
