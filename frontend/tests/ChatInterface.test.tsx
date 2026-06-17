// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInterface } from '../src/components/chat/ChatInterface';
import { useChat } from '../src/hooks/useChat';
import React from 'react';

// Stub scrollIntoView which is not defined in JSDom
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

// Mock the useChat hook
vi.mock('../src/hooks/useChat', () => ({
  useChat: vi.fn(),
}));

describe('ChatInterface Component', () => {
  const mockSendMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the chat interface container and form', () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      isStreaming: false,
    });

    render(<ChatInterface />);
    expect(screen.getByPlaceholderText('Ask me anything...')).toBeTruthy();
    expect(screen.getByRole('button', { name: /send message/i })).toBeTruthy();
  });

  it('displays existing chat messages correctly', () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [
        { id: '1', role: 'user', content: 'Hello Coach!' },
        { id: '2', role: 'assistant', content: 'Hello! How can I help you reduce carbon today?' },
      ],
      sendMessage: mockSendMessage,
      isStreaming: false,
    });

    render(<ChatInterface />);
    expect(screen.getByText('Hello Coach!')).toBeTruthy();
    expect(screen.getByText('Hello! How can I help you reduce carbon today?')).toBeTruthy();
  });

  it('submits user message and clears input when form is submitted', () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      isStreaming: false,
    });

    render(<ChatInterface />);
    const input = screen.getByPlaceholderText('Ask me anything...');
    const sendBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(input, { target: { value: 'My car commute is 50km' } });
    fireEvent.click(sendBtn);

    expect(mockSendMessage).toHaveBeenCalledWith('My car commute is 50km');
    expect(input.getAttribute('value')).toBe('');
  });

  it('disables input and button when streaming response is active', () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [{ id: '1', role: 'assistant', content: 'Typing...', isStreaming: true }],
      sendMessage: mockSendMessage,
      isStreaming: true,
    });

    render(<ChatInterface />);
    const input = screen.getByPlaceholderText('Ask me anything...') as HTMLInputElement;
    const sendBtn = screen.getByRole('button', { name: /send message/i }) as HTMLButtonElement;

    expect(input.disabled).toBe(true);
    expect(sendBtn.disabled).toBe(true);
    expect(screen.getByText('CarbonCoach is typing...')).toBeTruthy();
  });

  it('satisfies accessibility: verifies container has role="log" and aria-live="polite"', () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      isStreaming: false,
    });

    render(<ChatInterface />);
    const chatLog = screen.getByLabelText('Conversation with CarbonCoach');
    expect(chatLog.getAttribute('role')).toBe('log');
    expect(chatLog.getAttribute('aria-live')).toBe('polite');
  });

  it('satisfies accessibility: verifies streaming text has assertive aria-live region', () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [{ id: '1', role: 'assistant', content: 'Carbon emissions are...', isStreaming: true }],
      sendMessage: mockSendMessage,
      isStreaming: true,
    });

    render(<ChatInterface />);
    const streamingText = screen.getByText('Carbon emissions are...');
    expect(streamingText.getAttribute('aria-live')).toBe('assertive');
    expect(streamingText.getAttribute('aria-atomic')).toBe('true');
  });
});
