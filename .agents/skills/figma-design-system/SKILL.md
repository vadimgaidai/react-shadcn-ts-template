---
name: figma-design-system
description: Rules for translating Figma designs into production code using shadcn/ui, Tailwind CSS v4, and FSD architecture. Maps design tokens, components, and layouts to project conventions.
user-invocable: false
---

# Figma Design System Rules

Rules for implementing Figma designs in this project. Use alongside the Figma MCP tools (`get_design_context`, `get_screenshot`, `get_metadata`).

## Project Stack

- **UI Library:** shadcn/ui (new-york style, neutral base color)
- **Styling:** Tailwind CSS v4 with CSS variables (oklch color space)
- **Icons:** Lucide React
- **Architecture:** Feature-Sliced Design (FSD)
- **Components path:** `src/shared/ui/` (shadcn), feature UI in `src/features/[name]/ui/`

## Design Token Mapping

### Colors → CSS Variables

Map Figma color tokens to project semantic variables. **Never use raw hex/rgb values.**

| Figma Token / Role | Tailwind Class |
|---|---|
| Background / Surface | `bg-background` |
| Text / Primary | `text-foreground` |
| Text / Secondary | `text-muted-foreground` |
| Primary / Brand | `bg-primary`, `text-primary` |
| Secondary | `bg-secondary`, `text-secondary-foreground` |
| Accent / Hover | `bg-accent`, `text-accent-foreground` |
| Destructive / Error | `bg-destructive`, `text-destructive` |
| Border / Divider | `border-border` |
| Input border | `border-input` |
| Card surface | `bg-card`, `text-card-foreground` |
| Popover / Dropdown | `bg-popover`, `text-popover-foreground` |
| Muted / Disabled | `bg-muted`, `text-muted-foreground` |
| Focus ring | `ring-ring` |
| Sidebar surface | `bg-sidebar`, `text-sidebar-foreground` |
| Chart colors | `chart-1` through `chart-5` |

### Spacing → Tailwind Scale

Map Figma spacing values to Tailwind spacing:

| Figma (px) | Tailwind |
|---|---|
| 4 | `1` |
| 8 | `2` |
| 12 | `3` |
| 16 | `4` |
| 20 | `5` |
| 24 | `6` |
| 32 | `8` |
| 40 | `10` |
| 48 | `12` |
| 64 | `16` |

### Border Radius

Project default: `--radius: 0.625rem` (10px)

| Figma | Tailwind |
|---|---|
| 6px | `rounded-sm` |
| 8px | `rounded-md` |
| 10px | `rounded-lg` |
| 14px | `rounded-xl` |

### Typography

Use Tailwind typography utilities. Map Figma text styles:

| Figma Style | Tailwind |
|---|---|
| Heading 1 (30-36px) | `text-3xl font-bold tracking-tight` |
| Heading 2 (24-30px) | `text-2xl font-semibold tracking-tight` |
| Heading 3 (20-24px) | `text-xl font-semibold` |
| Heading 4 (16-18px) | `text-lg font-semibold` |
| Body (14-16px) | `text-sm` or `text-base` |
| Caption (12px) | `text-xs text-muted-foreground` |
| Label (14px medium) | `text-sm font-medium` |

## Component Mapping

### Figma Component → shadcn/ui

When Figma design includes these patterns, use the corresponding shadcn component:

**Actions & Inputs:**

| Figma Pattern | shadcn Component | Import Path |
|---|---|---|
| Button (any variant) | `Button` | `@/shared/ui/button` |
| Button group | `ButtonGroup` | `@/shared/ui/button-group` |
| Text input | `Input` | `@/shared/ui/input` |
| Input with icon/addon | `InputGroup` + `InputGroupInput` + `InputGroupAddon` | `@/shared/ui/input-group` |
| Textarea | `Textarea` | `@/shared/ui/textarea` |
| Checkbox | `Checkbox` | `@/shared/ui/checkbox` |
| Radio group | `RadioGroup` | `@/shared/ui/radio-group` |
| Toggle / Switch | `Switch` | `@/shared/ui/switch` |
| Toggle button | `Toggle` | `@/shared/ui/toggle` |
| Toggle button group | `ToggleGroup` | `@/shared/ui/toggle-group` |
| Select / Dropdown | `Select` | `@/shared/ui/select` |
| Native select | `NativeSelect` | `@/shared/ui/native-select` |
| Combobox / Autocomplete | `Combobox` | `@/shared/ui/combobox` |
| Slider / Range | `Slider` | `@/shared/ui/slider` |
| OTP / PIN input | `InputOTP` | `@/shared/ui/input-otp` |
| Label | `Label` | `@/shared/ui/label` |

**Forms (use FieldGroup + Field pattern, not raw divs):**

| Figma Pattern | shadcn Component | Import Path |
|---|---|---|
| Form field with label | `Field` + `FieldLabel` | `@/shared/ui/field` |
| Form field group | `FieldGroup` | `@/shared/ui/field` |
| Field description/error | `FieldDescription` | `@/shared/ui/field` |
| Fieldset with legend | `FieldSet` + `FieldLegend` | `@/shared/ui/field` |
| React Hook Form integration | `Form` + `FormField` + `FormItem` | `@/shared/ui/form` |

**Data Display:**

| Figma Pattern | shadcn Component | Import Path |
|---|---|---|
| Card container | `Card` + `CardHeader` + `CardContent` + `CardFooter` | `@/shared/ui/card` |
| Table | `Table` | `@/shared/ui/table` |
| Badge / Tag | `Badge` | `@/shared/ui/badge` |
| Avatar | `Avatar` + `AvatarFallback` | `@/shared/ui/avatar` |
| Keyboard shortcut | `Kbd` | `@/shared/ui/kbd` |
| Chart (bar, line, etc.) | `Chart` (Recharts wrappers) | `@/shared/ui/chart` |

