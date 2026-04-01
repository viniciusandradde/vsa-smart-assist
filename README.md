# VSA Smart Assist

A modern web application for managing support tickets with AI-powered classification and real-time Telegram notifications.

## Overview

**VSA Smart Assist** streamlines support ticket management by:
- Providing an intuitive interface for submitting tickets
- Automatically classifying tickets by urgency and category via AI
- Managing ticket lifecycle from creation to resolution
- Sending real-time notifications to Telegram for status updates
- Offering a dashboard to track and respond to tickets

Perfect for teams that need efficient ticket management with intelligent routing and notifications.

## Features

✨ **Core Features**
- 🔐 Secure authentication with Supabase
- 🎟️ Submit tickets with detailed information (name, email, department, description)
- 📊 Interactive dashboard to view and manage tickets
- 🤖 AI-powered ticket classification (urgency, category, responsible team)
- 💬 Telegram notifications for new tickets and status updates
- ⚙️ Configurable settings for webhook and Telegram integration
- 📱 Responsive design for mobile and desktop

## Prerequisites

- **Node.js** 18+ with npm
- **Supabase project** (for authentication)
- **n8n webhook** (for backend ticket processing)
- **Telegram bot** and chat ID (optional, for notifications)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vsa-smart-assist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Update `src/integrations/supabase/client.ts` with your Supabase URL and API key
   - Ensure your Supabase project has authentication enabled

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:8080`

## Building for Production

```bash
npm run build
```

Output is generated in the `dist/` folder. Deploy this folder to your hosting platform.

Preview the production build locally:
```bash
npm run preview
```

## Configuration

### Webhook Settings
Configure the API webhook base URL in the **Settings** page:
- URL where n8n listens for incoming tickets
- Example: `https://your-n8n-instance.com/webhook`
- Verified with "Test Connection" button

### Telegram Integration
Configure Telegram notifications in the **Settings** page:
- **Enable Telegram**: Toggle to enable/disable notifications
- **Chat ID**: Telegram group/channel ID where notifications are sent
- **Test**: Send a test notification to verify configuration

All settings are stored locally in the browser and persisted across sessions.

## Project Structure

```
src/
├── pages/              # Application pages (routed via React Router)
│   ├── Login.tsx       # Authentication page
│   ├── NewTicket.tsx   # Ticket submission form
│   ├── Dashboard.tsx   # Ticket management interface
│   └── Settings.tsx    # Configuration page
├── components/         # Reusable UI components
│   ├── Layout.tsx      # Main app shell with navigation
│   ├── ProtectedRoute.tsx  # Authentication guard
│   └── ui/             # shadcn/ui component library
├── contexts/          # React Context providers
│   └── AuthContext.tsx # Authentication state management
├── lib/               # Utilities and API functions
│   ├── api.ts         # Ticket operations (submit, fetch, update)
│   ├── webhook.ts     # Telegram integration
│   └── utils.ts       # Helper functions
├── integrations/      # External service clients
│   └── supabase/      # Supabase auth configuration
└── test/             # Test utilities and examples
```

## Development

### Running Tests
```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
```

### Linting
```bash
npm run lint
```

### Making Changes
1. **Authentication logic** — Edit `src/contexts/AuthContext.tsx`
2. **API integration** — Edit `src/lib/api.ts`
3. **Telegram notifications** — Edit `src/lib/webhook.ts`
4. **Pages/UI** — Edit files in `src/pages/` and `src/components/`

For detailed development guidance, see [CLAUDE.md](./CLAUDE.md).

## Tech Stack

**Frontend Framework & Build**
- React 18.3 — UI framework
- Vite 5.4 — Lightning-fast build tool and dev server
- TypeScript 5.8 — Type safety

**UI & Styling**
- shadcn/ui — High-quality component library
- Tailwind CSS 3.4 — Utility-first CSS framework
- Radix UI — Accessible component primitives

**State & Data**
- React Router 6.30 — Client-side routing
- React Query 5.83 — Server state management
- React Context — Global state management
- React Hook Form 7.61 — Form handling

**Backend Integration**
- Supabase — Authentication and session management
- n8n webhook — Ticket processing and classification

**Testing & Quality**
- Vitest 3.2 — Fast unit test framework
- React Testing Library — Component testing utilities
- ESLint — Code quality checks

## API Integration

Tickets are sent to your n8n instance via webhook:

**Request:**
```json
POST {apiWebhookBase}/vsa-smart-help
Content-Type: application/json

{
  "titulo": "Database connection issue",
  "nome": "John Doe",
  "email": "john@example.com",
  "setor": "IT",
  "descricao": "Database is intermittently unreachable",
  "data_abertura": "2024-04-01T10:30:00Z"
}
```

**Response:**
```json
{
  "id": "VSA-123456",
  "status": "Aberto",
  "classificacao": {
    "categoria": "Infrastructure",
    "urgencia": "CRÍTICO",
    "responsavel": "DevOps Team",
    "motivo": "Database unavailable"
  }
}
```

## Troubleshooting

**Authentication issues**
- Verify Supabase credentials in `src/integrations/supabase/client.ts`
- Check that your Supabase project has auth enabled

**Webhook connection fails**
- Ensure the API webhook base URL is correct in Settings
- Verify n8n instance is running and accessible
- Check browser console for detailed error messages

**Telegram notifications not working**
- Enable Telegram in Settings
- Verify the Telegram Chat ID is correct
- Use "Test" button to verify the configuration
- Check that the Telegram bot has permissions to send messages

**Port 8080 already in use**
- Change the port in `vite.config.ts` or kill the process using the port

## Contributing

This project uses Git for version control. When making changes:
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and test thoroughly
3. Commit with descriptive messages
4. Push to the repository

For more details on development workflows, refer to [CLAUDE.md](./CLAUDE.md).

## License

This project is part of the Agentes AI initiative.

## Support

For issues, questions, or suggestions, please refer to the project documentation or contact the development team.
