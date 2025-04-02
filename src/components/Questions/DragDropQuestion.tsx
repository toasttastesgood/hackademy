import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './DragDropQuestion.module.css';
import { QuestionComponentProps } from './types';

interface DraggableItem {
  id: string;
  text: string;
}

interface DragItem {
  id: string;
  originalIndex: number;
}

export interface DragDropQuestionProps extends QuestionComponentProps {
  question: QuestionComponentProps['question'] & {
    itemOrder: string[];
  };
}

const ItemTypes = {
  BOOT_STEP: 'boot_step'
};

const DraggableBootStep: React.FC<{
  id: string;
  text: string;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}> = ({ id, text, index, moveItem }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BOOT_STEP,
    item: { id, originalIndex: index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        moveItem(item.originalIndex, index);
      }
    },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.BOOT_STEP,
    hover(item: DragItem) {
      if (!ref.current) return;
      const dragIndex = item.originalIndex;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveItem(dragIndex, hoverIndex);
      item.originalIndex = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`${styles.draggableItem} ${isDragging ? styles.dragging : ''}`}
    >
      {text}
    </div>
  );
};

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const DragDropQuestion: React.FC<DragDropQuestionProps> = ({ 
  question, 
  onAnswer,
  disabled = false
}) => {
  const [items, setItems] = useState<DraggableItem[]>([]);

  useEffect(() => {
    // Shuffle the itemOrder array
    const shuffledItems = shuffleArray(question.itemOrder);

    // Set the shuffled items to state
    setItems(shuffledItems.map((text: string, index: number) => ({
      id: `item-${index}`,
      text
    })));
  }, [question.itemOrder]);

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    if (disabled) return;
    
    const dragItem = items[dragIndex];
    const newItems = [...items];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    setItems(newItems);

    // Convert back to text array for answer
    onAnswer(newItems.map(item => item.text));
  };

  return (
    <div className={styles.dragDropContainer}>
      <DndProvider backend={HTML5Backend}>
        {items.map((item, index) => (
          <DraggableBootStep
            key={item.id}
            id={item.id}
            text={item.text}
            index={index}
            moveItem={moveItem}
          />
        ))}
      </DndProvider>
    </div>
  );
};

export default DragDropQuestion;