**Navigation:**

| Figma Pattern | shadcn Component | Import Path |
|---|---|---|
| Sidebar | `Sidebar` | `@/shared/ui/sidebar` |
| Navigation menu | `NavigationMenu` | `@/shared/ui/navigation-menu` |
| Breadcrumb | `Breadcrumb` | `@/shared/ui/breadcrumb` |
| Tabs | `Tabs` | `@/shared/ui/tabs` |
| Pagination | `Pagination` | `@/shared/ui/pagination` |
| Menubar | `Menubar` | `@/shared/ui/menubar` |

**Overlays & Feedback:**

| Figma Pattern | shadcn Component | Import Path |
|---|---|---|
| Dialog / Modal | `Dialog` | `@/shared/ui/dialog` |
| Confirmation dialog | `AlertDialog` | `@/shared/ui/alert-dialog` |
| Sheet (side panel) | `Sheet` | `@/shared/ui/sheet` |
| Drawer (bottom panel) | `Drawer` | `@/shared/ui/drawer` |
| Popover | `Popover` | `@/shared/ui/popover` |
| Tooltip | `Tooltip` | `@/shared/ui/tooltip` |
| Hover card | `HoverCard` | `@/shared/ui/hover-card` |
| Dropdown menu | `DropdownMenu` | `@/shared/ui/dropdown-menu` |
| Context menu | `ContextMenu` | `@/shared/ui/context-menu` |
| Command palette | `Command` | `@/shared/ui/command` |
| Toast / Notification | `toast()` from `sonner`, `Toaster` from `@/shared/ui/sonner` | `sonner` |
| Alert / Callout | `Alert` | `@/shared/ui/alert` |
| Empty state | `Empty` | `@/shared/ui/empty` |

**Layout & Utility:**

| Figma Pattern | shadcn Component | Import Path |
|---|---|---|
| Progress bar | `Progress` | `@/shared/ui/progress` |
| Skeleton loader | `Skeleton` | `@/shared/ui/skeleton` |
| Spinner / Loading | `Spinner` | `@/shared/ui/spinner` |
| Separator / Divider | `Separator` | `@/shared/ui/separator` |
| Accordion | `Accordion` | `@/shared/ui/accordion` |
| Collapsible section | `Collapsible` | `@/shared/ui/collapsible` |
| Resizable panels | `Resizable` | `@/shared/ui/resizable` |
| Scroll area | `ScrollArea` | `@/shared/ui/scroll-area` |
| Carousel / Slider | `Carousel` | `@/shared/ui/carousel` |
| Calendar / Date picker | `Calendar` | `@/shared/ui/calendar` |
| Aspect ratio container | `AspectRatio` | `@/shared/ui/aspect-ratio` |

### Import Rules

- **Never** use barrel imports from `@/shared/ui` — import each component by direct path
- Icons: `import { IconName } from "lucide-react"`
- Utility: `import { cn } from "@/shared/lib"`
- Icons inside components use `data-icon` attribute, no sizing classes on icons

### Form Pattern

Always use `FieldGroup` + `Field` for forms, not raw `div` with `space-y-*`:

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" />
  </Field>
  <Field data-invalid>
    <FieldLabel>Password</FieldLabel>
    <Input aria-invalid />
    <FieldDescription>Required field.</FieldDescription>
  </Field>
</FieldGroup>
```

## Layout Patterns

### Figma Auto Layout → Flexbox/Grid

| Figma Auto Layout | Tailwind |
|---|---|
| Horizontal, gap 8 | `flex gap-2` |
| Vertical, gap 16 | `flex flex-col gap-4` |
| Wrap | `flex flex-wrap gap-*` |
| Grid (equal columns) | `grid grid-cols-{n} gap-*` |
| Fill container (horizontal) | `flex-1` or `w-full` |
| Hug contents | default (no width utility) |
| Fixed width | `w-[{value}px]` or nearest Tailwind class |

### Spacing: use `gap-*`, not `space-y-*` or `space-x-*`

### Responsive Breakpoints

| Breakpoint | Tailwind Prefix |
|---|---|
| Mobile (< 640px) | default (mobile-first) |
| Tablet (>= 640px) | `sm:` |
| Desktop (>= 768px) | `md:` |
| Large (>= 1024px) | `lg:` |
| XL (>= 1280px) | `xl:` |

## FSD Placement Rules

When implementing a Figma design, place code in the correct FSD layer:

| What you're building | FSD Layer | Path |
|---|---|---|
| Full page / screen | `pages` | `src/pages/[name]/[name]-page.tsx` |
| Layout with sidebar/header | `widgets` | `src/widgets/[name]/` |
| Interactive feature (form, auth) | `features` | `src/features/[name]/ui/` |
| Data display (user card, product) | `entities` | `src/entities/[name]/ui/` (if needed) |
| Reusable generic UI | `shared` | `src/shared/components/` |

## Dark Mode

- Use semantic color variables — they auto-switch between light/dark
- Never hardcode colors with `dark:` prefix overrides
- Test both themes when implementing designs
- If Figma provides both light and dark variants, verify both map correctly to CSS variables

## Workflow

1. **Get design** via `get_design_context` with fileKey and nodeId
2. **Identify components** — map to existing shadcn/ui components from tables above
3. **Map tokens** — colors to CSS variables, spacing to Tailwind scale
4. **Check existing components** — search project for similar patterns before creating new ones
5. **Implement** — follow FSD layer rules, use compound component pattern for complex widgets
6. **Add translations** — any user-facing text goes to `src/shared/config/i18n/locales/en/translation.json`
