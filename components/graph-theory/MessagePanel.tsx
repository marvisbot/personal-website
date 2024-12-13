// src/components/graph-theory/MessagePanel.tsx

import { Message, MessageRole } from '@/types/graph-theory';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MessagePanelProps {
  message: Message;
}

const getRoleIcon = (role: MessageRole): string => {
  switch (role) {
    case 'student':
      return '👨‍🎓';
    case 'teacher':
      return '👩‍🏫';
    case 'definitions':
      return '📚';
    default:
      return '💭';
  }
};

const getRoleColor = (role: MessageRole): string => {
  switch (role) {
    case 'student':
      return 'bg-blue-50 border-blue-200';
    case 'teacher':
      return 'bg-green-50 border-green-200';
    case 'definitions':
      return 'bg-purple-50 border-purple-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

export const MessagePanel = ({ message }: MessagePanelProps) => {
  const roleColor = getRoleColor(message.role);
  
  return (
    <div className="flex gap-4 p-4">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white border">
        <span className="text-2xl" role="img" aria-label={message.role}>
          {getRoleIcon(message.role)}
        </span>
      </div>
      
      <div className={`flex-grow rounded-lg border p-4 ${roleColor}`}>
        <div className="text-sm text-gray-500 mb-2">
          {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
          {message.type !== 'default' && (
            <span className="ml-2 px-2 py-1 rounded-full text-xs bg-white">
              {message.type}
            </span> 
          )}
        </div>
        
        <div className="prose prose-sm max-w-none text-gray-800">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code: ({ node, inline, className, children, ...props }) => {
                return (
                  <code
                    className={`${inline ? 'text-sm bg-gray-100 rounded px-1' : 'block bg-gray-100 p-2 rounded'} ${className || ''}`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        <div className="text-xs text-gray-400 mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};