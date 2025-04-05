# Theming System Documentation

This document explains the theming system used in the Hackademy Quiz App.

## Overview

The application utilizes a dynamic theming system allowing users to switch between different visual styles (Base Themes) and color schemes (Color Modes). This is primarily managed through:

1.  **`ThemeContext`:** (`src/contexts/ThemeContext.tsx`) - A React Context that holds the current `baseTheme` and `colorMode` state and provides functions (`setBaseTheme`, `setColorMode`) to update them. Components can consume this context using the `useTheme` hook.
2.  **CSS Variables:** (`src/Styles/global.css`) - Defines a comprehensive set of CSS custom properties (variables) for colors, spacing, typography, shadows, etc.
3.  **Data Attributes:** The root `<html>` element gets `data-theme` and `data-mode` attributes based on the current context state. These attributes are used in `global.css` to apply theme-specific and mode-specific variable overrides.
4.  **CSS Modules:** Component-specific styles (`*.module.css`) primarily use the globally defined CSS variables, ensuring they adapt automatically to theme changes.

## Core Concepts

### CSS Variables (`global.css`)

*   **Universal Variables:** Define base values for spacing, typography, borders, transitions, z-index, etc. (e.g., `--space-md`, `--font-size-base`, `--border-radius-md`). These are generally theme-agnostic.
*   **Structural Variables:** Define theme-specific structural properties, mainly shadows. Each base theme (`material`, `glass`, `neumorphic`) has its own set of shadow variables (e.g., `--shadow-dp-1`, `--neumorphic-shadow-raised`) which are then mapped to common shadow names (`--shadow-sm`, `--shadow-md`, `--card-shadow`, `--button-primary-shadow`). This section is selected using the `[data-theme]` attribute selector.
*   **Color Palettes:** Define the actual color values for *each combination* of base theme and color mode (e.g., `:root[data-theme="material"][data-mode="light"]`, `:root[data-theme="glass"][data-mode="dark"]`). This includes semantic color names (`--primary-color`, `--secondary-color`, `--bg-primary`, `--text-primary`, `--border-focus`, etc.) and component-specific color variables (`--card-bg`, `--button-primary-bg`, `--input-border`, etc.).

### Theme Context (`ThemeContext.tsx`)

*   Provides the `baseTheme` (e.g., 'material', 'glass', 'neumorphic') and `colorMode` (e.g., 'light', 'dark') state.
*   Applies the corresponding `data-theme` and `data-mode` attributes to the `<html>` element whenever the state changes.
*   Persists the selected theme and mode to `localStorage` so preferences are remembered across sessions.
*   Provides the `useTheme` hook for components to access the current theme state and setter functions.

### Component Styling (`*.module.css`)

*   Component styles should **always** prefer using the globally defined CSS variables (e.g., `background-color: var(--card-bg);`, `color: var(--text-primary);`).
*   This ensures components automatically adapt their appearance when the theme or mode changes without needing specific style overrides within the component's CSS module.
*   Exceptions might exist for highly component-specific layout or decorative styles that don't directly relate to the theme palette.

## Adding New Themes or Modes

1.  **Define Structural Variables (if needed):** If the new theme requires unique structural elements (like different shadow styles), add a new block in `global.css` selected by `[data-theme="new-theme-name"]` defining its structural variables (e.g., `--shadow-sm`, `--card-shadow`).
2.  **Define Color Palettes:** Add new blocks in `global.css` for the new theme/mode combinations (e.g., `:root[data-theme="new-theme-name"][data-mode="light"]`, `:root[data-theme="new-theme-name"][data-mode="dark"]`) defining all the color variables.
3.  **Update `ThemeContext.tsx`:**
    *   Add the new theme name to the `BaseTheme` type.
    *   Add the new mode name (if applicable) to the `ColorMode` type.
4.  **Update `AppearanceSettings.tsx`:** Add new buttons for selecting the new theme/mode.