"use client";

import { useState, useEffect } from "react";
import { ProblemInput } from "@/components/graph-theory/ProblemInput";
import { MessagePanel } from "@/components/graph-theory/MessagePanel";
import { FeedbackForm } from "@/components/graph-theory/FeedbackForm";
import { Session, CreateSessionRequest, Feedback } from "@/types/graph-theory";

export default function GraphTheoryPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setupSSEConnection = (sessionId: string) => {
    const eventSource = new EventSource(
      `/api/graph-theory/session/${sessionId}`
    );

    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setSession((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, message],
            }
          : null
      );
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return eventSource;
  };

  // Cleanup effect for SSE connection
  useEffect(() => {
    let eventSource: EventSource | null = null;
    if (session?.id && session.status === "in-progress") {
      eventSource = setupSSEConnection(session.id);
    }
    return () => eventSource?.close();
  }, [session?.id, session?.status]);

  const handleCreateSession = async (request: CreateSessionRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/graph-theory/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      const data = await response.json();
      setSession(data.session);

      // Set up SSE connection once we have a session
      if (data.session.id) {
        setupSSEConnection(data.session.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedback: Feedback) => {
    try {
      const response = await fetch(`/api/graph-theory/session/${session?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback,
          status: "feedback-submitted",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const updatedSession = await response.json();
      setSession(updatedSession.session);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit feedback"
      );
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        What do you want to prove today?
      </h1>

      {!session && (
        <div className="mb-8">
          <ProblemInput onSubmit={handleCreateSession} isLoading={isLoading} />
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {session && (
        <div className="space-y-4">
          {/* Show the original problem */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="font-semibold text-gray-700 mb-2">Problem</h2>
            <p className="text-gray-600">{session.problem}</p>
          </div>

          {/* Message thread */}
          <div className="space-y-4">
            {session.messages.map((message, index) => (
              <MessagePanel
                key={`${message.timestamp}-${index}`}
                message={message}
              />
            ))}
          </div>

          {/* Loading indicator for new messages */}
          {session.status === "in-progress" && (
            <div className="flex justify-center py-4">
              <div className="animate-pulse flex space-x-4">
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          )}

          {/* Feedback Form */}
          {session.status === "proof-completed" && !session.feedback && (
            <div className="mt-8">
              <FeedbackForm
                sessionId={session.id}
                onSubmit={handleFeedbackSubmit}
                isSubmitting={isLoading}
              />
            </div>
          )}

          {/* Show submitted feedback */}
          {session.feedback && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Feedback Submitted
              </h3>
              <div className="text-green-700">
                <p>Score: {session.feedback.score}/4</p>
                {session.feedback.notes && (
                  <p className="mt-2">Notes: {session.feedback.notes}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
