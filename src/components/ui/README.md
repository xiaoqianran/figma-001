# Aether UI Component Library

This folder contains the foundational reusable components extracted during **Phase 1** of the design system work.

## Installed Components

| Component     | Status     | Key Features                                      | Figma Alignment                          |
|---------------|------------|---------------------------------------------------|------------------------------------------|
| `Button`      | Production | variant, size, loading, icons, fullWidth         | Matches Levin Button component           |
| `Input`       | Production | label, leftIcon, rightElement, prefix, variant, hint, error | Advanced Input matrix (Email/Password/Phone/Code/Filled) |
| `GlassCard`   | Production | variant, interactive, padding, accent             | Core glassmorphism surface               |
| `VPNOrb`      | Production | status, size, onToggle, labels                    | Elements/VPN (hero element)              |
| `Toggle`      | Production | checked, onCheckedChange, size, label, disabled   | Figma Toggle (settings rows)             |
| `Checkbox`    | Production | checked, onCheckedChange, label, description      | Atomic Checkbox from design system       |
| `RadioGroup`  | Production | value, options, onValueChange, label, orientation | Atomic Radio / Choice groups             |
| `Select`      | Production | label, options, hint, error, placeholder          | Dropdown / Select component              |
| `FormField`   | Production | label, hint, error, children wrapper              | Consistent form layout helper            |
| `SettingsRow` | Production | icon, title, subtitle, rightElement (Toggle support), showChevron | Settings / Profile list rows |
| `Modal`       | Production | open, title, size, closeOnOverlayClick, children; Framer Motion fade+scale, focus trap, ESC, ARIA, GlassCard | Elevated glass dialog (Levin kit) |
| `BottomSheet` | Production | open, title, height, drag-to-dismiss; Framer Motion slide, focus trap, ESC, ARIA, GlassCard | iOS-style action / bottom sheet |

## Usage

```tsx
import { 
  Button, Input, GlassCard, VPNOrb, Toggle, 
  Checkbox, RadioGroup, Select, FormField, SettingsRow,
  Modal, BottomSheet
} from '@/components/ui'

// Basic + advanced Input (phone prefix + variant)
<Input label="EMAIL" leftIcon={<Mail />} />
<Input label="PHONE" prefix="+44" type="tel" placeholder="7123 456789" />
<Input variant="filled" label="INVITE CODE" />

// Select
<Select 
  label="SERVER REGION" 
  options={[{value:'us', label:'United States'}, {value:'eu', label:'Europe'}]} 
/>

// Checkbox + RadioGroup
<Checkbox label="Remember me" checked={remember} onCheckedChange={setRemember} />

<RadioGroup
  label="PLAN"
  options={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro', description: 'Full speed + 5 devices' },
  ]}
  value={plan}
  onValueChange={setPlan}
/>

// FormField wrapper
<FormField label="COUNTRY" hint="Affects recommended servers">
  <Select ... />
</FormField>

<Toggle checked={enabled} onCheckedChange={setEnabled} label="Kill Switch" />
<SettingsRow icon={Shield} title="Kill Switch" ... />

// Modal + BottomSheet (use state for open)
<Modal open={showModal} onClose={() => setShowModal(false)} title="Confirm Action" size="sm">
  <p>Content here. Supports focus trap + ESC.</p>
</Modal>
<BottomSheet open={showSheet} onClose={() => setShowSheet(false)} title="Options" height="auto">
  {/* scrollable content */}
</BottomSheet>
```

## Development Preview

During development, you can visually test all components at:

**http://localhost:5173/dev/components**

This route is automatically excluded from production builds.

## Design Principles

- All components preserve Aether’s signature craft (glassmorphism, electric gradient, refined motion, obsessive typography).
- Props are designed to map closely to Figma component properties from the Levin VPN UI Kit.
- Prefer composition over configuration where possible.
- Components should feel *better* than the original inline implementations.

## Next Phases

See `PHASE1_COMPONENT_LIBRARY_PLAN.md` (root) for the full extraction roadmap and what is planned for Phase 2.

---

**Current Status**: Phase 1 + Form Controls expansion complete. Full atomic form set (Input matrix + Checkbox + Radio + Select + FormField) now available and aligned with Levin Figma Input / form components.
