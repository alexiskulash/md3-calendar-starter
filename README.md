# Material Design 3 Starter

A minimal, bare-bones starter application built exclusively with Material Design 3 web components. Perfect for prototyping new applications quickly with Google's official Material Design system.

## 🎨 Features

- **Material Design 3**: Built exclusively with official [@material/web](https://github.com/material-components/material-web) components
- **Modern Stack**: React 18 + Vite + TypeScript + Tailwind CSS
- **Material Theming**: Full MD3 color token system with light/dark mode support
- **Type Safe**: TypeScript declarations for all Material Web Components
- **Minimal & Clean**: Bare bones setup ready for rapid prototyping
- **Responsive**: Mobile-first design that works on all screen sizes

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📦 What's Included

### Material Design 3 Components

This starter includes TypeScript support for all Material Web Components:

**Buttons**

- `<md-filled-button>` - High-emphasis actions
- `<md-outlined-button>` - Medium-emphasis actions
- `<md-text-button>` - Low-emphasis actions
- `<md-elevated-button>` - Actions that need visual separation
- `<md-filled-tonal-button>` - Middle-ground emphasis

**Cards**

- `<md-elevated-card>` - Cards with shadow elevation
- `<md-filled-card>` - Cards with tonal background
- `<md-outlined-card>` - Cards with outline border

**Form Inputs**

- `<md-filled-text-field>` - Text inputs with filled style
- `<md-outlined-text-field>` - Text inputs with outlined style
- `<md-checkbox>` - Checkboxes
- `<md-radio>` - Radio buttons
- `<md-switch>` - Toggle switches
- `<md-slider>` - Range sliders
- `<md-filled-select>` / `<md-outlined-select>` - Dropdowns

**Other Components**

- `<md-icon>` - Material Icons
- `<md-fab>` - Floating action buttons
- `<md-chip>` variants - Chips for filters, inputs, etc.
- `<md-dialog>` - Modal dialogs
- `<md-list>` - Lists
- `<md-tabs>` - Tab navigation
- `<md-menu>` - Menus
- And many more...

## 🎨 Theming

The app uses Material Design 3's color token system. All colors are defined in `client/global.css`:

```css
:root {
  --md-sys-color-primary: 258 100% 62%;
  --md-sys-color-on-primary: 0 0% 100%;
  --md-sys-color-secondary: 258 30% 60%;
  /* ... and many more */
}
```

### Customizing Colors

1. Open `client/global.css`
2. Modify the HSL values in the `:root` selector
3. Update the `.dark` selector for dark mode colors

The color tokens are automatically mapped to Tailwind utilities through `tailwind.config.ts`.

## 📁 Project Structure

```
client/
├── pages/
│   ├── Index.tsx          # Homepage with MD3 components
│   └── NotFound.tsx       # 404 page
├── types/
│   └── material-web.d.ts  # TypeScript declarations for MD3
├── App.tsx                # App entry point and routing
└── global.css             # MD3 design tokens and Tailwind

tailwind.config.ts         # Tailwind config with MD3 tokens
index.html                 # HTML with Material Icons
```

## 💡 Usage Examples

### Using Material Buttons

```tsx
import "@material/web/button/filled-button.js";

function MyComponent() {
  return (
    <div>
      <md-filled-button>Primary Action</md-filled-button>
      <md-outlined-button>Secondary Action</md-outlined-button>
      <md-text-button>Tertiary Action</md-text-button>
    </div>
  );
}
```

### Using Material Cards

```tsx
import "@material/web/labs/card/elevated-card.js";

function MyCard() {
  return (
    <md-elevated-card style={{ width: "300px" }}>
      <div className="p-6">
        <h3>Card Title</h3>
        <p>Card content goes here</p>
      </div>
    </md-elevated-card>
  );
}
```

### Using Material Text Fields

```tsx
import "@material/web/textfield/filled-text-field.js";

function MyForm() {
  return (
    <md-filled-text-field
      label="Email"
      type="email"
      required
      supporting-text="Enter your email address"
    />
  );
}
```

### Using Material Icons

```tsx
import "@material/web/icon/icon.js";

function MyIcon() {
  return (
    <md-icon style={{ color: "hsl(var(--md-sys-color-primary))" }}>
      favorite
    </md-icon>
  );
}
```

## 🎯 Design Philosophy

This starter is intentionally **minimal and bare-bones** to serve as a clean foundation for prototyping. It includes:

✅ Material Design 3 web components and theming  
✅ TypeScript support for all MD3 components  
✅ Responsive layout with Tailwind CSS  
✅ Clean project structure

It does NOT include:
❌ State management (add Redux, Zustand, etc. as needed)  
❌ API client libraries (add Axios, TanStack Query, etc. as needed)  
❌ Authentication (add your preferred auth solution)  
❌ Database integrations (add as needed)

## 📚 Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material Web Components Documentation](https://github.com/material-components/material-web)
- [Material Icons](https://fonts.google.com/icons)
- [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/)

## 🛠️ Customization Tips

### Adding More Components

1. Find the component in the [Material Web docs](https://github.com/material-components/material-web)
2. Import it in your component:
   ```tsx
   import "@material/web/[component]/[component-name].js";
   ```
3. Use it in your JSX:
   ```tsx
   <md-component-name />
   ```

### Creating a Custom Theme

Use Google's [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/) to:

1. Pick your brand colors
2. Generate a complete color palette
3. Copy the generated tokens to `client/global.css`

### Adding Dark Mode Toggle

The theme tokens are already set up for dark mode. To add a toggle:

```tsx
function ThemeToggle() {
  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <md-filled-icon-button onClick={toggleDark}>
      dark_mode
    </md-filled-icon-button>
  );
}
```

## 📝 License

This starter is provided as-is for prototyping purposes. Material Design and Material Web Components are developed by Google.

## 🤝 Contributing

This is a starter template - fork it and make it your own! Feel free to customize it for your specific prototyping needs.
