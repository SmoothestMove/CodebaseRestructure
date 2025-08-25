import React from 'react';
import { PlannerBoard } from '@/features/planner-enhanced';

const PlannerPage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-6rem)] -mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
      <PlannerBoard 
        showGlobalSettings={true}
        showSearch={true}
        className="w-full h-full"
      />
    </div>
  );
};

export default PlannerPage;