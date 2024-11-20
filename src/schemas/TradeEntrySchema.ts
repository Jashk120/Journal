import {z} from 'zod';

export const tradeEntrySchema = z.object({
    pair: z.string().nonempty("Currency Pair is required"),
    tradeType: z.enum(['Buy', 'Sell'], { required_error: "Trade Type is required" }),
    lotSize: z.number().positive("Lot Size must be positive"),
    entryPrice: z.number().positive("Entry Price must be positive"),
    dateTime: z.date().optional(), // Leave optional to handle assignment separately
    userId: z.string().uuid().optional(),
    hoursHeld: z.number().optional(),
    stars: z.number().min(1).max(5).optional(),
    takeProfit: z.number().positive().optional(),
    stopLoss: z.number().positive().optional(),
    tpDollars: z.number().optional(),
    slDollars: z.number().optional(),
    actualProfitLoss: z.number().optional(),
    quickRationale: z.string().optional(),
    comments: z.string().optional(),
  });