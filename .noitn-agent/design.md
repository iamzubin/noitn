# Noitn - Design Specification

## Design Philosophy

**Sunset Noir** - High-contrast dark mode with vibrant orange accents. Clean, typographic-driven layout.

---

## Color Palette

### Dark Mode (Primary)

| Element | Hex Code |
|---------|----------|
| Background | `#000000` |
| Surface | `#0A0A0A` |
| Surface Hover | `#141414` |
| Border | `#1A1A1A` |
| Accent | `#FF4F11` |
| Accent Hover | `#FF6B3D` |
| Text Primary | `#FFFFFF` |
| Text Secondary | `#888888` |
| Text Muted | `#555555` |

### Light Mode

| Element | Hex Code |
|---------|----------|
| Background | `#FAFAFA` |
| Surface | `#FFFFFF` |
| Border | `#E4E4E7` |
| Accent | `#FF4F11` |
| Text Primary | `#18181B` |

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Inter | 24px | 600 |
| H2 | Inter | 18px | 600 |
| Body | Inter | 14px | 400 |
| Small | Inter | 12px | 400 |
| Mono | SF Mono | 13px | 400 |

---

## Spacing

Base unit: 4px

| Token | Value |
|-------|-------|
| --space-1 | 4px |
| --space-2 | 8px |
| --space-3 | 12px |
| --space-4 | 16px |
| --space-5 | 20px |
| --space-6 | 24px |

---

## Border Radius

| Token | Value |
|-------|-------|
| --radius-sm | 6px |
| --radius-md | 8px |
| --radius-lg | 12px |
| --radius-full | 9999px |

---

## Component Specs

### Primary Button
- Background: `#FF4F11`
- Text: `#000000`
- Height: 36px
- Border-radius: 9999px

### Input
- Background: `#0A0A0A`
- Border: 1px solid `#1A1A1A`
- Border-radius: 6px

### Card
- Background: `#0A0A0A`
- Border: 1px solid `#1A1A1A`
- Border-radius: 8px

---

## Layout

```
┌──────┬──────────────────────────────────────┐
│ 60px │  Main Content                        │
│ side │                                      │
│ bar  │  [Card] [Card] [Card]               │
│      │                                      │
└──────┴──────────────────────────────────────┘
```

Sidebar: 60px (icon-only) or 240px (full)
