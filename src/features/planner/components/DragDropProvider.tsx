import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { PlannerState, PlannerTask } from '../types';

interface DragDropProviderProps {
  children: React.ReactNode;
  plannerData: PlannerState;
  onDragEnd: (result: DropResult) => void;
}

const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
  plannerData,
  onDragEnd
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {children}
    </DragDropContext>
  );
};

export default DragDropProvider;