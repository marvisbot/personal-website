// src/components/graph-theory/FeedbackForm.tsx

import { useState } from 'react';
import { Feedback } from '@/types/graph-theory';

interface FeedbackFormProps {
  sessionId: string;
  onSubmit: (feedback: Feedback) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const SCORE_DESCRIPTIONS = {
  4: 'Complete with no mistakes',
  3: 'Nearly correct or essentially correct, may overlook a special case or significant detail',
  2: 'On the right track, but may contain a fatal flaw or leave out substantial detail',
  1: 'Demonstrates an attempt at the problem, however misguided'
} as const;

export const FeedbackForm = ({
  sessionId,
  onSubmit,
  onCancel,
  isSubmitting = false
}: FeedbackFormProps) => {
  const [score, setScore] = useState<1 | 2 | 3 | 4>(4);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      score,
      notes: notes.trim(),
      timestamp: Date.now()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Rate this proof
      </h2>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Score</span>
          <select
            value={score}
            onChange={(e) => setScore(Number(e.target.value) as 1 | 2 | 3 | 4)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 text-gray-800"
            disabled={isSubmitting}
          >
            {Object.entries(SCORE_DESCRIPTIONS).reverse().map(([value, description]) => (
              <option key={value} value={value}>
                {value}/4 - {description}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Notes (Optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific mistakes or counterexamples? Additional feedback?"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md text-sm font-medium text-white
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
};