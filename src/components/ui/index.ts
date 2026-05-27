/**
 * Aether UI Component Library — Barrel Export
 * 
 * Phase 1: Foundation primitives (Button, Input, GlassCard, VPNOrb)
 * Phase 2+: Form controls (Toggle, Checkbox, RadioGroup, Select, FormField, SettingsRow)
 *
 * Form primitives now provide excellent coverage for the advanced Input matrix
 * (phone prefixes, code/OTP, filled states) + complete atomic set (Checkbox, Radio, Select).
 *
 * Usage:
 *   import { 
 *     Button, Input, GlassCard, VPNOrb, Toggle, SettingsRow,
 *     Select, Checkbox, RadioGroup, FormField,
 *     Modal, BottomSheet
 *   } from '@/components/ui'
 */

export * from './types';

// Primitives (Phase 1)
export { GlassCard } from './GlassCard';
export { Button } from './Button';
export { Input } from './Input';
export { VPNOrb } from './VPNOrb';

// Form controls (expanded)
export { Toggle } from './Toggle';
export { Checkbox } from './Checkbox';
export { RadioGroup } from './RadioGroup';
export { Select } from './Select';
export { FormField } from './FormField';

// Composition / layout patterns
export { SettingsRow } from './SettingsRow';

// Overlay components (Modal, BottomSheet)
export { Modal } from './Modal';
export { BottomSheet } from './BottomSheet';

// Re-export useful utilities if needed later
// export { cn } from '@/lib/utils';