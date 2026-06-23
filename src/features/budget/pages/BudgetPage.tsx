// @ts-nocheck
import React from 'react';
import Budgeting from '../components/Budgeting';

const BudgetPage: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-300">
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Budgeting />
        </div>
      </main>
    </div>
  );
};

export default BudgetPage;

