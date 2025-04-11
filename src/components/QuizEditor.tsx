import React, { useState, useEffect, ChangeEvent } from "react";
import { Quiz, MCQQuestion, Question } from "../services/QuizTypes";
import Button from "./Button/Button";

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const LOCAL_STORAGE_KEY = "custom_quizzes";

function getInitialQuiz(): Quiz {
  return {
    id: generateId(),
    category: "",
    title: "",
    description: "",
    questions: [],
  };
}

function loadCustomQuizzes(): Quiz[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveCustomQuizzes(quizzes: Quiz[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quizzes));
}

const QuizEditor: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz>(getInitialQuiz());
  const [customQuizzes, setCustomQuizzes] = useState<Quiz[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  useEffect(() => {
    setCustomQuizzes(loadCustomQuizzes());
  }, []);

  // Quiz field handlers
  const handleFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  // Question handlers (MCQ only for MVP)
  const addMCQQuestion = () => {
    const newQuestion: MCQQuestion = {
      type: "mcq",
      text: "",
      correctAnswers: [""],
      wrongAnswers: [""],
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
    setSelectedQuestion(quiz.questions.length);
  };

  const updateQuestion = (idx: number, updated: Question) => {
    const questions = quiz.questions.slice();
    questions[idx] = updated;
    setQuiz({ ...quiz, questions });
  };

  const removeQuestion = (idx: number) => {
    const questions = quiz.questions.slice();
    questions.splice(idx, 1);
    setQuiz({ ...quiz, questions });
    setSelectedQuestion(null);
  };

  // Save to localStorage
  const saveQuiz = () => {
    let quizzes = loadCustomQuizzes();
    const existingIdx = quizzes.findIndex((q) => q.id === quiz.id);
    if (existingIdx !== -1) {
      quizzes[existingIdx] = quiz;
    } else {
      quizzes.push(quiz);
    }
    saveCustomQuizzes(quizzes);
    setCustomQuizzes(quizzes);
    alert("Quiz saved!");
  };

  // Export as JSON
  const exportQuiz = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quiz, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${quiz.title || "quiz"}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Import from JSON
  const importQuiz = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && imported.title && imported.questions) {
          setQuiz({ ...imported, id: generateId() });
          alert("Quiz imported! You can now edit and save it.");
        } else {
          alert("Invalid quiz file.");
        }
      } catch {
        alert("Failed to parse quiz file.");
      }
    };
    reader.readAsText(file);
  };

  // UI for editing MCQ questions
  const renderMCQEditor = (q: MCQQuestion, idx: number) => (
    <div style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
      <label>
        Question Text:
        <input
          type="text"
          value={q.text}
          onChange={(e) => updateQuestion(idx, { ...q, text: e.target.value })}
          style={{ width: "100%" }}
        />
      </label>
      <div>
        <strong>Correct Answers:</strong>
        {q.correctAnswers.map((ans, i) => (
          <div key={i}>
            <input
              type="text"
              value={ans}
              onChange={(e) => {
                const arr = q.correctAnswers.slice();
                arr[i] = e.target.value;
                updateQuestion(idx, { ...q, correctAnswers: arr });
              }}
            />
            <Button
              onClick={() => {
                const arr = q.correctAnswers.slice();
                arr.splice(i, 1);
                updateQuestion(idx, { ...q, correctAnswers: arr });
              }}
              disabled={q.correctAnswers.length === 1}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          onClick={() => updateQuestion(idx, { ...q, correctAnswers: [...q.correctAnswers, ""] })}
        >
          Add Correct Answer
        </Button>
      </div>
      <div>
        <strong>Wrong Answers:</strong>
        {q.wrongAnswers.map((ans, i) => (
          <div key={i}>
            <input
              type="text"
              value={ans}
              onChange={(e) => {
                const arr = q.wrongAnswers.slice();
                arr[i] = e.target.value;
                updateQuestion(idx, { ...q, wrongAnswers: arr });
              }}
            />
            <Button
              onClick={() => {
                const arr = q.wrongAnswers.slice();
                arr.splice(i, 1);
                updateQuestion(idx, { ...q, wrongAnswers: arr });
              }}
              disabled={q.wrongAnswers.length === 1}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          onClick={() => updateQuestion(idx, { ...q, wrongAnswers: [...q.wrongAnswers, ""] })}
        >
          Add Wrong Answer
        </Button>
      </div>
      <Button onClick={() => removeQuestion(idx)} style={{ marginTop: 8, background: "#e57373" }}>
        Delete Question
      </Button>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h2>Quiz Editor</h2>
      <div>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={quiz.title}
            onChange={handleFieldChange}
            style={{ width: "100%" }}
          />
        </label>
      </div>
      <div>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={quiz.category}
            onChange={handleFieldChange}
            style={{ width: "100%" }}
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            name="description"
            value={quiz.description}
            onChange={handleFieldChange}
            style={{ width: "100%" }}
          />
        </label>
      </div>
      <div style={{ margin: "16px 0" }}>
        <Button onClick={addMCQQuestion}>Add MCQ Question</Button>
      </div>
      <div>
        {quiz.questions.map((q, idx) =>
          q.type === "mcq" ? renderMCQEditor(q as MCQQuestion, idx) : null
        )}
      </div>
      <div style={{ margin: "16px 0" }}>
        <Button onClick={saveQuiz}>Save Quiz</Button>
        <Button onClick={exportQuiz} style={{ marginLeft: 8 }}>
          Export as JSON
        </Button>
        <label style={{ marginLeft: 8, display: "inline-block" }}>
          <input
            type="file"
            accept=".json,application/json"
            style={{ display: "none" }}
            onChange={importQuiz}
          />
          <Button type="button">Import from JSON</Button>
        </label>
      </div>
      <h3>Preview</h3>
      <div style={{ background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
        <strong>{quiz.title}</strong>
        <div>{quiz.description}</div>
        <div>
          <strong>Questions:</strong>
          <ol>
            {quiz.questions.map((q, idx) => (
              <li key={idx}>{q.text}</li>
            ))}
          </ol>
        </div>
      </div>
      <h3>Saved Quizzes</h3>
      <ul>
        {customQuizzes.map((qz) => (
          <li key={qz.id}>
            {qz.title} ({qz.category})
            <Button
              onClick={() => setQuiz({ ...qz })}
              style={{ marginLeft: 8 }}
            >
              Edit
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizEditor;