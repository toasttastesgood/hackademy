
import { Quiz, Question } from './QuizTypes';
import { isObject, isNonEmptyString } from './TypeGuards';
import { validateQuestion } from './QuestionValidators';

export function validateQuizPartial(quizData: unknown): {
 isValid: boolean;
 validQuiz?: Quiz;
 errors: string[];
} {
 const errors: string[] = [];
 if (!isObject(quizData)) {
   errors.push('Quiz data must be an object.');
   return { isValid: false, errors };
 }

 const id = quizData.id;
 const quizIdStr = isNonEmptyString(id) ? `'${id}'` : 'unknown';

 if (!isNonEmptyString(id)) errors.push(`Quiz ${quizIdStr}: Missing or empty 'id'.`);
 if (!isNonEmptyString(quizData.title)) errors.push(`Quiz ${quizIdStr}: Missing or empty 'title'.`);
 if (!isNonEmptyString(quizData.category)) errors.push(`Quiz ${quizIdStr}: Missing or empty 'category'.`);
 if (!Array.isArray(quizData.questions)) {
   errors.push(`Quiz ${quizIdStr}: 'questions' must be an array.`);
   return { isValid: false, errors };
 }

 if (errors.length > 0) {
   console.groupCollapsed(`Quiz Validation Failed: ${quizIdStr}`);
   errors.forEach(err => console.error(err));
   console.groupEnd();
   return { isValid: false, errors };
 }

 const validQuestions: Question[] = [];
 quizData.questions.forEach((q: any, index: number) => {
   const qErrors = validateQuestion(q);
   if (qErrors.length === 0) {
     validQuestions.push(q as Question);
   } else {
     console.warn(`Quiz ${quizIdStr}, Question ${index + 1}: ${qErrors.join('; ')}`);
   }
 });

 if (validQuestions.length === 0) {
   console.warn(`Quiz ${quizIdStr}: No valid questions found. Skipping quiz.`);
   return { isValid: false, errors: ['No valid questions'] };
 }

 const sanitizedQuiz: Quiz = {
   id: id as string,
   title: quizData.title as string,
   category: quizData.category as string,
   description: quizData.description as string | undefined,
   questions: validQuestions,
 };

 return { isValid: true, validQuiz: sanitizedQuiz, errors: [] };
}