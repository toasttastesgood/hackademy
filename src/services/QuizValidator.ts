import { z } from "zod";

interface ValidationError {
  path: (string | number)[];
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  data?: unknown;
}

const baseQuestionSchema = z.object({
  text: z.string().min(10, "Question text must be at least 10 characters"),
  explanation: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional()
});

const mcqSchema = baseQuestionSchema.extend({
  type: z.literal("mcq"),
  correctAnswers: z.array(z.string().min(1)).min(1, "At least one correct answer required"),
  wrongAnswers: z.array(z.string().min(1)).min(1, "At least one wrong answer required")
});

const trueFalseSchema = baseQuestionSchema.extend({
  type: z.literal("true_false"),
  correctAnswer: z.boolean()
});

const highlightedBytesSchema = baseQuestionSchema.extend({
  type: z.literal("highlighted_bytes"),
  hexDump: z.string().regex(/^([0-9a-fA-F]{2}\s)+$/, "Invalid hex dump format"),
  highlightedRanges: z.array(
    z.object({
      start: z.number().min(0),
      length: z.number().min(1),
      color: z.string().optional()
    })
  ),
  correctAnswers: z.array(z.string()).min(1),
  wrongAnswers: z.array(z.string()).min(1)
});

export const quizSchema = z.object({
  id: z.string().min(3, "ID must be at least 3 characters"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  category: z.string().min(3, "Category must be at least 3 characters"),
  questions: z.array(
    z.union([mcqSchema, trueFalseSchema, highlightedBytesSchema])
  ).min(1, "At least one question required")
});

export type Quiz = z.infer<typeof quizSchema>;
export type Question = Quiz["questions"][number];

export function validateQuiz(quizData: unknown): ValidationResult {
  const quizObj = typeof quizData === 'object' ? quizData as Record<string, unknown> : {};
  try {
    const result = quizSchema.safeParse(quizData);
    if (!result.success) {
      console.groupCollapsed(`Quiz Validation Errors - ${quizObj.id || 'unknown'}`);
      result.error.errors.forEach(err => {
        console.error(`Path: ${err.path.join('.')}`, err.message);
      });
      console.groupEnd();
      return { valid: false, errors: result.error.errors };
    }
    return {
      valid: true,
      data: result.data,
      errors: []
    };
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return {
      valid: false,
      errors: [{
        path: [],
        message: e instanceof Error ? e.message : "Invalid JSON format"
      }],
      data: undefined
    };
  }
}