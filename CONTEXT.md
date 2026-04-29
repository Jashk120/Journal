```markdown
# CONTEXT.md

## Repository Overview

**Jashk120/Journal** is a Next.js-based Forex trading journal application that allows traders to document, analyze, and review their trades. The application provides a comprehensive suite of tools for trade entry management, performance analytics, position sizing calculations, and user authentication.

## Architecture

The application follows a **Next.js App Router** architecture with both client-side and server-side rendering. It uses:

- **Next.js 14+** with App Router for routing and API routes
- **React 18+** with hooks for client-side state management
- **Prisma ORM** for database operations (PostgreSQL)
- **Tailwind CSS** for styling
- **TypeScript** throughout

### Directory Structure

```
Journal/
├── const/                    # Constant definitions and custom hooks
│   ├── pairs.ts             # Currency pair definitions
│   └── useCurrency.ts       # Exchange rate fetching hook
├── emails/                   # Email templates
│   └── VerificationEmail.tsx
├── helper/                   # Utility functions
│   └── getDataFromTokens.ts  # Token extraction helper
├── schemas/                  # Zod validation schemas
│   └── signInSchema.ts
├── src/
│   ├── app/
│   │   ├── (app)/           # Authenticated routes (with sidebar)
│   │   │   ├── calculator/  # Position size calculator
│   │   │   ├── dashboard/   # Trading analytics dashboard
│   │   │   ├── home/        # User home page
│   │   │   └── trades/      # Trade management
│   │   ├── (auth)/          # Authentication routes
│   │   │   └── auth/        # Sign-in page
│   │   ├── (landingPage)/   # Public landing page
│   │   └── api/             # API routes
│   │       └── trades/      # Trade CRUD operations
│   ├── components/          # Shared UI components
│   └── helper/
└── next.config.ts
```

## Modules

### 1. Authentication Module
- **Location**: `src/app/(auth)/`
- **Key Files**: `auth/page.tsx`
- **Purpose**: Handles user sign-in with email/password
- **Key Interfaces**:
  - `signInSchema` (from `@/schemas/signInSchema`): Zod validation schema for email and password
  - API Endpoint: `POST /api/users/login`

### 2. Trade Management Module
- **Location**: `src/app/(app)/trades/` and `src/app/api/trades/`
- **Key API Endpoints**:
  - `POST /api/trades/create` - Create new trade entry
  - `GET /api/trades/user-trades` - Get paginated user trades
  - `GET /api/trades/get-trades` - Get all trades (admin)
  - `GET /api/trades/one-trade/[tradeId]` - Get single trade
  - `PATCH /api/trades/update` - Update existing trade
  - `DELETE /api/trades/delete` - Delete trade
  - `POST /api/trades/analytics` - Get trade analytics with time filters
- **Features**: Search, sort, pagination (10 items per page), add/edit/delete trades

### 3. Analytics Dashboard
- **Location**: `src/app/(app)/dashboard/`
- **Key Features**:
  - Time-based filtering (This Week, This Month, This Year)
  - Total trades count
  - Pairs used statistics
  - Star ratings distribution
  - Average lot size calculation

### 4. Forex Calculator
- **Location**: `src/app/(app)/calculator/`
- **Components**:
  - `PositionSizeCard` - Position size calculator
  - `MarketDistanceCalculator` - Market distance tool
- **Features**: Real-time exchange rates, currency pair selection, position size calculation based on risk parameters

### 5. Landing & Home Pages
- **Landing Page**: Public-facing with motivational carousel and CTA
- **Home Page** (authenticated): Welcome message with auto-playing carousel of trading tips

## Setup Assumptions

- **Database**: PostgreSQL database via Prisma ORM
- **Environment Variables Required**:
  - Database connection string (Prisma)
  - JWT secret for token generation
  - SMTP credentials for email sending
- **External Dependencies**:
  - Open Exchange Rates API (free tier) for currency conversion
- **Node.js Version**: Latest LTS recommended
- **Package Manager**: npm or yarn

## Key Data Flows

### User Authentication Flow
1. User submits email/password on `/auth` page
2. Frontend sends POST to `/api/users/login`
3. Backend validates credentials, returns JWT token
4. Token is stored (likely in cookies or local storage)
5. Subsequent API calls use `getDataFromToken()` helper to extract user ID

### Trade Creation Flow
1. User opens NewEntryDrawer component on trades page
2. User fills in trade details (pair, type, entry/exit prices, lot size, etc.)
3. Frontend sends POST to `/api/trades/create`
4. Backend validates required fields and trade type
5. Creates Prisma record with user-trade relationship
6. Returns success response with created trade object

### Analytics Data Flow
1. User selects time filter on dashboard (default: "This Month")
2. Frontend sends POST to `/api/trades/analytics` with filter parameter
3. Backend extracts user ID from token
4. Prisma queries trades within date range
5. Computes analytics (counts, stars distribution, average lot size)
6. Returns analytics object to frontend

### Exchange Rate Retrieval Flow
1. User selects currency pair on calculator
2. `useCurrencyInfo` custom hook fetches from `open.er-api.com`
3. Hook splits pair into base/quote currencies
4. Fetches latest rates for base currency
5. Extracts specific exchange rate for quote currency
6. Updates state with fetched rate

## Notable Interfaces & Types

### Prisma Schema (Inferred from API usage)
```typescript
// Trade Model (inferred)
interface Trade {
  id: string
  userId: string
  dateTime: Date
  exitDateTime?: Date
  hoursHeld: number
  stars: number
  pair: string
  tradeType: "Buy" | "Sell"
  lotSize: number
  entryPrice: number
  takeProfit?: number
  stopLoss?: number
  tpDollars: number
  slDollars: number
  actualExit?: number
  actualProfitLoss: number
  quickRationale: string
  comments: string
}

// User Model (inferred)
interface User {
  id: string
  email: string
  password: string
  // Additional fields likely present
}
```

### Key Components
- **VerificationEmailProps**: `{ username: string; otp: string }`
- **Analytics object**: `{ totalTrades: number; pairsUsed: string[]; starRatings: Record<number, number>; avgLotSize: number }`
- **CurrencyPair**: `{ pair: string; name?: string }`

### External API Dependencies
- `open.er-api.com` - Free exchange rate API (no auth required)
- Internal API routes under `/api/trades/*`

## Important Notes

- The `(app)` route group wraps authenticated pages with a sidebar layout
- The `(auth)` route group has a minimal layout without navigation
- The `(landingPage)` route group includes Navbar and Footer components
- Email verification templates exist but the verification flow appears incomplete (commented out button)
- All trades are scoped to the authenticated user via `userId` from JWT token
- Pagination uses offset-based approach (page + limit parameters)
- Sort functionality supports `dateTime`, `hoursHeld`, and `stars` fields
```
