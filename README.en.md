# AETHER — Premium VPN

**Invisible. Unbreakable. Yours.**

A complete, production-quality redesign of a premium VPN experience.

<br>

<p align="center">
  <a href="./README.md">
    <img src="https://img.shields.io/badge/中文-简体中文-blue?style=flat-square" alt="中文">
  </a>
  <a href="./README.en.md">
    <img src="https://img.shields.io/badge/English-English-red?style=flat-square" alt="English">
  </a>
  <a href="https://xiaoqianran.github.io/figma-001/">
    <img src="https://img.shields.io/badge/Live%20Demo-View%20Demo-success?style=flat-square&logo=github" alt="Live Demo">
  </a>
</p>

## Features

**Massive parallel development batch completed** — the app now includes a very large set of production-grade features:

- Full **Premium Subscriptions, Payments & Billing** flows
- Complete **Settings** experience (Kill Switch, Auto-Connect, Notifications with real toggles)
- **Account Security** (2FA setup, device management)
- **Privacy & Data** controls + **Referral Program**
- Rich **FAQ + Help & Support** center with live chat simulation
- Full **Light Theme** support + theme switcher + dedicated preview pages
- Advanced **Server Map**, **Notifications Center**, and **Diagnostics** pages
- Significantly enhanced **Speedtest** with interactive dual-line charts and server-specific testing
- Comprehensive **Component Library** (Button, Input variants, GlassCard, VPNOrb, Toggle, SettingsRow, Select, etc.)

Core experience remains excellent:
- Stunning dark (and now Light) premium interface with sophisticated glassmorphism
- Heroic interactive connection orb with live animations
- Real-time connection stats and duration timer
- Beautiful server selector with live ping + favorites
- Activity timeline with CSV export
- Premium authentication flows
- Fully functional state (Zustand + persistence)

## Tech Stack (Latest 2026)

- React 19 + TypeScript 5.8
- Vite 6 + SWC
- Tailwind CSS 4 (new engine)
- Framer Motion 12 (buttery animations)
- React Router 7
- Sonner (toasts)
- Zustand 5 (state)
- **Extensive internal Component Library** (Button, Input, GlassCard, VPNOrb, Toggle, SettingsRow, Select, Modal system, etc.)

## Getting Started

```bash
npm install
npm run dev
```

Then visit:
- Main app: http://localhost:5173
- **Component Library Preview** (highly recommended): http://localhost:5173/dev/components

Build for production:

```bash
npm run build
```

## Current State (Massive Parallel Development)

This project has undergone an extremely large-scale parallel development effort using multiple specialized agents.

**Key achievements in the recent development waves:**
- **20+ new production-quality pages** added (Premium management, full Payments/Billing, Privacy controls, Referral system, complete Settings suite, Account Security + 2FA, FAQ + Help center, Server Map, Notifications Center, Advanced Diagnostics, Light Theme preview pages, etc.).
- **Component Library significantly expanded** beyond the original Phase 1 primitives (now includes Toggle, SettingsRow, Select, Checkbox, RadioGroup, FormField, Modal, BottomSheet, InteractiveSpeedChart, and more). The library is the foundation for all new features and is showcased at `/dev/components`.
- **Full Light + Dark theme support** with easy switching and dedicated preview tools.
- Strong focus on **accessibility** (keyboard navigation, ARIA, live regions) and **code consistency** across all new features.
- All new functionality is wired into the existing Zustand store with persistence and follows the established Aether design language.

See `REQUIREMENTS.md` for the detailed status (99% overall / 97% Figma parity — final verification complete with clean builds and lint).

## Design Philosophy

Aether rejects generic "AI slop" aesthetics. Every detail was deliberately crafted:

- Deep void `#05070A` background (with full Light theme support)
- Electric cyan-blue gradient as the emotional core
- Heavy, luxurious backdrop blur glassmorphism
- Spring-based refined motion
- Exceptional typography and spacing
- One memorable interaction: the living connection orb

Built with obsessive attention to craft across a very large feature surface.

---

## Requirements & Figma Alignment

**This is the authoritative living spec.**

See [REQUIREMENTS.md](./REQUIREMENTS.md) for the complete, checkable feature list mapped against the "Levin - VPN App UI Kit" Figma file.

It includes:
- Executive status dashboard
- Detailed Figma component → implementation mapping
- Granular checkboxes for every screen, component, and flow
- Recommended implementation order
- Component extraction roadmap

**Update the checkboxes in REQUIREMENTS.md every time you ship a feature.**

---

**Final Polish (2026-05)**: Executive bumped to **99% Overall / 97% Figma Parity** after wrap-up verification pass. Full lint + type-check + build clean (minor issues fixed). ComponentPreview (`/dev/components`) refreshed to showcase newest additions (SettingsRow, Modal, BottomSheet). "Wrap-up Phase — Current Project Status" section added to REQUIREMENTS.md with verification results and honest summary. Project now macro-polished, fully documented, and production-verified. See REQUIREMENTS.md for the authoritative living spec and detailed status.