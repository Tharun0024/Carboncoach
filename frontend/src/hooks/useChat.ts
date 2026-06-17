import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/types';
import { chatApi } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = sessionStorage.getItem('carboncoach_session_id');
      if (!id) {
        id = uuidv4();
        sessionStorage.setItem('carboncoach_session_id', id);
      }
      setSessionId(id);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    let currentSessionId = sessionId;
    if (!currentSessionId && typeof window !== 'undefined') {
      currentSessionId = sessionStorage.getItem('carboncoach_session_id') || uuidv4();
      sessionStorage.setItem('carboncoach_session_id', currentSessionId);
    }
    currentSessionId = currentSessionId || 'default-session';

    const userMessage: Message = { id: uuidv4(), role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);

    const assistantMessageId = uuidv4();
    let fullResponse = '';

    try {
      const stream = await chatApi.stream(content, currentSessionId);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: fullResponse, isStreaming: true },
            ];
          }
          return [
            ...prev,
            { id: assistantMessageId, role: 'assistant', content: fullResponse, isStreaming: true },
          ];
        });
      }
    } catch (error) {
      console.error("Chat streaming error:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
    }
  }, []);

  return { messages, sendMessage, isStreaming };
}
