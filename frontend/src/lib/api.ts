// This file is the ONLY place where fetch() should be called.
// It abstracts all network requests for the application.

import { Assessment, Action, UserAction } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// --- Helper for making authenticated requests ---
// In a real app, this would get the token from your auth provider (e.g., Supabase)
const getAuthHeaders = () => {
    const token = "your-jwt-token-placeholder"; // Replace with actual token management
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

// --- Chat API ---
async function* streamChat(content: string, sessionId: string) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // Chat is likely public
    body: JSON.stringify({ content, session_id: sessionId }),
  });

  if (!response.ok) {
    throw new Error(`Chat API request failed with status ${response.status}`);
  }
  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    const lines = text.split('\n\n').filter(line => line.trim());
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.substring(6);
        if (data.trim() === '[DONE]') return;
        try {
          const json = JSON.parse(data);
          if (json.chunk) yield json.chunk;
        } catch (e) {
          console.error("Failed to parse stream chunk:", data);
        }
      }
    }
  }
}

export const chatApi = {
  stream: streamChat,
};

// --- Assessment API ---
export const assessmentApi = {
  getAll: async (): Promise<Assessment[]> => {
    const response = await fetch(`${API_URL}/api/assessments`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch assessments");
    return response.json();
  },
  create: async (data: { user_id: string, lifestyle_data: any }): Promise<Assessment> => {
    const response = await fetch(`${API_URL}/api/assessments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create assessment");
    return response.json();
  },
};

// --- Actions API ---
export const actionsApi = {
  getCurrent: async (): Promise<Action> => {
    const response = await fetch(`${API_URL}/api/actions/current`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch current action");
    return response.json();
  },
  getHistory: async (): Promise<UserAction[]> => {
    const response = await fetch(`${API_URL}/api/actions/history`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch action history");
    return response.json();
  },
  assignNext: async (): Promise<Action> => {
    const response = await fetch(`${API_URL}/api/actions/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to assign next action");
    return response.json();
  },
  update: async (id: string, status: 'completed' | 'skipped'): Promise<UserAction> => {
    const response = await fetch(`${API_URL}/api/actions/${id}/complete`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update action");
    return response.json();
  },
};
