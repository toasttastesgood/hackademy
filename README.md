# Hackademy Quiz App

[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Fast-yellowgreen?logo=vite)](https://vitejs.dev/)
[![CSS Modules](https://img.shields.io/badge/CSS-Modules-blueviolet)](https://github.com/css-modules/css-modules)

An interactive quiz application built with React and TypeScript, designed to test knowledge across various technical domains. Features a dynamic theming system and supports multiple question types.

## ✨ Key Features

*   **Interactive Quiz Player:** Take quizzes with various question types (MCQ, True/False, Hex Selection, etc.).
*   **Quiz Review:** Detailed review screen showing your answers, correct answers, and explanations.
*   **Dashboard:** Track overall progress and view category summaries.
*   **Quiz Browser:** Browse available quizzes by category.
*   **Dynamic Theming:** Switch between Material, Glass, and Neumorphic base themes, with Light/Dark mode support for each.
*   **Settings:** Configure theme preferences, toggle quiz validation, and reset progress.
*   **Responsive Design:** Adapts to different screen sizes.
*   **Type-Safe Codebase:** Built with TypeScript for enhanced maintainability.
*   **Component-Based Architecture:** Organized using reusable React components.

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (or yarn/pnpm)

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd hackademy
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

### Running the Development Server

```bash
npm run dev
# or
# yarn dev
# or
# pnpm dev
```

This will start the Vite development server, typically available at `http://localhost:5173`.

## 🛠️ Tech Stack

*   **Frontend Framework:** [React](https://reactjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Routing:** [React Router DOM](https://reactrouter.com/)
*   **Styling:** CSS Modules, CSS Variables
*   **State Management:** React Context API (`ThemeContext`, `QuizProvider`)

## 📁 Project Structure

```
/
├── public/             # Static assets
├── quizzes/            # Quiz data files (JSON)
│   ├── fundamentals/
│   └── ...             # Other categories
├── src/
│   ├── assets/         # Images, icons
│   ├── components/     # Reusable React components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── HexView/
│   │   ├── Layout/
│   │   ├── Progress/
│   │   ├── Questions/  # Specific question type renderers
│   │   ├── Sidebar/
│   │   ├── Topbar/
│   │   ├── AppearanceSettings.tsx
│   │   ├── CategoryView.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DataValidationSettings.tsx
│   │   ├── QuizBrowser.tsx
│   │   ├── QuizPlayer.tsx
│   │   ├── QuizQuestionCard.tsx
│   │   ├── QuizReview.tsx
│   │   ├── QuizReviewItem.tsx
│   │   └── SettingsPage.tsx
│   ├── contexts/       # React Context providers
│   │   ├── QuizProvider.tsx
│   │   └── ThemeContext.tsx
│   ├── services/       # Business logic, utilities
│   │   ├── QuestionTypeRegistry.ts
│   │   └── QuizValidator.ts
│   ├── Styles/         # Global styles and theme variables
│   │   └── global.css
│   ├── App.tsx         # Main application component, routing setup
│   ├── main.tsx        # Application entry point
│   └── ...             # Other config/type files
├── .gitignore
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML entry point
├── package.json
├── README.md           # This file
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 🎨 Theming

The application features a dynamic theming system controlled by `src/contexts/ThemeContext.tsx` and defined in `src/Styles/global.css`.

*   **Base Themes:** Material, Glass, Neumorphic
*   **Color Modes:** Light, Dark

CSS variables are used extensively, allowing themes to override base styles and component-specific styles. See `docs/THEMING.md` for more details (TODO: Create this file).

## ❓ Quiz Format

Quizzes are defined as JSON files within the `/quizzes` directory, organized by category. The structure and validation rules are defined in `src/services/QuizValidator.ts`. Various question types are supported, with rendering logic handled by components in `src/components/Questions/` and registered in `src/services/QuestionTypeRegistry.ts`. See `docs/QUIZZES.md` for more details (TODO: Create this file).

## 🤝 Contributing

Contributions are welcome! Please follow standard fork/pull request workflows. (TODO: Add more detailed contribution guidelines).

## 📄 License

(TODO: Add License - e.g., MIT License)
