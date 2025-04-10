import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from 'react-dnd'; // Added DropTargetMonitor
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './DragDropQuestion.module.css';
import reviewStyles from '../QuizPlayer.module.css';
import { QuestionComponentProps } from './types';

interface DraggableItemUI {
  id: string;
  text: string;
}

interface DragItemInternal {
  id: string;
  originalIndex: number;
}

export interface DragDropQuestionProps extends QuestionComponentProps {
  question: QuestionComponentProps['question'] & {
    itemOrder: string[]; // The correct order
  };
}

const ItemTypes = {
  BOOT_STEP: 'boot_step'
};

// --- Draggable Item Sub-component ---
const DraggableBootStep: React.FC<{
  id: string;
  text: string;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  // Feedback props
  isCorrect?: boolean | null;
  isShowingFeedback?: boolean;
  isAnswerLocked?: boolean; // Added lock state
}> = ({ id, text, index, moveItem, isCorrect, isShowingFeedback, isAnswerLocked }) => {
  const ref = useRef<HTMLDivElement>(null); // Corrected useRef usage

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BOOT_STEP,
    item: { id, originalIndex: index } as DragItemInternal,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    // Disable dragging if feedback is showing or answer is locked
    canDrag: !isShowingFeedback && !isAnswerLocked,
  });

  const [, drop] = useDrop( // Corrected hook usage
    () => ({
      accept: ItemTypes.BOOT_STEP,
      hover: (item: unknown, monitor: DropTargetMonitor) => { // Correct signature
        // Type assertion for the dragged item
        const dragItem = item as DragItemInternal;
        // Disable hover effect if feedback is showing or answer is locked
        if (!ref.current || isShowingFeedback || isAnswerLocked) return;
        const dragIndex = dragItem.originalIndex;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        moveItem(dragIndex, hoverIndex);
        dragItem.originalIndex = hoverIndex;
      },
      // canDrop should be a function
      canDrop: () => !isShowingFeedback && !isAnswerLocked,
    }),
    [isShowingFeedback, isAnswerLocked, index, moveItem] // Add dependencies for the factory function
  );

  drag(drop(ref)); // Connect drag and drop refs

  // Determine CSS class based on feedback/lock state
  let itemClass = `${styles.draggableItem}`;
  if (isDragging) {
    itemClass += ` ${styles.dragging}`;
  } else if (isShowingFeedback || isAnswerLocked) { // Show feedback styles if timer active OR locked
    // 'isCorrect' determines if this item is in the correct slot *for this index*
    itemClass += ` ${isCorrect === true ? reviewStyles.optionSelectedCorrect : isCorrect === false ? reviewStyles.optionSelectedIncorrect : ''}`;
  }

  return (
    <div ref={ref} className={itemClass}>
      {text}
    </div>
  );
};

// --- Fisher-Yates shuffle algorithm ---
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Main DragDropQuestion Component ---
const DragDropQuestion: React.FC<DragDropQuestionProps> = ({
  question,
  onAnswer,
  disabled = false, // Use disabled passed from QuizQuestionCard
  currentAnswer, // Should be string[] or null
  isShowingFeedback = false,
  correctAnswerValue = null, // Should be string[] (the correct itemOrder)
  instantFeedbackEnabled = false,
  isAnswerLocked = false,
}) => {

  // Initialize state based on currentAnswer or shuffle if none provided
  const [items, setItems] = useState<DraggableItemUI[]>(() => {
    const correctOrder = question.itemOrder;
    const isValidAnswer = Array.isArray(currentAnswer) &&
                          currentAnswer.length === correctOrder.length &&
                          currentAnswer.every(item => typeof item === 'string');
    const initialOrder = isValidAnswer
      ? currentAnswer as string[]
      : shuffleArray(correctOrder);
    return initialOrder.map((text: string, index: number) => ({
      id: `item-${text}-${index}-${Math.random().toString(36).substring(7)}`,
      text
    }));
  });

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    // Use the disabled prop passed down
    if (disabled) return;

    const dragItem = items[dragIndex];
    const newItems = [...items];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    setItems(newItems);
    onAnswer(newItems.map(item => item.text));
  };

  return (
    <div className={styles.dragDropContainer}>
      <DndProvider backend={HTML5Backend}>
        {items.map((item, index) => {
          // Determine correctness for this specific item during feedback/lock
          let itemCorrectness: boolean | null = null;
          if ((isShowingFeedback || isAnswerLocked) && Array.isArray(correctAnswerValue)) {
            // Check if the item's text matches the text at the correct position *in the correct order array*
            itemCorrectness = item.text === correctAnswerValue[index];
          }

          return (
            <DraggableBootStep
              key={item.id}
              id={item.id}
              text={item.text}
              index={index}
              moveItem={moveItem}
              // Pass feedback/lock state down
              isShowingFeedback={isShowingFeedback}
              isCorrect={itemCorrectness}
              isAnswerLocked={isAnswerLocked} // Pass lock state
            />
          );
        })}
      </DndProvider>
    </div>
  );
};

export default DragDropQuestion;