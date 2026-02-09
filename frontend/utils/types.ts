export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  parentId: string;
}

export interface LiveEEG {
  attention_index: number;
  label: string;
  next_games: string[];
}
