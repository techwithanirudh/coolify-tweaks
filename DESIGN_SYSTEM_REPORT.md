# Coolify Tweaks Design System Report

## Spacing System Update

**Updated on:** June 28, 2025  
**Version:** 3.0.0

### New Spacing Function

The spacing function `s()` has been updated to use **0.05 granularity** instead of the previous 0.5 increment system.

```scss
@function s($value) {
  @if $value == 0 {
    @return 0;
  }
  $rounded-multiplier: round($value / 0.05) * 0.05;
  @return calc(var(--spacing) * #{$rounded-multiplier});
}
```

**Base spacing unit:** `--spacing: 0.25rem` (4px)

### Component Spacing Breakdown

#### UI Components

| Component  | Element                        | Previous Value    | New Value (s()) | Computed Value    |
| ---------- | ------------------------------ | ----------------- | --------------- | ----------------- |
| **Box**    | `.box, .box-without-bg`        | `0.65rem 0.75rem` | `s(2.6) s(3)`   | `0.65rem 0.75rem` |
| **Button** | `@mixin button-base`           | `0.55rem 1rem`    | `s(2.2) s(4)`   | `0.55rem 1rem`    |
| **Input**  | `@mixin input-base`            | `0.55rem 1rem`    | `s(2.2) s(4)`   | `0.55rem 1rem`    |
| **Input**  | `input[type='checkbox/radio']` | `0.7rem`          | `s(2.8)`        | `0.7rem`          |
| **Input**  | `label margin-bottom`          | `0.75rem`         | `s(3)`          | `0.75rem`         |
| **Select** | `option padding`               | `10px`            | `s(2.5)`        | `0.625rem`        |
| **Select** | `option gap`                   | `20px`            | `s(5)`          | `1.25rem`         |
| **Table**  | `[role='row'] padding`         | `0.6rem 0.8rem`   | `s(2.4) s(3.2)` | `0.6rem 0.8rem`   |
| **Table**  | `[dashed] padding-block`       | `2rem`            | `s(8)`          | `2rem`            |

#### Layout Components

| Component          | Element                   | Previous Value             | New Value (s()) | Computed Value    |
| ------------------ | ------------------------- | -------------------------- | --------------- | ----------------- |
| **Grid**           | `.grid gap`               | `0.65rem`                  | `s(2.6)`        | `0.65rem`         |
| **Grid**           | `margin-top`              | `0.65rem`                  | `s(2.6)`        | `0.65rem`         |
| **Grid**           | `padding`                 | `0.75rem 0.85rem`          | `s(3) s(3.4)`   | `0.75rem 0.85rem` |
| **Navbar**         | `.navbar-main padding`    | `0.45rem 0.85rem`          | `s(1.8) s(3.4)` | `0.45rem 0.85rem` |
| **Navbar**         | `nav gap`                 | `0.8rem`                   | `s(3.2)`        | `0.8rem`          |
| **Navbar**         | `nav a padding`           | `0.3rem`                   | `s(1.2)`        | `0.3rem`          |
| **Sidebar**        | `.menu-item padding`      | `0.55rem 0.9rem`           | `s(2.2) s(3.6)` | `0.55rem 0.9rem`  |
| **Sidebar**        | `.menu-item gap`          | `0.6rem`                   | `s(2.4)`        | `0.6rem`          |
| **Sidebar**        | `nav > ul padding-inline` | `calc(var(--spacing) * 2)` | `s(2)`          | `0.5rem`          |
| **Sidebar**        | `nav > div padding-block` | `calc(var(--spacing) * 4)` | `s(4)`          | `1rem`            |
| **Theme Selector** | `button padding-block`    | `0.7rem`                   | `s(2.8)`        | `0.7rem`          |

#### Utility Classes

| Component       | Element                                 | Previous Value                                      | New Value (s()) | Computed Value    |
| --------------- | --------------------------------------- | --------------------------------------------------- | --------------- | ----------------- |
| **Sections**    | `section > h2/h3 + div margin-top`      | `0.65rem`                                           | `s(2.6)`        | `0.65rem`         |
| **Sections**    | `section > h2/h3 + div padding`         | `0.75rem 0.85rem`                                   | `s(3) s(3.4)`   | `0.75rem 0.85rem` |
| **Sections**    | `section:has() padding`                 | `1.25rem`                                           | `s(5)`          | `1.25rem`         |
| **Inputs**      | `input.dark:bg-coolgray-100 padding`    | `0.7rem`                                            | `s(2.8)`        | `0.7rem`          |
| **Main**        | `main > div padding-block`              | `calc(var(--spacing) * 18)`                         | `s(18)`         | `4.5rem`          |
| **Sponsor Box** | `div[p-4 border] margin-top`            | `calc(var(--spacing) * 4)`                          | `s(4)`          | `1rem`            |
| **Sponsor Box** | `div[p-4 border] padding`               | `calc(var(--spacing) * 4) calc(var(--spacing) * 6)` | `s(4) s(6)`     | `1rem 1.5rem`     |
| **Overrides**   | `[x-show='popups.sponsorship'] padding` | `1.25rem`                                           | `s(5)`          | `1.25rem`         |

### Spacing Scale Reference

| s() Value | Computed Value | Pixel Equivalent (at 16px base) |
| --------- | -------------- | ------------------------------- |
| `s(1)`    | `0.25rem`      | `4px`                           |
| `s(1.2)`  | `0.3rem`       | `4.8px`                         |
| `s(1.8)`  | `0.45rem`      | `7.2px`                         |
| `s(2)`    | `0.5rem`       | `8px`                           |
| `s(2.2)`  | `0.55rem`      | `8.8px`                         |
| `s(2.4)`  | `0.6rem`       | `9.6px`                         |
| `s(2.5)`  | `0.625rem`     | `10px`                          |
| `s(2.6)`  | `0.65rem`      | `10.4px`                        |
| `s(2.8)`  | `0.7rem`       | `11.2px`                        |
| `s(3)`    | `0.75rem`      | `12px`                          |
| `s(3.2)`  | `0.8rem`       | `12.8px`                        |
| `s(3.4)`  | `0.85rem`      | `13.6px`                        |
| `s(3.6)`  | `0.9rem`       | `14.4px`                        |
| `s(4)`    | `1rem`         | `16px`                          |
| `s(5)`    | `1.25rem`      | `20px`                          |
| `s(6)`    | `1.5rem`       | `24px`                          |
| `s(8)`    | `2rem`         | `32px`                          |
| `s(18)`   | `4.5rem`       | `72px`                          |

### Benefits of the New System

1. **Finer Control**: 0.05 granularity allows for more precise spacing adjustments
2. **Consistent Mapping**: Direct 1:1 mapping from original pixel/rem values to the new system
3. **Maintainability**: Centralized spacing function makes global adjustments easier
4. **Scalability**: Base spacing unit can be modified to scale the entire design system

### Implementation Notes

- All original spacing values have been preserved through careful mapping
- The spacing function rounds to the nearest 0.05 increment automatically
- Base spacing unit remains at 0.25rem (4px) for consistency with common design systems
- No visual changes to the UI - purely a refactor for better maintainability
