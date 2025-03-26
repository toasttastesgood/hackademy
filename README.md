# Hackademy - Cybersecurity Learning Platform

A Quizlet-style web application for learning cybersecurity and penetration testing concepts, built with React and TypeScript.

## Features

- 🚀 React-based frontend with TypeScript
- 📚 Quiz data stored in JSON files organized by categories
- 🔍 Browse available quizzes by category
- 🎯 Take interactive quizzes with multiple question types
- 📊 Track progress locally in the browser
- 🎨 Responsive design with clean UI

## Current Progress

### Implemented Features
- Quiz browser interface
- Quiz player with multiple question types (MCQ, True/False)
- Local state management using React Context
- Routing between views
- Basic styling and responsive layout

### Technical Stack
- React 18
- TypeScript
- Vite
- React Router
- CSS Modules

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

## Project Structure

```
hackademy/
├── quizzes/                # Quiz data in JSON format
│   ├── web-application/    # Web security quizzes
│   └── network-security/   # Network security quizzes
├── src/
│   ├── components/         # React components
│   ├── context/            # State management
│   ├── App.tsx             # Main application
│   └── main.tsx            # Entry point
```

## Future Improvements
- Add more quiz categories
- Implement user authentication
- Add progress tracking
- Include code snippet questions
- Add quiz scoring and leaderboards
