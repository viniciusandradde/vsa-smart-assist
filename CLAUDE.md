# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

| Task | Command |
|------|---------|
| **Start dev server** | `npm run dev` — runs on `http://localhost:8080` |
| **Build for production** | `npm run build` |
| **Run tests** | `npm test` — runs Vitest suite once |
| **Watch mode tests** | `npm run test:watch` — re-runs on file changes |
| **Lint code** | `npm run lint` — ESLint checks |
| **Preview production build** | `npm run preview` |

## Repository Overview

**VSA Smart Assist** (Very Smart Assist) is a React frontend application for managing support tickets with AI-powered classification and Telegram notifications.

**Key features:**
- User authentication via Supabase
- Ticket submission and dashboard management
- Integration with n8n webhook for backend processing
- Telegram notifications for ticket status updates
- Configurable settings for webhook and Telegram

**Tech stack:**
- React 18 + TypeScript + Vite (port 8080)
- shadcn/ui + Tailwind CSS for UI
- React Router for navigation
- Supabase for auth and session management
- React Query for data fetching
- Vitest + jsdom for testing

## Architecture Overview

### Page Structure (src/pages/)

The app follows a standard page-based structure with client-side routing:

- **Login.tsx** — Supabase authentication entry point
- **NewTicket.tsx** — Form to create new support tickets
- **Dashboard.tsx** — View and manage submitted tickets
- **Settings.tsx** — Configure webhook URL and Telegram integration
- **Index.tsx** — Home/landing page

All pages (except Login) are wrapped in `<ProtectedRoute>` to enforce authentication.

### Key Systems

#### 1. Authentication (src/contexts/AuthContext.tsx)
- Supabase Auth session management
- Provides `useAuthContext()` hook for accessing `user`, `session`, and auth methods
- Real-time auth state changes via `supabase.auth.onAuthStateChange()`
- Login/logout is handled in Login.tsx

#### 2. API Integration (src/lib/api.ts)
- **submitTicket()** — POST to webhook with ticket data, stores in localStorage, triggers Telegram notification
- **fetchDashboard()** — Reads tickets from localStorage (simulates dashboard fetch)
- **updateTicketStatus()** — Updates ticket status, triggers Telegram notifications for status changes
- **addTicketResponse()** — Adds support team responses to tickets
- **sendTestApiWebhook()** — Tests webhook connectivity from Settings page

Webhook base URL is configurable via Settings and stored in localStorage.

#### 3. Telegram Notifications (src/lib/webhook.ts)
- **notifyTelegram()** — Sends formatted ticket updates to Telegram based on event type (NEW, IN_PROGRESS, RESOLVED)
- **sendTestTelegram()** — Manual test from Settings page
- Settings stored in localStorage: `telegramEnabled`, `telegramChatId`, `apiWebhookBase`

#### 4. UI Components (src/components/)
- **Layout.tsx** — Main app shell with navigation (uses React Router NavLink)
- **ProtectedRoute.tsx** — Auth guard that redirects unauthenticated users to login
- shadcn/ui components in `src/components/ui/` (auto-imported via `@` alias)

### Data Flow

```
User submits ticket (NewTicket.tsx)
    ↓
submitTicket() → POST to webhook
    ↓
Response stored in localStorage
    ↓
notifyTelegram() sends update to Telegram
    ↓
Dashboard.tsx reads localStorage to display tickets
    ↓
User updates status in Dashboard
    ↓
updateTicketStatus() updates localStorage + triggers Telegram notification
```

## Important Patterns

### Form Handling
- React Hook Form + Zod for validation (see pages/NewTicket.tsx)
- shadcn form components with proper error display
- Toast notifications via `sonner` for feedback

### State Management
- React Query (`@tanstack/react-query`) for server state
- React Context for auth
- localStorage for client-side ticket persistence
- Component-level state for UI (modals, forms, etc.)

### Error Handling
- Try/catch with user-facing toast notifications
- API errors caught in promise-based async functions
- Auth errors handled by ProtectedRoute redirects

### Styling
- Tailwind CSS for utility classes
- shadcn/ui for pre-built components
- `cn()` utility (from `src/lib/utils.ts`) for conditional class merging
- CSS modules not used; prefer Tailwind + component props

## File Structure

```
src/
├── pages/              # Page components (routed via React Router)
├── components/         # Reusable UI components
│   └── ui/            # shadcn/ui components (auto-generated)
├── contexts/          # React Context providers (AuthContext)
├── hooks/             # Custom React hooks (useAuth, useMobile, useToast)
├── lib/               # Utilities and API functions
│   ├── api.ts         # Ticket submission, dashboard, status updates
│   ├── webhook.ts     # Telegram integration
│   └── utils.ts       # Helper functions (cn, etc.)
├── integrations/      # External service clients
│   └── supabase/      # Supabase auth setup
├── test/              # Test utilities and examples
└── App.tsx            # Router setup and provider wrapping
```

## Development Workflow

### Adding a Feature
1. Add page in `src/pages/` or component in `src/components/`
2. Add route in `App.tsx` (wrap with `<ProtectedRoute>` if authenticated)
3. Use existing contexts/hooks for auth and API calls
4. Add tests in `src/test/` or colocated `.test.tsx` files
5. Lint before committing: `npm run lint`

### Debugging
- Dev server runs with HMR (hot module replacement) — changes auto-reload
- React DevTools and TypeScript provide type checking
- Check browser console and Network tab for API issues
- localStorage can be inspected in DevTools → Application → Local Storage

### Testing
- Tests live in `src/test/` or colocated as `*.test.tsx`
- jsdom environment simulates browser (see vitest.config.ts)
- React Testing Library for component tests
- Playwright config available for E2E if needed

## Configuration

### Environment Variables
- Supabase credentials configured in `src/integrations/supabase/client.ts`
- No `.env` file committed; use project secrets for sensitive keys

### Webhook Settings (Runtime Configurable)
- API webhook base URL: set in Settings page, stored in localStorage
- Telegram Chat ID: set in Settings page, stored in localStorage
- Enable/disable Telegram: toggle in Settings page

### Build Output
- Production build output in `dist/` (created by `npm run build`)
- Vite config: SWC for faster JSX compilation, path alias `@` for src imports

## Git Conventions

- Branch naming: `feature/description` or `fix/issue-name`
- Commit messages: Describe the "why" not just "what" (see recent commits for examples)
- Keep commits focused; avoid mixing unrelated changes

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 8080 already in use | Change port in vite.config.ts or kill existing process |
| Import errors (@ alias) | Check vite.config.ts resolve.alias is set correctly |
| Supabase auth not working | Verify SUPABASE_URL and SUPABASE_ANON_KEY in supabase/client.ts |
| localStorage not persisting | Check browser privacy settings; localStorage disabled in private mode |
| Webhook test fails | Verify API webhook base URL in Settings is correct and accessible |

## Key Dependencies to Know

- **React 18.3** — UI framework
- **Vite 5.4** — Build tool and dev server (much faster than Create React App)
- **TypeScript 5.8** — Type safety
- **shadcn/ui** — High-quality, unstyled component library (based on Radix UI)
- **React Router 6.30** — Client-side routing
- **Supabase** — Auth and realtime database (we use auth only)
- **React Query 5.83** — Server state management (setup in App.tsx)
- **Vitest 3.2** — Fast unit test runner (similar API to Jest)
