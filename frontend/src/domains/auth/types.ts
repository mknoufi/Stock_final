import { z } from "zod";
import { UserSchema, LoginResponseSchema } from "../../types/schemas";
import { FontStylePreference } from "../../theme/fontPreferences";

// Re-export Zod schemas
export { UserSchema, LoginResponseSchema } from "../../types/schemas";

// Inferred types
export type User = z.infer<typeof UserSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export interface UserSettings {
  theme: "light" | "dark";
  font_size: number;
  font_style: FontStylePreference;
  updated_at: string | null;
}

export interface ChangePinResponse {
  status: string;
  message: string;
  data: {
    changed_at: string;
  };
}

export interface ChangePasswordResponse {
  status: string;
  message: string;
  data: {
    changed_at: string;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface PinCredentials {
  username: string;
  pin: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
