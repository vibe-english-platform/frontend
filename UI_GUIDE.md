# 🎨 UI Design Guide

This frontend uses **shadcn/ui + Tailwind CSS** for a modern, beautiful, and accessible user interface.

## 🛠️ Technology Stack

### Core Libraries
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component system
- **Radix UI** - Accessible primitives
- **Lucide React** - Beautiful icons

## 🎨 Design System

### Color Palette
The app uses a custom color system defined in Tailwind:

```css
Primary: Indigo/Purple gradient (250° 84% 69%)
Secondary: Light gray tones
Background: White with gradient overlay
Accent: Purple-pink gradient
```

### Component Library

All UI components are in `src/components/ui/`:
- **Button** - Multiple variants (default, outline, ghost, secondary)
- **Card** - Content containers with header, content, footer
- **Input** - Text input with focus states
- **Textarea** - Multi-line text input
- **Badge** - Labels and tags
- **Label** - Form labels

## 📁 Component Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── badge.tsx
│   ├── WordInput.tsx    # Word search screen
│   ├── MeaningSelector.tsx # Meaning selection screen
│   └── LearningCard.tsx # Final learning card display
├── lib/
│   └── utils.ts         # Utility functions (cn)
└── types/
    └── index.ts         # TypeScript types
```

## 🎯 Key Features

### 1. WordInput Component
- Search bar with real-time validation
- Suggested words as clickable badges
- Loading states with spinner
- Error handling with visual feedback
- Icon integration (Search, Sparkles)

### 2. MeaningSelector Component
- Scrollable list of dictionary meanings
- Part of speech badges
- Hover effects for interactivity
- Custom meaning textarea
- Loading overlay with animation
- Back navigation

### 3. LearningCard Component
- Large image display with fallback
- Meaning and example sections with icons
- Color-coded sections (blue for meaning, amber for example)
- Action buttons (Save, Share)
- Responsive design

## 🎨 Design Principles

### 1. **Accessibility First**
- All components from Radix UI are WCAG compliant
- Proper focus states
- Keyboard navigation support
- ARIA labels where needed

### 2. **Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Flexible layouts with Tailwind grid/flex

### 3. **Visual Hierarchy**
- Clear typography scale
- Consistent spacing (Tailwind spacing system)
- Color coding for different content types
- Icons to enhance understanding

### 4. **Smooth Interactions**
- Hover states on all interactive elements
- Loading animations
- Fade-in animations for new content
- Button press feedback

## 🔧 Customization

### Adding New Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        50: '#f5f3ff',
        500: '#8b5cf6',
        900: '#4c1d95',
      }
    }
  }
}
```

### Creating New Components

Use the `cn` utility for className merging:

```typescript
import { cn } from '../lib/utils'

function MyComponent({ className }: { className?: string }) {
  return (
    <div className={cn("base-classes", className)}>
      Content
    </div>
  )
}
```

### Adding shadcn/ui Components

```bash
# If you need more components, add them manually
# Example: Alert component
```

Create in `src/components/ui/alert.tsx` following shadcn/ui patterns.

## 🎭 Animation System

### Built-in Animations
- `animate-spin` - Loading spinners
- `animate-in fade-in` - Fade in on mount
- `slide-in-from-bottom-4` - Slide up animation
- Custom hover transitions

### Adding Custom Animations

In `tailwind.config.js`:

```javascript
animation: {
  'bounce-slow': 'bounce 3s infinite',
}
```

## 🌈 Gradient Backgrounds

The app uses a beautiful gradient background:

```css
bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
```

Cards have backdrop blur for a glassmorphism effect:

```css
backdrop-blur-sm bg-white/95
```

## 📱 Responsive Breakpoints

```
sm:  640px  → Small tablets
md:  768px  → Tablets
lg:  1024px → Laptops
xl:  1280px → Desktops
2xl: 1536px → Large screens
```

## 🎨 Best Practices

### 1. **Use Semantic HTML**
```tsx
// ✅ Good
<Button type="submit">Submit</Button>

// ❌ Avoid
<div onClick={submit}>Submit</div>
```

### 2. **Consistent Spacing**
Use Tailwind's spacing scale:
- `gap-2`, `gap-4`, `gap-6` for flex/grid gaps
- `p-4`, `p-6` for padding
- `mb-2`, `mb-4` for margins

### 3. **Component Variants**
shadcn/ui components support variants:

```tsx
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
```

### 4. **Icons**
Use Lucide React consistently:

```tsx
import { Search, Check, X } from 'lucide-react'

<Search className="w-4 h-4" />
```

## 🔍 Troubleshooting

### Tailwind Classes Not Working
1. Check `tailwind.config.js` content paths
2. Restart dev server
3. Check for typos in class names

### Component Styling Issues
1. Use browser DevTools to inspect
2. Check for conflicting CSS
3. Ensure `cn()` utility is used correctly

### Performance Issues
1. Use React DevTools Profiler
2. Memoize heavy components
3. Optimize images

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## 🎨 Color Reference

```css
/* Primary Colors */
--primary: 250 84% 69%        /* Indigo/Purple */
--primary-foreground: White

/* Neutral Colors */
--background: White
--foreground: Dark Gray
--muted: Light Gray
--muted-foreground: Medium Gray

/* Semantic Colors */
--destructive: Red (errors)
--accent: Light Blue (highlights)
```

## 🚀 Quick Tips

1. **Use `cn()` for conditional classes:**
   ```tsx
   className={cn("base", condition && "conditional")}
   ```

2. **Leverage Tailwind's hover/focus states:**
   ```tsx
   className="hover:bg-primary focus:ring-2"
   ```

3. **Use component composition:**
   ```tsx
   <Card>
     <CardHeader>
       <CardTitle>Title</CardTitle>
     </CardHeader>
     <CardContent>Content</CardContent>
   </Card>
   ```

4. **Keep components small and focused:**
   - One component per file
   - Extract reusable parts
   - Use composition over props

---

Built with ❤️ using modern web technologies

