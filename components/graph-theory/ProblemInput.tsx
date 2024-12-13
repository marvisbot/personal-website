// src/components/graph-theory/ProblemInput.tsx

import { useState } from 'react';
import { CreateSessionRequest } from '@/types/graph-theory';

interface ProblemInputProps {
  onSubmit: (request: CreateSessionRequest) => void;
  isLoading?: boolean;
}

export const ProblemInput = ({ onSubmit, isLoading = false }: ProblemInputProps) => {
  const [problem, setProblem] = useState('');
  const [showSteps, setShowSteps] = useState(true);

  const handleSubmit = () => {
    if (!problem.trim()) return;
    onSubmit({
      problem: problem.trim(),
      showSteps
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="show-steps"
            checked={showSteps}
            onChange={(e) => setShowSteps(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="show-steps" className="text-sm text-gray-700">
            Show step-by-step solution process
          </label>
        </div>

        <div>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Enter your graph theory problem (e.g., 'Prove that if G is a graph whose odd cycles pairwise intersect, then χ(G) ≤ 5.'). Feel free to enter latex."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !problem.trim()}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${isLoading || !problem.trim() 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }
          `}
        >
          {isLoading ? 'Processing...' : 'Solve Problem'}
        </button>
      </div>
    </div>
  );
};