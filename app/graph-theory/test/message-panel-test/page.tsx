// src/app/graph-theory/test/page.tsx
'use client';

import { MessagePanel } from '@/components/graph-theory/MessagePanel';
import { Message, Feedback } from '@/types/graph-theory';
import { useState, useEffect } from 'react';
import { FeedbackForm } from '@/components/graph-theory/FeedbackForm';

const baseMessages: Omit<Message, 'timestamp'>[] = [
  {
    role: 'definitions',
    content: "Let's define our key concepts:\n- A graph G is a pair (V,E) where V is a set of vertices and E is a set of edges\n- An odd cycle is a cycle with odd length\n- The chromatic number χ(G) is the minimum number of colors needed to color G",
    type: 'definition'
  },
  {
    role: 'student',
    content: "Let's approach this step by step. First, we'll show that if odd cycles pairwise intersect, they must form a specific structure...",
    type: 'proof'
  },
  {
    role: 'teacher',
    content: "Good approach. Consider also what happens when we have three odd cycles that pairwise intersect. This will be key to proving χ(G) ≤ 5.",
    type: 'critique'
  },
  {
    role: 'student',
    content: "Here's a mathematical proof using LaTeX:\n\nLet $C_1$ and $C_2$ be odd cycles. Since they intersect at vertex $v$, we can say that $\\chi(G) \\leq 5$ because...",
    type: 'proof'
  }
];

export default function TestPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handleFeedbackSubmit = (feedback: Feedback) => {
    console.log('Feedback submitted:', feedback);
    // In real app, this would update the session status and save to backend
  };

  useEffect(() => {
    // Add timestamps on the client side
    const messagesWithTimestamps = baseMessages.map((msg, index) => ({
      ...msg,
      timestamp: Date.now() - (baseMessages.length - index) * 1000
    }));
    setMessages(messagesWithTimestamps);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Message Panel Test</h1>
      
      <div className="space-y-8">
        {/* Existing messages */}
        <div className="space-y-4">
          {messages.map((message, index) => (
            <MessagePanel 
              key={`${message.timestamp}-${index}`}
              message={message}
            />
          ))}
        </div>

        {/* Feedback form */}
        <div className="mt-8">
          <FeedbackForm
            sessionId="test-session"
            onSubmit={handleFeedbackSubmit}
          />
        </div>
      </div>
    </div>
  );
}