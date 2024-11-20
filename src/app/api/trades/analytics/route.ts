import { PrismaClient } from '@prisma/client';
import { getDataFromToken } from '@/helper/getDataFromTokens';
import { NextRequest, NextResponse } from 'next/server';


const prisma = new PrismaClient()
const getDateRange = (filter: any) => {
    
    const now = new Date();
  switch (filter) {
    case 'This Week':
      return [new Date(now.setDate(now.getDate() - 7)), new Date()];
    case 'This Month':
      return [new Date(now.setMonth(now.getMonth() - 1)), new Date()];
    case 'This Year':
      return [new Date(now.setFullYear(now.getFullYear() - 1)), new Date()];
    default:
      return [new Date(0), new Date()]; // All-time
  }
};

export async function POST(req: NextRequest) {
  try {
    // Extract user ID from token
    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract query parameters
    const { filter = "This Week" } = await req.json();
    const [startDate, endDate] = getDateRange(filter);

    // Fetch trades within the specified date range for the current user
    const trades = await prisma.trade.findMany({
      where: {
        userId: userId,
        dateTime: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Calculate analytics
    const totalTrades = trades.length;
    const pairsUsed = [...new Set(trades.map((trade) => trade.pair))];
    const starRatings = trades.reduce<Record<number, number>>((acc, trade) => {
      acc[trade.stars] = (acc[trade.stars] || 0) + 1;
      return acc;
    }, {});    
    const totalLotSize = trades.reduce((sum, trade) => sum + trade.lotSize, 0);
    const avgLotSize = totalTrades ? totalLotSize / totalTrades : 0;

    const analytics: {
      totalTrades: number;
      pairsUsed: string[];
      starRatings: Record<number, number>;
      avgLotSize: number;
    } = {
      totalTrades: 0,
      pairsUsed: [],
      starRatings: {},
      avgLotSize: 0,
    };
    
    // Assigning values
    analytics.totalTrades = totalTrades;
    analytics.pairsUsed = pairsUsed;
    analytics.starRatings = starRatings;
    analytics.avgLotSize = avgLotSize;
    
    return NextResponse.json({
      analytics
    });
  } catch (error) {
    console.error("Error fetching trade analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch trade analytics" },
      { status: 500 }
    );
  }
}