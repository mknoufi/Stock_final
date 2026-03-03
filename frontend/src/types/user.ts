/**
 * User Types - Canonical Source of Truth
 * All user-related types should be imported from here.
 */

/**
 * User interface - API format (snake_case)
 * This matches the backend API response format.
 */
export interface User {
  id: string;
  username: string;
  full_name: string;
  role: "staff" | "supervisor" | "admin";
  email?: string | null;
  is_active: boolean;
  permissions: string[];
  has_pin?: boolean;
  created_at?: string | null;
  last_login?: string | null;
}

/**
 * NormalizedUser - Frontend format (camelCase)
 * Use this for UI components where camelCase is preferred.
 */
export interface NormalizedUser {
  id: string;
  username: string;
  fullName: string | null;
  role: "staff" | "supervisor" | "admin";
  email: string | null;
  isActive: boolean;
  permissions: string[];
  hasPin?: boolean;
  createdAt: string | null;
  lastLogin: string | null;
  permissionsCount?: number;
}

/**
 * Helper function to normalize User from API format to frontend format
 */
export function normalizeUser(user: User): NormalizedUser {
  return {
    id: user.id,
    username: user.username,
    fullName: user.full_name || null,
    role: user.role,
    email: user.email || null,
    isActive: user.is_active,
    permissions: user.permissions || [],
    hasPin: user.has_pin,
    createdAt: user.created_at || null,
    lastLogin: user.last_login || null,
    permissionsCount: user.permissions?.length || 0,
  };
}

/**
 * Helper function to denormalize User from frontend format to API format
 */
export function denormalizeUser(user: Partial<NormalizedUser>): Partial<User> {
  return {
    id: user.id,
    username: user.username,
    full_name: user.fullName || "",
    role: user.role,
    email: user.email,
    is_active: user.isActive,
    permissions: user.permissions || [],
    has_pin: user.hasPin,
    created_at: user.createdAt,
    last_login: user.lastLogin,
  };
}

/**
 * AuthState interface - For authentication store
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * ActiveUser - For live user tracking
 */
export interface ActiveUser {
  user_id: string;
  username: string;
  role: string;
  last_activity: string;
  current_session: string | null;
  status?: "active" | "idle" | "offline";
}

/**
 * UserListResponse - API pagination response
 */
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
