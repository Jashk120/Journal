# Journal - Forex Trading Journal Application

## Overview

**Journal** is a Next.js-based Forex trading journal application that enables traders to document, analyze, and review their trades. The application provides a comprehensive suite of tools for trade entry management, performance analytics, position sizing calculations, and user authentication.

Built with Next.js 14+ App Router, the application leverages React 18, Prisma ORM, Tailwind CSS, and TypeScript throughout to deliver a robust and maintainable trading journal system.

## Features

- **User Authentication** - Secure sign-in with email and password using JWT tokens
- **Trade Management** - Create, read, update, and delete trade entries with full CRUD operations
- **Analytics Dashboard** - Time-based trading performance analytics with statistics on trades, pairs, star ratings, and lot sizes
- **Position Size Calculator** - Calculate optimal position sizes based on risk parameters and real-time exchange rates
- **Market Distance Calculator** - Measure market distances for trade planning
- **Pagination and Sorting** - Browse trades with offset-based pagination and sort by date, hours held, or stars
- **Search Functionality** - Search through trade entries
- **Email Verification** - Email templates for user verification

## File Structure

```
Journal/
├── const/
│   ├── pairs.ts                 # Currency pair definitions
│   └── useCurrency.ts           # Exchange rate fetching custom hook
├── emails/
│   └── VerificationEmail.tsx    # Email verification templates
├── helper/
│   └── getDataFromTokens.ts     # Token extraction utility for authenticated requests
├── schemas/
│   └── signInSchema.ts          # Zod validation schema for sign-in
├── src/
│   ├── app/
│   │   ├── (app)/               # Authenticated routes with sidebar layout
│   │   │   ├── calculator/      # Position size and market distance calculators
│   │   │   ├── dashboard/       # Trading analytics and performance dashboard
│   │   │   ├── home/            # User home page with trading tips
│   │   │   └── trades/          # Trade management and entry forms
│   │   ├── (auth)/              # Authentication pages without navigation
│   │   │   └── auth/            # Sign-in page
│   │   ├── (landingPage)/       # Public landing page with navigation and footer
│   │   └── api/
│   │       └── trades/          # Trade CRUD API endpoints
│   ├── components/              # Shared UI components
│   └── helper/                  # Additional helper utilities
└── next.config.ts
```

## Usage

### User Authentication

Navigate to `/auth` to sign in with your email and password. The authentication form validates inputs using Zod schema.

```typescript
// schemas/signInSchema.ts
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
```

### Creating a Trade

Open the trade entry form from the trades page. Fill in the trade details and submit to create a new trade record.

```typescript
// Example: Creating a trade via API
const createTrade = async (tradeData: TradeInput) => {
  const response = await fetch("/api/trades/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pair: "EUR/USD",
      tradeType: "Buy",
      lotSize: 0.1,
      entryPrice: 1.1050,
      takeProfit: 1.1100,
      stopLoss: 1.1020,
      stars: 4,
      quickRationale: "Strong support level bounce",
      comments: "Entry confirmed with bullish divergence",
    }),
  });

  const result = await response.json();
  return result;
};
```

### Viewing Analytics

The dashboard provides time-based filtering for trading performance analysis. Select a time filter (This Week, This Month, This Year) to view relevant statistics.

```typescript
// Example: Fetching analytics data
const fetchAnalytics = async (filter: string) => {
  const response = await fetch("/api/trades/analytics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter: filter, // "week", "month", "year"
    }),
  });

  const analytics = await response.json();
  // Returns: { totalTrades, pairsUsed, starRatings, avgLotSize }
  return analytics;
};
```

### Calculating Position Size

Use the Position Size Calculator in the calculator section. Select a currency pair and input your risk parameters to compute the optimal lot size.

```typescript
// Example: Using the useCurrency hook for exchange rates
import { useCurrencyInfo } from "@/const/useCurrency";

function PositionCalculator() {
  const { data: exchangeRate, loading, error } = useCurrencyInfo("EUR", "USD");

  // The hook fetches from open.er-api.com automatically
  // Returns the current exchange rate for the selected pair

  if (loading) return <div>Loading exchange rate...</div>;
  if (error) return <div>Error fetching rate</div>;

  return <div>Current EUR/USD rate: {exchangeRate}</div>;
}
```

### Retrieving User Trades

Fetch paginated trades for the authenticated user with sorting and search capabilities.

```typescript
// Example: Fetching paginated user trades
const getUserTrades = async (page: number, limit: number, sortField: string) => {
  const response = await fetch(
    `/api/trades/user-trades?page=${page}&limit=${limit}&sort=${sortField}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return data;
  // Supports sorting by: "dateTime", "hoursHeld", "stars"
  // Returns 10 items per page by default
};
```

## Setup

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager
- PostgreSQL database

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/journal"
JWT_SECRET="your-jwt-secret-key"
SMTP_HOST="your-smtp-host"
SMTP_PORT=587
SMTP_USER="your-smtp-username"
SMTP_PASS="your-smtp-password"
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jashk120/Journal.git
cd Journal
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Notes

- The application uses the Open Exchange Rates API (free tier at `open.er-api.com`) for real-time currency conversion in the calculator module
- All trade data is scoped to the authenticated user via user ID extracted from the JWT token
- The `(app)` route group wraps authenticated pages with a sidebar layout containing navigation
- The `(auth)` route group uses a minimal layout without navigation for sign-in pages
- The `(landingPage)` route group includes Navbar and Footer components for the public-facing page
- Email verification templates exist but the verification flow appears incomplete with a commented-out button
- Pagination uses an offset-based approach with page and limit query parameters
- Sort functionality supports three fields: `dateTime`, `hoursHeld`, and `stars`
- Internal API endpoints are located under `/api/trades/*` for all trade-related operations