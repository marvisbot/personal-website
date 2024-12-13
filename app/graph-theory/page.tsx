'use client';

import { useState } from 'react';
import { ProblemInput } from '@/components/graph-theory/ProblemInput';
import { Session, CreateSessionRequest } from '@/types/graph-theory';

export default function GraphTheoryPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateSession = async (request: CreateSessionRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/graph-theory/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      
      const data = await response.json();
      setSession(data.session);

      // Set up SSE connection once we have a session
      if (data.session.id) {
        const eventSource = new EventSource(`/api/graph-theory/session/${data.session.id}`);
        
        eventSource.onmessage = (event) => {
          const message = JSON.parse(event.data);
          setSession(prev => prev ? {
            ...prev,
            messages: [...prev.messages, message]
          } : null);
        };

        eventSource.onerror = () => {
          eventSource.close();
        };
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        What do you want to prove today?
      </h1>

      {!session && (
        <ProblemInput onSubmit={handleCreateSession} isLoading={isLoading} />
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {session && (
        <div className="mt-8">
          {/* We'll add MessagePanel component here later */}
          <pre className="bg-gray-100 p-4 rounded-md">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}