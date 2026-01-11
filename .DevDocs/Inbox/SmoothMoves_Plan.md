# Smooth Moves Marketing Website Plan

## Task Checklist

- [ ] Project Initialization
  - [ ] Initialize Next.js 14+ (App Router) in `smooth-moves-marketing` directory
  - [ ] Configure Tailwind CSS with Brand Colors (#1E3A5F, #FF7E00, #708090, #E1A95F)
  - [ ] Install dependencies: Framer Motion, Lucide React, Zod, React Hook Form
  - [ ] Setup Nunito Font (400, 600, 700)
- [ ] Design System & Layout
  - [ ] Implement Semi-Sticky Quick Navigation with Dropdown Categorization
  - [ ] Implement Footer (5 Columns, Dark Bg #1E3A5F)
  - [ ] Create Reusable UI Components:
    - [ ] Primary Button (Orange #FF7E00) & Ghost Button
    - [ ] Bento Grid Container & Cards
    - [ ] Section Wrapper with standard padding
- [ ] Hero Section
  - [ ] Implement Headline Formula: "Outcome → How → Reassurance"
  - [ ] Add Primary CTA (Orange) + Secondary (Ghost) with Hover Animations
  - [ ] Create/Embed Animation: App interface preview or 3D box
  - [ ] Add Social Proof Snippet ("Join 10,000+...")
- [ ] Core Features (Bento Grid)
  - [ ] Implement Bento Grid Layout
  - [ ] Feature Cards:
    - [ ] QR Code Inventory System
    - [ ] Real-Time Collaboration
    - [ ] Strategic Truck Loading
    - [ ] Status Workflow
    - [ ] Budget Tracking (Financial Navigator)
    - [ ] Move Planner
    - [ ] In-App Chat
    - [ ] Smart Notifications
- [ ] Content Sections - Part 1
  - [ ] Problem/Solution Section (3-column grid with hover interactions)
  - [ ] Use Cases Section (Tabs: Family, Downsizing, First-Time)
  - [ ] How It Works Section (4-Step Animated Timeline: Set Up -> Pack -> Load -> Unload)
- [ ] Content Sections - Part 2
  - [ ] Differentiation Section (Comparison Table + 4 Differentiators)
  - [ ] Pricing Section (3 Tiers: Essentials $0, Complete $29, Ultimate $79)
  - [ ] Social Proof Section (Testimonial Carousel with Auto-play using Placeholder Data)
  - [ ] Documentation Hub (Resource Links Grid)
  - [ ] Final CTA Section (Large Orange CTA)
- [ ] Polish & Optimization
  - [ ] Mobile Responsiveness Audit (Breakpoints: 640px, 768px, 1024px)
  - [ ] Dark Mode Logic (System Preference Default)
  - [ ] Performance Tuning (Lighthouse 95+, Lazy Loading)
  - [ ] SEO Meta Tags & OG Images

## Implementation Plan

### Goal Description

Build a premium, high-performance marketing website for Smooth Moves. The site will be a standalone Next.js application designed to drive conversion through clarity and professional aesthetics.

### Key Requirements Enforcement

#### 1. Visual Identity

- **Colors**: Strict adherence to the brand palette.
  - **Structure**: `#1E3A5F` (Nav, Headers)
  - **Action**: `#FF7E00` (ONE primary CTA per section max)
  - **Secondary**: `#708090`
  - **Neutrals**: `#D3D3D3` (Bg), `#FFFFFF` (Surface)
- **Typography**: Nunito Only.

#### 2. Component Strategy

- **Hero**: Immersive, full-viewport with parallax.
- **Bento Grids**: Used for feature density without clutter.
- **Animations**: Purposeful micro-interactions (200ms) and smooth section transitions (600ms).

### 3. Section Breakdown (Executed in Order)

1.  **Project Init**: Setup Next.js, Tailwind, Fonts.
2.  **Shared Layout**: Nav (Sticky/Blur), Footer (Multi-column).
3.  **Hero**: The "Wow" factor entrance.
4.  **Problem/Solution & Features**: The core value proposition.
5.  **Use Cases & How It Works**: Showing _how_ it applies to the user.
6.  **Trust Builders**: Comparison, Social Proof, Pricing.
7.  **Resources & Final Push**: Docs hub and Final CTA.

### Verification Plan

- **Responsiveness**: Manual check of mobile drawer and grid stacking at 640px.
- **Performance**: Lighthouse audit targeting 95+ Score.
- **Animations**: Verify smooth easing (ease-out enter, ease-in exit) and "no-motion" preference respect.
