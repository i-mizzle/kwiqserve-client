# Kwiqserve Client - AI Coding Agent Instructions

## Project Overview
This is a React 19.2 + Vite 7 client application for Kwiqserve. The project uses modern React patterns with ES modules, TailwindCSS for styling, and React Router v6 for navigation.

## Tech Stack
- **Framework**: React 19.2 with StrictMode enabled
- **Build Tool**: Vite 7.2.4 with HMR and Fast Refresh
- **Styling**: TailwindCSS 3.x with custom color palette and Google Fonts
- **Routing**: React Router v6 (BrowserRouter)
- **Linting**: ESLint 9 with flat config format (eslint.config.js)
- **Language**: JavaScript (JSX) - TypeScript is NOT used

## File Structure & Conventions

### Directory Structure
```
src/
├── main.jsx           # App entry point
├── App.jsx            # Root router component
├── index.css          # Global Tailwind imports + custom styles
├── pages/             # Route components (Home, About, Contact)
│   ├── Home.jsx
│  React Router imports
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'

// CSS imports before component imports
import './index.css'
import App from './App.jsx'

// Always include .jsx extension in local imports
import Home from './pages/Home.jsx'  // ✓ Correct

// Public assets use absolute paths from root
import viteLogo from '/vite.svg'
// Bundled assets use relative paths
import reactLogo from './assets/react.svg'
```

### Routing Pattern (React Router v6)
- `<App />` wraps routes in `<BrowserRouter>` (see [src/App.jsx](../src/App.jsx))
- Page components live in `src/pages/` directory
- Use `<Link>` for internal navigation, not `<a>` tags
- Route structure: `<Routes>` contains `<Route path="..." element={<Component />} />
### Import Patterns
```jsx
// CSS imports before component imports
import './index.css'
import App from './App.jsx'

// Include .jsx extension in local imports
import App from './App.jsx'  // ✓ Correct

// Public assets use absolute paths from root
import viteLogo from '/vite.svg'
// Asset imports use relative paths
import reactLogo from './assets/react.svg'
```

### ESLint Configuration
- Uses **flat config format** (eslint.config.js, NOT .eslintrc)
- Custom rule: `no-unused-vars` allows uppercase variables/constants (e.g., `VITE_API_URL`)
- React Hooks rules enforced via `eslint-plugin-react-hooks`
- React Refresh rules for proper HMR behavior
- Ignores: `dist/` directory

## Development Workflow

### Commands (from package.json)
```bash
npm run dev      # Start dev server (Vite with HMR)
npm run build    # Production build
npm run lint     # Run ESLint

### TailwindCSS Configuration
- **Config**: [tailwind.config.js](../tailwind.config.js) with custom color palette
- **Content paths**: `./index.html` and `./src/**/*.{js,jsx}`
- **PostCSS**: [postcss.config.js](../postcss.config.js) includes Tailwind + Autoprefixer

### Custom Color Palette (in tailwind.config.js)
```js
colors: {
  primary: '#3B82F6',      // Blue
  secondary: '#8B5CF6',    // Purple
  'dark-gray': '#1F2937',  // Dark gray for backgrounds
  'light-gray': '#E5E7EB', // Light gray for backgrounds
  accent: '#F59E0B',       // Orange/Amber accent
  white: '#FFFFFF',        // Whiteand `useContext` (no external state library)
- No global state management configured (Redux, Zustand, etc.)
- For navigation state, use React Router's `useNavigate`, `useLocation`, `useParams`

### Routing
- React Router v6 with `<BrowserRouter>` in [src/App.jsx](../src/App.jsx)
- Pages in `src/pages/` directory (Home, About, Contact)
- Navigation: Use `<Link to="/path">` component, not anchor tags
- Programmatic navigation: `const navigate = useNavigate(); navigate('/path')`
```
Use these in classes: `bg-primary`, `text-secondary`, `border-accent`, etc.

### Typography
- **Google Fonts**: Stack Sans Headline & Outfit loaded via @import in [src/index.css](../src/index.css)
- **Font families** (in tailwind.config.js):
  - `font-stack-sans-pro`: Stack Sans Headline (body text)
  - `font-outfit`: Outfit (for headings)
- **Usage**: `<h1 className="font-outfit">` for headings, body defaults to Stack Sans Headline
Pages (Route Components)
1. Create `PageName.jsx` in `src/pages/` directory
2. Use Tailwind classes for styling
3. Import and use `<Link>` from `react-router-dom` for navigation
4. Add route to [src/App.jsx](../src/App.jsx): `<Route path="/page" element={<PageName />} />`
5. Use `.jsx` extension in import: `import PageName from './pages/PageName.jsx'`

### New Components (Reusable)
1. Create in `src/components/` directory (create if needed)
2. Use Tailwind utility classes for styling
3. Default export: `export default ComponentName`
4. Import with `.jsx` extension

### Styling New Elements
- Use Tailwind utility classes: `className="bg-primary text-white p-4 rounded-lg"`
- Custesting framework configured (Jest, Vitest, etc. not present)
- No API/backend integration visible in current codebase
- No global state management - add if needed for complex state sharing
- Color palette uses placeholder values - update colors in [tailwind.config.js](../tailwind.config.js) as needed:text-white`
### Styling Best Practices
- **Prefer Tailwind utility classes** over custom CSS
- Global styles in [src/index.css](../src/index.css) (Tailwind directives at top)
- Component-specific styles: only create separate CSS files if absolutely necessary
- Responsive design: use Tailwind's responsive prefixes (`md:`, `lg:`, etc.)y 5173)
- HMR is automatic - test by editing [src/App.jsx](../src/App.jsx)
- No separate backend server configured in this repo

## Styling Approach
- **CSS-only** (no CSS-in-JS, Tailwind, or preprocessors)
- Global styles in [src/index.css](../src/index.css) (theme variables, resets)
- Component-specific styles in co-located `.css` files
- Color scheme: Supports both light and dark modes via CSS `prefers-color-scheme`
- CSS custom properties in `:root` for theming

## Critical Patterns

### React 19 Specifics
- Uses `createRoot` from `react-dom/client` (React 18+ API)
- StrictMode enabled in production - components may mount/unmount twice in dev
- React Compiler is NOT enabled (per README.md)

### State Management
- Currently uses React's built-in `useState` (no external state library)
- No global state management configured (Redux, Zustand, etc.)

### Public Assets
- Public assets referenced from HTML: `/vite.svg` in [public/](../public/)
- Assets imported in JS: `./assets/` for bundled resources

## When Adding Features

### New Components
1. Create `ComponentName.jsx` in `src/` (or subdirectory)
2. Create matching `ComponentName.css` for styles
3. Use default export: `export default ComponentName`
4. Import with `.jsx` extension

### Environment Variables
- Vite env vars use `VITE_` prefix (e.g., `import.meta.env.VITE_API_URL`)
- No `.env` file currently in repo

### Testing
- No test framework configured (Jest, Vitest, etc. not present)

## Known Constraints
- JavaScript only - avoid TypeScript syntax
- No routing library configured (React Router, etc.)
- No API/backend integration visible in current codebase
- Minimal starter template - expects significant expansion
