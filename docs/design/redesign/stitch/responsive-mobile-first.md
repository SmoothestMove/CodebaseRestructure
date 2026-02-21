# Mobile-First Responsive Design Conventions for Agentic AI

## Core Philosophy

Mobile-first means **writing CSS for mobile devices first**, then progressively enhancing for larger screens using `min-width` media queries. This is the opposite of desktop-first design, which uses `max-width` queries to scale down.

## Why Mobile-First?

1. **Performance**: Mobile devices load only the CSS they need, without downloading and overriding desktop styles
2. **Progressive Enhancement**: Start with essential features, add complexity for capable devices
3. **Natural Priority**: Forces focus on core content and functionality first

## Breakpoint Conventions

Standard breakpoints (using `min-width`):

```css
/* Base styles: mobile (0-640px) */
.element {
  font-size: 14px;
  padding: 8px;
}

/* Small tablets/large phones (640px+) */
@media (min-width: 640px) {
  .element {
    font-size: 16px;
  }
}

/* Tablets (768px+) */
@media (min-width: 768px) {
  .element {
    padding: 12px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .element {
    font-size: 18px;
  }
}

/* Large desktop (1280px+) */
@media (min-width: 1280px) {
  .element {
    padding: 16px;
  }
}
```

## Tailwind CSS Mobile-First Syntax

Tailwind uses unprefixed classes for mobile, prefixed for larger screens:

```jsx
// Mobile: text-sm, padding-2
// Tablet (768px+): text-base, padding-4
// Desktop (1024px+): text-lg, padding-6
<div className="text-sm p-2 md:text-base md:p-4 lg:text-lg lg:p-6">
```

**Tailwind breakpoints:**

- `sm:` = 640px+
- `md:` = 768px+
- `lg:` = 1024px+
- `xl:` = 1280px+
- `2xl:` = 1536px+

## Layout Patterns

### Stacking to Horizontal

```jsx
// Mobile: stack vertically
// Desktop: horizontal layout
<div className="flex flex-col lg:flex-row gap-4">
  <aside className="w-full lg:w-64">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```

### Grid Responsiveness

```jsx
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3-4 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

### Hidden/Visible Elements

```jsx
// Mobile menu button (hidden on desktop)
<button className="lg:hidden">☰</button>

// Desktop navigation (hidden on mobile)
<nav className="hidden lg:flex">
```

## Touch Target Sizes

- **Minimum touch target**: 44×44px (iOS) or 48×48px (Android)
- Mobile buttons should be larger than desktop equivalents

```jsx
// Mobile: larger padding for touch
// Desktop: can be more compact
<button className="px-6 py-4 md:px-4 md:py-2">
```

## Typography Scale

```jsx
// Headings scale up on larger screens
<h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
<p className="text-sm md:text-base lg:text-lg">
```

## Spacing Conventions

Use smaller spacing on mobile, increase for desktop:

```jsx
// Container padding
<div className="px-4 md:px-6 lg:px-8">

// Section margins
<section className="my-8 md:my-12 lg:my-16">

// Grid gaps
<div className="gap-4 md:gap-6 lg:gap-8">
```

## Container Patterns

```jsx
// Full width on mobile, constrained on desktop
<div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
```

## Image Responsiveness

```jsx
// Full width on mobile, constrained on desktop
<img src="image.jpg" className="w-full md:w-auto md:max-w-md lg:max-w-lg" alt="Description" />
```

## Critical Rules for AI Code Generation

1. **Always write base styles for mobile first** (no breakpoint prefix)
2. **Only add breakpoint prefixes when something changes** at larger sizes
3. **Use `min-width` media queries**, not `max-width`
4. **Test mobile layout first** - it should be fully functional without any breakpoint styles
5. **Avoid `hidden` without a breakpoint** unless you mean hidden on all devices
6. **Stack vertically by default**, arrange horizontally at larger breakpoints
7. **Start with `flex-col`**, change to `flex-row` with breakpoints
8. **Use `w-full` for mobile**, constrain width at larger breakpoints

## Common Mistakes to Avoid

❌ **Wrong** (desktop-first thinking):

```jsx
<div className="flex-row lg:flex-col"> // backwards
<div className="w-64 md:w-full"> // backwards
```

✅ **Correct** (mobile-first):

```jsx
<div className="flex-col lg:flex-row">
<div className="w-full md:w-64">
```

## Meta Viewport Tag

Always include in HTML:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

This convention ensures your generated code works optimally across all device sizes, prioritizing the mobile experience while enhancing for larger screens.
