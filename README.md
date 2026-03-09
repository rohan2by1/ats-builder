<p align="center">
  <h1 align="center">📄 CV Optimizer</h1>
  <p align="center">
    <strong>AI-Powered LaTeX Resume Enhancement for ATS Systems</strong>
  </p>
  <p align="center">
    Paste your LaTeX CV and a job description — get back an optimized, ATS-friendly resume in seconds.
  </p>
</p>

---

## ✨ Features

- **AI-Powered Optimization** — Uses DeepSeek AI to intelligently tailor your LaTeX CV to any job description
- **Real-Time Streaming** — Watch your optimized CV generate token-by-token with live streaming output
- **3 Built-In Optimization Modes**
  - 🪶 **Conservative** — Minimal changes: grammar, flow, and light polish only
  - ✨ **Standard** — Subtle synonym swaps, ATS-friendly keywords while keeping your voice
  - 🎯 **Aggressive ATS** — Maximum keyword injection for beating Applicant Tracking Systems
- **Custom Prompts** — Create, save, and manage your own optimization prompts
- **Export Options**
  - Download as `.tex` (LaTeX source)
  - Export as `.pdf` via server-side LaTeX compilation (powered by [Texapi](https://texapi.ovh))
- **Optimization History** — Every optimization is saved locally so you can revisit and compare past results
- **Master CV Management** — Save a default CV and reset to it anytime with one click
- **Dark / Light Theme** — Toggle between themes; preference is persisted across sessions
- **Keyboard Shortcuts** — `Ctrl+Enter` / `⌘+Enter` to optimize instantly
- **Auto-Save Drafts** — CV and job description inputs are debounced and auto-saved to local storage
- **Rate Limiting** — Built-in server-side rate limiting to prevent API abuse

## 🛠️ Tech Stack

| Layer       | Technology                                                   |
| ----------- | ------------------------------------------------------------ |
| Framework   | [Next.js 16](https://nextjs.org) (App Router)               |
| Language    | [TypeScript](https://www.typescriptlang.org)                 |
| UI          | [React 19](https://react.dev) + [Tailwind CSS 4](https://tailwindcss.com) |
| AI Backend  | [DeepSeek API](https://platform.deepseek.com) via OpenAI SDK |
| PDF Export  | [Texapi](https://texapi.ovh) (server-side LaTeX compilation) |
| State       | React hooks + `localStorage`                                 |

## 📦 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or yarn / pnpm / bun)
- **DeepSeek API Key** — get one at [platform.deepseek.com](https://platform.deepseek.com)
- **Texapi Key** *(optional, for PDF export)* — get one at [texapi.ovh](https://texapi.ovh)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/ats-builder.git
cd ats-builder

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Optional — only needed for PDF export
TEXAPI_KEY=your_texapi_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🗂️ Project Structure

```
ats-builder/
├── app/
│   ├── api/
│   │   ├── optimize/route.ts      # DeepSeek streaming API endpoint
│   │   └── export-pdf/route.ts    # LaTeX → PDF compilation endpoint
│   ├── layout.tsx                 # Root layout with metadata
│   └── page.tsx                   # Main application page
├── components/
│   ├── Header.tsx                 # App header with stats & theme toggle
│   ├── CVInput.tsx                # LaTeX CV text input
│   ├── JobDescriptionInput.tsx    # Job description text input
│   ├── PromptSelector.tsx         # Optimization mode selector
│   ├── PromptEditor.tsx           # Custom prompt creation/editing
│   ├── ResultPanel.tsx            # Optimized output display
│   ├── HistoryPanel.tsx           # Past optimizations list
│   ├── ExportModal.tsx            # .tex / .pdf export dialog
│   └── Dialog.tsx                 # Reusable confirmation dialog
├── hooks/
│   ├── useCVOptimizer.ts          # AI optimization logic + streaming
│   ├── useHistory.ts              # Optimization history management
│   ├── useLocalStorage.ts         # Type-safe localStorage wrapper
│   ├── usePrompts.ts              # Prompt CRUD operations
│   └── useTheme.ts                # Dark/light theme toggle
├── lib/
│   └── prompts.ts                 # Built-in prompt definitions
├── styles/
│   ├── globals.css                # Global styles
│   └── sketch.css                 # Component styles & theme variables
└── types/
    └── index.ts                   # TypeScript interfaces
```

## 🔧 How It Works

1. **Paste your LaTeX CV** into the left panel
2. **Paste the job description** you're targeting
3. **Choose an optimization mode** (or create a custom prompt)
4. **Click "Optimize"** (or press `Ctrl+Enter`) — the AI streams back your tailored CV in real-time
5. **Copy the result**, export as `.tex`, or compile to `.pdf` directly in the browser

The server-side API sanitizes inputs, enforces rate limits, and streams the DeepSeek response back to the client for a smooth, real-time experience.

## 🚀 Deploy

The easiest way to deploy is with [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/<your-username>/ats-builder&env=DEEPSEEK_API_KEY,TEXAPI_KEY)

Remember to add your `DEEPSEEK_API_KEY` (and optionally `TEXAPI_KEY`) as environment variables in your deployment settings.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
