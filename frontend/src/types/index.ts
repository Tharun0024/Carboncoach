export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export interface Assessment {
  id: string;
  created_at: string;
  total_kg_co2e: number;
  breakdown: {
    transport: number;
    energy: number;
    food: number;
    other: number;
  };
}

export interface Action {
  id: string;
  category: 'transport' | 'energy' | 'food' | 'other';
  title: string;
  description: string;
  impact_kgco2e_estimate: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'assigned' | 'completed' | 'skipped';
}

export interface UserAction extends Action {
  user_id: string;
  assigned_at: string;
  completed_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}
