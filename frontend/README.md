# Stock Verify - Frontend

This is the mobile frontend for the Stock Verify application, built with **React Native** and **Expo**.

## 📚 Official Tech Stack

This project adheres to the versions specified in the [Official Documentation Verification](../agents/official-docs-verification.md).

| Framework           | Version    | Official Docs                                                                     |
| ------------------- | ---------- | --------------------------------------------------------------------------------- |
| **Expo SDK**        | `~54.0.29` | [Expo Docs](https://docs.expo.dev/versions/v54.0.0/)                              |
| **React Native**    | `0.81.5`   | [React Native Docs](https://reactnative.dev/docs/0.81/getting-started)            |
| **React**           | `19.1.0`   | [React Docs](https://react.dev/)                                                  |
| **Expo Router**     | `~6.0.19`  | [Expo Router](https://docs.expo.dev/router/introduction/)                         |
| **React Query**     | `^5.59.16` | [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) |
| **Zustand**         | `^5.0.9`   | [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)         |
| **React Hook Form** | `^7.68.0`  | [React Hook Form](https://react-hook-form.com/)                                   |
| **Zod**             | `^4.2.1`   | [Zod Docs](https://zod.dev/)                                                      |

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.18
- npm or yarn

### Installation

```bash
npm install
```

### Running the App

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## 📁 Project Structure

- **`app/`**: Expo Router file-based routing.
- **`src/components/`**: Reusable UI components (Modern Design System).
- **`src/services/`**: API clients and business logic.
- **`src/store/`**: Zustand state management.
- **`src/theme/`**: Design tokens (colors, typography, spacing).
- **`src/types/`**: TypeScript definitions.

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

## 🎨 Design System

The application uses a custom **Modern Design System** located in `src/theme/modernDesign.ts`.
Components in `src/components/ui/` (e.g., `ModernCard`, `ModernButton`, `ModernInput`) should be used to ensure consistency.

## 🔄 API Integration

API calls are managed in `src/services/api/api.ts`.
Data normalization ensures that backend snake_case is converted to frontend camelCase (or preserved where necessary).

## 🔐 Environment Variables

Copy `.env.example` to `.env` and set values for your environment.

- `EXPO_PUBLIC_BACKEND_URL`: Optional backend URL override.
- `EXPO_PUBLIC_APP_ENV`: Frontend runtime environment (`development`, `staging`, `production`).
- `EXPO_PUBLIC_SENTRY_DSN`: Optional public Sentry DSN for frontend error reporting.

## ⚠️ Verification

This codebase is verified against the official documentation.
See `agents/official-docs-verification.md` for details on the verification process and drift rules.
