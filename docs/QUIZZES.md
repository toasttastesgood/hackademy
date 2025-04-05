# Quiz Format Documentation

This document describes the JSON format used for defining quizzes and questions in the Hackademy Quiz App.

## Overview

Quizzes are stored as individual JSON files within the `/quizzes` directory, organized into subdirectories by category (e.g., `/quizzes/fundamentals/`, `/quizzes/networking/`).

The structure and validation rules for these files are primarily defined in `src/services/QuizValidator.ts`.

## Quiz File Structure (`Quiz` Interface)

Each JSON file represents a single quiz and should conform to the `Quiz` interface:

```typescript
interface Quiz {
  id: string;             // Unique identifier for the quiz (e.g., "fundamentals_cpu_001")
  category: string;       // Category name (should match directory name)
  title: string;          // Display title of the quiz
  description?: string;    // Optional longer description
  questions: Question[];  // Array of question objects (see below)
}
```

**Example (`quiz.json`):**

```json
{
  "id": "networking_basics_001",
  "category": "networking",
  "title": "Networking Fundamentals",
  "description": "Test your basic understanding of networking concepts.",
  "questions": [
    // ... Question objects go here ...
  ]
}
```

## Question Structure (`Question` Union Type)

The `questions` array contains objects, each representing a single question. The specific structure depends on the `type` property. All questions share a `BaseQuestion` interface:

```typescript
interface BaseQuestion {
  text: string;           // The main text/prompt of the question
  explanation?: string;    // Optional explanation shown during review
  difficulty?: 'easy' | 'medium' | 'hard'; // Optional difficulty level
}
```

The `Question` type is a union of specific question type interfaces, all extending `BaseQuestion`.

### 1. Multiple Choice (`mcq`)

```typescript
interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  correctAnswers: string[]; // Array of one or more correct answer strings
  wrongAnswers: string[];   // Array of incorrect answer strings
}
```

**Example:**

```json
{
  "type": "mcq",
  "text": "Which protocol operates at the Transport Layer?",
  "correctAnswers": ["TCP", "UDP"],
  "wrongAnswers": ["IP", "HTTP", "Ethernet"],
  "explanation": "TCP and UDP are the primary Transport Layer protocols in the TCP/IP suite."
}
```

### 2. True/False (`true_false`)

```typescript
interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  correctAnswers: boolean[]; // Array containing exactly ONE boolean (true or false)
  options?: string[];        // Optional: Custom labels like ["Yes", "No"] (defaults to "True"/"False")
}
```

**Example:**

```json
{
  "type": "true_false",
  "text": "HTTP is a stateless protocol.",
  "correctAnswers": [true],
  "explanation": "HTTP is inherently stateless, meaning each request is independent."
}
```

### 3. Highlighted Bytes (`highlighted_bytes`)

Used for questions involving selecting highlighted regions within a hex dump.

```typescript
interface HighlightedBytesQuestion extends BaseQuestion {
  type: 'highlighted_bytes';
  hexDump: string;          // Hex dump string (e.g., "4500 003c ...")
  highlightedRanges: Array<{ // Defines the clickable regions
    start: number;          // Start offset (0-based index in the raw bytes)
    length: number;         // Length of the highlighted region in bytes
    color?: string;         // Optional highlight color (CSS color value)
  }>;
  correctAnswers: string[]; // Array of correct answer strings (matching the text content of correct ranges)
  wrongAnswers: string[];   // Array of incorrect answer strings (matching text of incorrect ranges)
  bytesPerLine?: number;   // Optional: Bytes per line for HexView rendering (defaults to 16)
}
```

*(Requires `HexView` and `HighlightedBytesQuestion` components for rendering)*

### 4. Hex Selection (`hex_selection`)

Used for questions requiring the user to click a specific byte offset within a hex dump.

```typescript
interface HexSelectionQuestion extends BaseQuestion {
  type: 'hex_selection';
  hexDump: string;          // Hex dump string
  correctOffset: number;    // The correct 0-based byte offset the user must select
  fieldLength: number;      // Length of the field being identified (for visual feedback, usually 1)
  bytesPerLine?: number;   // Optional: Bytes per line for HexView rendering (defaults to 16)
}
```

*(Requires `HexView` and `HexSelectionQuestion` components for rendering)*

### 5. Drag and Drop (`drag_drop`)

Used for ordering items correctly.

```typescript
interface DragDropQuestion extends BaseQuestion {
  type: 'drag_drop';
  items: string[];        // Array of items to be ordered (presented shuffled)
  itemOrder: string[];    // Array containing the same items in the CORRECT order
}
```

*(Requires `DragDropQuestion` component for rendering)*

## Validation

The `src/services/QuizValidator.ts` file contains the `validateQuiz` function which performs checks on the structure and types of the loaded JSON data according to the interfaces defined above. Errors are logged to the console if validation fails (and `validateQuizzesEnabled` is true in settings).

## Question Rendering

The `src/services/QuestionTypeRegistry.ts` maps question `type` strings to their corresponding React components located in `src/components/Questions/`. The `QuizPlayer` uses this registry to dynamically render the correct input component for each question.