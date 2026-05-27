/**
 * Shared type definitions for the Aether UI Component Library.
 * 
 * These types are intentionally aligned with Figma component properties
 * from the "Levin - VPN App UI Kit" (Button, Input, etc.) while remaining
 * pragmatic for the current dark-only implementation.
 * 
 * Phase 1 scope: Button, Input, GlassCard, VPNOrb primitives.
 * Future phases will expand variant matrices (especially for Light theme).
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type InputVariant = 'default' | 'filled' | 'active';
export type InputType = 'text' | 'email' | 'password' | 'tel' | 'search' | 'number';

export type GlassVariant = 'default' | 'strong';
export type GlassPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Connection status for the hero VPN Orb.
 * Directly maps to Figma Elements/VPN component states:
 *   - idle       → Status=Disconnected
 *   - connecting → Status=Connecting
 *   - connected  → Status=Connected
 */
export type ConnectionStatus = 'idle' | 'connecting' | 'connected';

/**
 * Future-proof theme type (Phase 1 is Dark only).
 */
export type Theme = 'dark' | 'light';

/**
 * Common size prop used across multiple components.
 */
export type Size = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Base props that most interactive components should support
 * for consistency with existing app behavior.
 */
export interface BaseInteractiveProps {
  /** Whether the element is currently in a loading state */
  loading?: boolean;
  /** Full width (100%) */
  fullWidth?: boolean;
}

/**
 * Toggle switch size — used by the premium Toggle component.
 * Aligned with Figma Toggle variants and existing size scale.
 */
export type ToggleSize = 'sm' | 'md' | 'lg';

/** Simple prefix for phone inputs (e.g. country code "+1"). */
export type PhonePrefix = string | React.ReactNode;

/** Props for the enhanced Input supporting phone prefixes and variants. */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  hint?: string;
  error?: string;
  containerClassName?: string;
  variant?: InputVariant;
  /** Static prefix text or node (ideal for phone country codes like "+44"). Renders before input content. */
  prefix?: PhonePrefix;
}

/** Options shape for Select component. */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Reusable Select props matching Input's layout contract (label/hint/error). */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
  /** Array of options. Alternative to passing <option> children. */
  options?: SelectOption[];
  /** Placeholder shown as disabled first option when no value. */
  placeholder?: string;
}

/** Checkbox component props (simple, accessible, matches Aether visual language). */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'checked'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  /** Description text shown below label. */
  description?: string;
}

/** Single radio option descriptor. */
export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

/** RadioGroup props — simple controlled group with consistent styling. */
export interface RadioGroupProps {
  /** Currently selected value */
  value?: string;
  /** Called with the new value when selection changes */
  onValueChange?: (value: string) => void;
  /** List of options to render as radios */
  options: RadioOption[];
  /** Optional group label (rendered above) */
  label?: string;
  /** Optional hint text */
  hint?: string;
  /** Error state */
  error?: string;
  /** Additional container classes */
  className?: string;
  /** Name for the native radio group (auto-generated if omitted) */
  name?: string;
  /** Layout direction */
  orientation?: 'horizontal' | 'vertical';
}

/** Simple FormField wrapper props for consistent spacing + messaging around any control. */
export interface FormFieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** The actual form control (Input, Select, Checkbox, etc). */
  children: React.ReactNode;
  /** Optional id to associate label with control */
  id?: string;
  /** Extra classes on the root wrapper */
  className?: string;
  /** If true, renders label as visually hidden (for accessibility with other labelling) */
  hideLabel?: boolean;
}

/**
 * Modal size variants for the reusable Modal component.
 * Maps closely to common dialog sizes in the Levin VPN UI Kit.
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * BottomSheet height presets. Keeps API simple and mobile-first.
 */
export type BottomSheetHeight = 'auto' | 'half' | 'full';

/**
 * Base props shared by Modal and BottomSheet for consistent overlay behavior.
 */
export interface BaseOverlayProps {
  /** Controls visibility. When false, component unmounts after exit animation. */
  open: boolean;
  /** Called when the overlay requests to close (overlay click, ESC, close button, drag dismiss). */
  onClose: () => void;
  /** Optional title rendered in the header area. Also used for aria-labelledby. */
  title?: React.ReactNode;
  /** Optional description for aria-describedby (improves a11y for screen readers). */
  description?: string;
  /** Allow closing by clicking/tapping the backdrop. Default: true */
  closeOnOverlayClick?: boolean;
  /** Allow closing with the Escape key. Default: true */
  closeOnEsc?: boolean;
  /** Show the X close button in header. Default: true */
  showCloseButton?: boolean;
  /** Additional classes for the outer container (rarely needed). */
  className?: string;
  /** Classes for the inner content panel (glass surface). */
  contentClassName?: string;
  /** Children (form content, actions, etc). Prefer composition. */
  children: React.ReactNode;
}

/**
 * Toggle switch props.
 * Controlled component using `checked` + `onCheckedChange` (consistent with Checkbox).
 * Extends button attributes (with onClick/onChange omitted to avoid conflicts).
 */
export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  /** Controlled checked state */
  checked?: boolean;
  /** Callback when toggle state changes. Receives the new checked value. */
  onCheckedChange?: (checked: boolean) => void;
  /** Visual size of the toggle switch. Matches design system sizes. */
  size?: ToggleSize;
  /** Optional visible label rendered to the right of the switch (for convenience in rows). */
  label?: string;
  /** Accessible label for screen readers when no visible label is provided. */
  'aria-label'?: string;
}

/**
 * SettingsRow — props for reusable settings / profile list rows.
 * Supports navigation (`to`), custom right content (e.g. Toggle), status badges.
 * Extends native button attributes for full flexibility (onClick, etc).
 */
export interface SettingsRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide icon component (or any ReactNode) for the leading visual */
  icon: React.ElementType | React.ReactNode;
  /** Primary title text */
  title: string;
  /** Optional secondary description */
  subtitle?: string;
  /** Custom right-hand side content (e.g. <Toggle />, status badge, or chevron) */
  rightElement?: React.ReactNode;
  /** If true, shows default chevron on right (unless rightElement provided) */
  showChevron?: boolean;
  /** Optional react-router path — row will navigate on click (convenience for hubs) */
  to?: string;
  /** Optional status badge (e.g. 'on' | 'off' for quick visual of vpnSettings) */
  status?: 'on' | 'off';
}
