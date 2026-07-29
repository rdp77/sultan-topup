---
name: sultantopup
description: Design system extracted from Sultan Top Up (https://sultantopup.com/). Use when building UI that should match this brand's visual identity.
metadata:
  triggers: ['Sultan Top Up', 'sultantopup-com', 'design like Sultan Top Up', 'Sultan Top Up']
  source: https://sultantopup.com/
  extractedAt: 2026-07-29T04:00:03.102Z
  tags: ['dark', 'rounded', 'accented', 'sans-serif']
---

# Design System Inspired by Sultan Top Up

> Auto-extracted from `https://sultantopup.com/` on 2026-07-29

## 1. Visual Theme & Atmosphere

High-contrast dark mode with vivid accents — feels modern, technical, and focused.

The hero section leads with "Top up game favoritmu dalam hitungan detik" followed by "Proses otomatis 24 jam, harga bersahabat, dan pembayaran lengkap. Tanpa login, tanpa ribet.".

**Key Characteristics:**

- Geist as the heading font (custom web font loaded via @font-face)
- Geist as the body font for all running text
- Heading weight 700, letter-spacing -1.2px
- Dark background (#040819) as the primary canvas
- Primary accent `#25d366` used for CTAs and brand highlights
- 2 shadow level(s) detected — tinted shadows
- Rounded corners (15.996px+) creating a friendly, approachable feel
- Tags: dark, rounded, accented, sans-serif

## 2. Color Palette & Roles

### Primary

- **Primary Accent** (`#25d366`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Secondary Accent** (`#6366f1`) · `--color-secondary`: Secondary brand, hover states, complementary highlights.
- **Background** (`#040819`) · `--color-bg`: Page background, primary canvas.

### Text

- **Text Primary** (`#ffffff`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#94a3b8`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces

- **Border** (`#222222`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| #   | Hex       | CSS Variable  | Role        | Area   | Contrast   |
| --- | --------- | ------------- | ----------- | ------ | ---------- |
| 1   | `#140f2a` | `--palette-1` | button      | large  | text-light |
| 2   | `#040819` | `--palette-2` | block       | large  | text-light |
| 3   | `#6366f1` | `--palette-3` | badge       | medium | text-light |
| 4   | `#25d366` | `--palette-4` | button      | small  | text-dark  |
| 5   | `#94a3b8` | `--palette-5` | text-accent | small  | text-dark  |
| 6   | `#40f2e7` | `--palette-6` | text-accent | small  | text-dark  |

## 3. Typography Rules

- **Heading Font:** `Geist` (web font)
- **Body Font:** `Geist` (web font)

### Type Hierarchy

| Role  | Font  | Size | Weight | Line Height | Letter Spacing |
| ----- | ----- | ---- | ------ | ----------- | -------------- |
| H1    | Geist | 48px | 700    | 60px        | -1.2px         |
| H2    | Geist | 24px | 700    | 32px        | -0.6px         |
| H3    | Geist | 14px | 600    | 17.5px      | normal         |
| Body  | Geist | 16px | 400    | 26px        | normal         |
| Small | Geist | 14px | 500    | 20px        | normal         |
| Code  | Geist | 16px | 400    | 24px        | normal         |

### Type Scale

| Token   | Size   | Suggested Usage        |
| ------- | ------ | ---------------------- |
| Display | `48px` | headings               |
| H1      | `40px` | headings               |
| H2      | `24px` | headings               |
| H3      | `16px` | headings               |
| H4      | `14px` | headings               |
| Body L  | `12px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: transparent;
  color: #ffffff;
  border-radius: 9.996px;
  padding: 0px 0px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: #94a3b8;
  border-radius: 9.996px;
  padding: 0px 0px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Outline Button

```css
.btn-outline {
  background: transparent;
  color: #ffffff;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid rgba(148, 163, 184, 0.15);
  cursor: pointer;
}
```

### Pill Button

```css
.btn-pill {
  background: transparent;
  color: #ffffff;
  border-radius: 33554400px;
  padding: 0px 0px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Filled Button

```css
.btn-filled {
  background: #6366f1;
  color: #ffffff;
  border-radius: 12px;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
```

### Filled Button 2

```css
.btn-filled-2 {
  background: #140f2a;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 40px;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid rgba(148, 163, 184, 0.15);
  cursor: pointer;
}
```

### Card

```css
.card {
  background: #000000;
  border-radius: 12px;
  padding: 8px;
}
```

## 5. Layout Principles

- **Base spacing unit:** `12px` — use multiples (24px, 36px, 48px, etc.)

### Spacing Scale (extracted from real elements)

| Token     | Value  | Role    |
| --------- | ------ | ------- |
| spacing-1 | `12px` | element |
| spacing-2 | `10px` | element |
| spacing-3 | `16px` | element |
| spacing-4 | `32px` | card    |
| spacing-5 | `8px`  | element |
| spacing-6 | `20px` | element |
| spacing-7 | `48px` | card    |
| spacing-8 | `56px` | card    |

### Border Radius Scale

| Token         | Value      | Element |
| ------------- | ---------- | ------- |
| radius-button | `15.996px` | button  |
| radius-button | `9.996px`  | button  |
| radius-button | `12px`     | button  |
| radius-button | `8px`      | button  |
| radius-card   | `50px`     | card    |
| radius-card   | `20.004px` | card    |

## 6. Depth & Elevation

| Level | Shadow                                                                                | Usage                   |
| ----- | ------------------------------------------------------------------------------------- | ----------------------- |
| Low   | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0...` | Cards, subtle elevation |
| Mid   | `rgba(0, 0, 0, 0.1) 0px 2px 10px 0px`                                                 | Dropdowns, popovers     |

## 7. Do's and Don'ts

### Do

- Use `#040819` as the primary background color
- Use `Geist` for all headings and `Geist` for body text
- Use `#25d366` as the single dominant accent/CTA color
- Maintain `12px` as the base spacing unit — all gaps should be multiples
- Keep the overall feel dark — use dark surfaces throughout
- Use rounded corners (`15.996px`+) consistently for all interactive elements
- Apply the shadow system for elevation — use the extracted shadow values
- Use weight 700 for headings to match the brand's typographic voice

### Don't

- Don't use colors outside the extracted palette without justification
- Don't substitute Geist/Geist with generic alternatives
- Don't use irregular spacing — stick to 12px grid
- Don't introduce bright white surfaces — they break the dark palette
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't use pure black (#000000) for text — use `#ffffff` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette

## 8. Responsive Behavior

| Breakpoint | Width       | Notes                                                 |
| ---------- | ----------- | ----------------------------------------------------- |
| Mobile     | < 640px     | Single column, stack sections, reduce font sizes ~80% |
| Tablet     | 640–1024px  | 2-column where appropriate, maintain spacing ratios   |
| Desktop    | 1024–1440px | Full layout as designed                               |
| Wide       | > 1440px    | Max-width container, center content                   |

- Touch targets: minimum 44×44px on mobile
- Maintain 12px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #040819
Text:        #ffffff
Accent:      #25d366
Secondary:   #6366f1
Border:      #222222
```

### Example Prompts

1. "Build a hero section with a `#040819` background, `Geist` heading in `#ffffff`, and a `#25d366` CTA button with 12px radius."
2. "Create a pricing card using background `#040819`, border `#222222`, `Geist` for text, and 36px padding."
3. "Design a navigation bar — `#040819` background, `#ffffff` links, `#25d366` for active state."
4. "Build a feature grid with 3 columns, 36px gap, each card using the card component style."
5. "Create a footer with `#040819` background, `#ffffff` text, and 24px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Add shadows for depth — use the extracted shadow values, not defaults
7. Check responsive behavior — test mobile and tablet layouts
8. Final pass — verify all colors match, spacing is consistent, fonts are correct

## 10. CSS Custom Properties

> 22 custom properties extracted from `:root` / `html` stylesheets.

### Color Variables

| Variable                 | Value       |
| ------------------------ | ----------- |
| `--background`           | `#040819`   |
| `--foreground`           | `#fff`      |
| `--card`                 | `#140f2a`   |
| `--card-foreground`      | `#fff`      |
| `--popover`              | `#140f2a`   |
| `--popover-foreground`   | `#fff`      |
| `--primary`              | `#6366f1`   |
| `--primary-foreground`   | `#fff`      |
| `--secondary`            | `#140f2a`   |
| `--secondary-foreground` | `#fff`      |
| `--muted`                | `#140f2a`   |
| `--muted-foreground`     | `#94a3b8`   |
| `--accent`               | `#1c1640`   |
| `--accent-foreground`    | `#fff`      |
| `--destructive`          | `#f87171`   |
| `--success`              | `#34d399`   |
| `--warning`              | `#fbbf24`   |
| `--border`               | `#94a3b826` |
| `--input`                | `#94a3b833` |
| `--ring`                 | `#6366f1`   |

### Spacing Variables

| Variable   | Value    |
| ---------- | -------- |
| `--radius` | `.75rem` |

### Other Variables

| Variable              | Value     |
| --------------------- | --------- |
| `--lightningcss-dark` | `initial` |
