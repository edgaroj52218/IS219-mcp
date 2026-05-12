# Wage Data Assistant — MCP-Powered AI Chat

An AI chat assistant built with Next.js and the Model Context Protocol (MCP) that answers questions about U.S. wage trends from 2010–2025. Built as part of the NJIT IS219 Advanced Website Development course (Spring 2026).

## What It Does

This app lets users ask natural language questions about wage and inflation data from the [Student Reality Lab](https://student-reality-lab-ojeda.vercel.app/) — a data story examining whether entry-level wages have kept up with inflation since 2010.

The AI uses MCP tools to look up real BLS data rather than guessing. It responds in plain English.

**Example questions:**
- "What were wages in 2022?"
- "Compare nominal vs real wages in 2021"
- "Did wages keep up with inflation between 2018 and 2023?"
- "What was the wage trend from 2015 to 2020?"

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Anthropic Claude / OpenAI** — LLM orchestration
- **Model Context Protocol (MCP)** — tool-based data access
- **Jest** — automated testing
- **GitHub Actions** — CI (lint, typecheck, test, build)

## Architecture

The app uses a three-layer MCP architecture:

```
User message
     ↓
Next.js API route (route.ts)
     ↓
LLM (Claude or GPT) with tool definitions
     ↓
MCP client (mcp-wage-client.ts)
     ↓
MCP server (wage-data-server.mjs) — hardcoded BLS data
     ↓
Plain English response back to user
```

The MCP server exposes four tools:

| Tool | Description |
|---|---|
| `get_wage_by_year` | Returns nominal wage, real wage, CPI, and % change for a given year |
| `get_wage_range` | Returns wage data for a range of years |
| `compare_wages` | Compares nominal vs real wage for a year, showing the dollar gap |
| `get_wage_trend` | Analyzes whether purchasing power grew or shrank between two years |

## Data Source

- **Wage data:** BLS CES0500000008 — Average Hourly Earnings of Production and Nonsupervisory Employees
- **Inflation data:** BLS CUSR0000SA0 — CPI-U, All Urban Consumers
- **Base year:** 2010 (real wages expressed in 2010 dollars)
- **Formula:** `Real Wage = Nominal Wage × (CPI_2010 / CPI_current)`
- **Coverage:** 2010–2025

## Quick Start

### Prerequisites
- Node.js v18 or higher
- An Anthropic or OpenAI API key

### Installation

```bash
git clone https://github.com/edgaroj52218/IS219-mcp.git
cd IS219-mcp
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Add your key to `.env.local`:

```
ANTHROPIC_API_KEY=your_key_here
# or
OPENAI_API_KEY=your_key_here
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run Tests

```bash
npm test
```

### Run Real-LLM Eval Harness

Make sure `npm run dev` is running, then in a second terminal:

```bash
npm run eval:chat
```

Expected output: 5/5 evals passed.

## Project Structure

```
IS219-mcp/
├── mcp-server/
│   └── wage-data-server.mjs     # MCP server with BLS wage data + 4 tools
├── scripts/
│   └── eval-chat.mjs            # Real-LLM eval harness
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts    # Chat API route — LLM orchestration
│   │   └── page.tsx             # Homepage
│   ├── components/
│   │   └── chat/
│   │       └── chat-widget.tsx  # Floating chat UI component
│   └── lib/
│       ├── mcp-wage-client.ts   # MCP client wrapper
│       └── wage-intent.ts       # Wage query intent detection
```

## Related Projects

- [Student Reality Lab](https://github.com/edgaroj52218/student-reality-lab-ojeda) — The React data visualization this assistant is built to support
- [Job Tracker API](https://github.com/edgaroj52218/job-tracker-api) — REST API with Jest integration tests

## Author

**Edgar Steven Ojeda** — NJIT Information Systems, Spring 2026

- GitHub: [github.com/edgaroj52218](https://github.com/edgaroj52218)
- LinkedIn: [linkedin.com/in/ojedastevenedgar](https://www.linkedin.com/in/ojedastevenedgar/)
