# AETHER — 高级 VPN

**隐形 · 坚不可摧 · 属于你**

一个完整、生产级的优质 VPN 体验重新设计。

<br>

<p align="center">
  <a href="./README.md">
    <img src="https://img.shields.io/badge/中文-简体中文-blue?style=flat-square" alt="中文">
  </a>
  <a href="./README.en.md">
    <img src="https://img.shields.io/badge/English-English-red?style=flat-square" alt="English">
  </a>
</p>

## 功能特性

**大规模并行开发已完成** —— 应用现已包含大量生产级功能：

- 完整的**高级订阅、支付与账单**流程
- 完善的**设置**体验（Kill Switch、自动连接、通知真实开关）
- **账号安全**（2FA 设置、设备管理）
- **隐私与数据**控制 + **推荐计划**
- 丰富的**FAQ + 帮助与支持**中心，支持模拟在线客服
- 完整的**浅色主题**支持 + 主题切换 + 专用预览页面
- 高级的**服务器地图**、**通知中心**和**诊断**页面
- 大幅增强的**测速工具**，支持交互式双线图表和指定服务器测试
- 全面的**组件库**（Button、Input 变体、GlassCard、VPNOrb、Toggle、SettingsRow、Select 等）

核心体验依然优秀：
- 精致的深色（现已支持浅色）高级界面，采用高级玻璃拟态效果
- 极具冲击力的交互式连接球，带实时动画
- 实时连接状态与时长计时器
- 美观的服务器选择器，支持实时 ping 和收藏
- 带 CSV 导出的活动时间线
- 高级认证流程
- 完全可用的状态管理（Zustand + 持久化）

## 技术栈（2026 最新）

- React 19 + TypeScript 5.8
- Vite 6 + SWC
- Tailwind CSS 4（新引擎）
- Framer Motion 12（丝滑动画）
- React Router 7
- Sonner（提示通知）
- Zustand 5（状态管理）
- **大量内部组件库**（Button、Input、GlassCard、VPNOrb、Toggle、SettingsRow、Select、Modal 系统等）

## 快速开始

```bash
npm install
npm run dev
```

然后访问：
- 主应用：http://localhost:5173
- **组件库预览**（强烈推荐）：http://localhost:5173/dev/components

生产环境构建：

```bash
npm run build
```

## 当前状态（大规模并行开发）

本项目经历了使用多个专业代理进行的大规模并行开发。

**近期开发主要成果：**

- 新增 **20+ 个生产级页面**（高级管理、完整支付/账单、隐私控制、推荐系统、完整设置套件、账号安全 + 2FA、FAQ + 帮助中心、服务器地图、通知中心、高级诊断、浅色主题预览页等）
- **组件库大幅扩展**，远超最初的 Phase 1 基础组件（现已包含 Toggle、SettingsRow、Select、Checkbox、RadioGroup、FormField、Modal、BottomSheet、InteractiveSpeedChart 等）。组件库是所有新功能的基础，并在 `/dev/components` 展示
- 完整的**浅色 + 深色主题**支持，支持一键切换和专用预览工具
- 高度重视**无障碍访问**（键盘导航、ARIA、实时区域）和**代码一致性**
- 所有新功能均接入现有的 Zustand store，支持持久化，并遵循 Aether 设计语言

详细状态请查看 `REQUIREMENTS.md`（整体进度 99% / Figma 一致性 97% —— 已完成最终验证，构建和代码检查均通过）。

## 设计理念

Aether 拒绝泛泛的“AI 灌水”美学。每一个细节都经过精心打磨：

- 深邃虚空背景 `#05070A`（同时完整支持浅色主题）
- 电光青蓝渐变作为情感核心
- 重度、奢华的毛玻璃拟态效果
- 基于弹簧的精致动效
- 卓越的排版与间距
- 最令人难忘的交互：会“呼吸”的连接球

在巨大的功能体量上，依然保持了对工艺的极致追求。

---

## 需求与 Figma 对齐

**这是权威的实时规范文档。**

请查看 [REQUIREMENTS.md](./REQUIREMENTS.md)，其中包含完整的、可勾选的功能清单，并与 “Levin - VPN App UI Kit” Figma 文件一一对应。

内容包括：
- 执行状态总览
- 详细的 Figma 组件 → 实现映射
- 针对每个页面、组件和流程的颗粒度复选框
- 推荐的实现顺序
- 组件提取路线图

**每次交付新功能后，请及时更新 REQUIREMENTS.md 中的复选框状态。**

---

**最终打磨（2026-05）**：经过收尾验证后，整体进度提升至 **99% / Figma 一致性 97%**。Lint、类型检查和构建均已通过（已修复小问题）。组件预览页（`/dev/components`）已更新，展示最新添加的组件（SettingsRow、Modal、BottomSheet 等）。已在 REQUIREMENTS.md 中新增“收尾阶段 — 当前项目状态”章节，包含验证结果和诚实总结。项目现已完成宏观打磨、完整文档化和生产级验证。权威的实时规范和详细状态请参见 REQUIREMENTS.md。