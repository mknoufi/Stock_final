/**
 * Role-Based Theme System
 *
 * Defines distinct visual identities for each user role in the application.
 * Used by ScreenContainer to inject role-specific colors and gradients.
 */

export type UserRole = "admin" | "staff" | "supervisor" | "public";

export interface RoleTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: readonly [string, string, string]; // Gradient tuple
  glassBorder: string;
  glassTint: "light" | "dark" | "default";
}

export const roleThemes: Record<UserRole, RoleTheme> = {
  // ADMIN: Deep Indigo/Violet - Represents Control, Wisdom, Governance
  admin: {
    primary: "#6366F1", // Indigo 500
    secondary: "#8B5CF6", // Violet 500
    accent: "#EC4899", // Pink 500 (Highlights)
    background: ["#0F172A", "#1E1B4B", "#312E81"], // Slate 900 -> Indigo 950 -> Indigo 900
    glassBorder: "rgba(99, 102, 241, 0.2)",
    glassTint: "dark",
  },

  // STAFF: Electric Blue/Cyan - Represents Speed, Efficiency, Clarity
  staff: {
    primary: "#3B82F6", // Blue 500
    secondary: "#06B6D4", // Cyan 500
    accent: "#F59E0B", // Amber 500 (Action/Warning)
    background: ["#0F172A", "#172554", "#1E3A8A"], // Slate 900 -> Blue 950 -> Blue 900
    glassBorder: "rgba(59, 130, 246, 0.2)",
    glassTint: "dark",
  },

  // SUPERVISOR: Teal/Emerald - Represents Verification, Accuracy, Growth
  supervisor: {
    primary: "#10B981", // Emerald 500
    secondary: "#14B8A6", // Teal 500
    accent: "#8B5CF6", // Violet 500 (Action)
    background: ["#0F172A", "#064E3B", "#115E59"], // Slate 900 -> Emerald 900 -> Teal 800
    glassBorder: "rgba(16, 185, 129, 0.2)",
    glassTint: "dark",
  },

  // PUBLIC: Royal Blue/Warm - Represents Trust, Welcoming, Brand
  public: {
    primary: "#2563EB", // Blue 600
    secondary: "#4F46E5", // Indigo 600
    accent: "#F43F5E", // Rose 500
    background: ["#020617", "#0F172A", "#1E293B"], // Slate 950 -> Slate 900 -> Slate 800
    glassBorder: "rgba(148, 163, 184, 0.1)",
    glassTint: "dark",
  },
};

// Helper to get gradient for a role
export const getRoleGradient = (role: UserRole = "public") => {
  return roleThemes[role].background;
};
