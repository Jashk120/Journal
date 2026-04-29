```typescript
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getDataFromToken } from "@/helper/getDataFromTokens";

const prisma = new PrismaClient();

/**
 * Handles POST request to create a new trade entry for the authenticated user.
 *
 * Expects a JSON body containing trade fields such as dateTime, pair, tradeType, entryPrice, lotSize,
 * and optional fields like exitDateTime, hoursHeld, stars, takeProfit, stopLoss, tpDollars, slDollars,
 * actualExit, actualProfitLoss, quickRationale, and comments.
 *
 * Performs validation on required fields and tradeType, verifies the user exists, then creates the trade
 * record in the database.
 *
 * @param request - The incoming Next.js request object containing trade data in JSON body.
 * @returns A NextResponse object:
 *   - On success (201): { success: true, message: 'Trade entry created successfully', trade }
 *   - On validation failure (400): { success: false, message: 'Missing required fields.' } or similar
 *   - On user not found (404): { success: false, message: 'User not found.' }
 *   - On any other error (500): { error: error.message }
 */
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("Request Body:", reqBody);
    const userId = await getDataFromToken(request);
    const {
     
      dateTime,
      exitDateTime,
      hoursHeld,
      stars,
      pair,
      tradeType,
      lotSize,
      entryPrice,
      takeProfit,
      stopLoss,
      tpDollars,
      slDollars,
      actualExit,
      actualProfitLoss,
      quickRationale,
      comments,
    } = reqBody;

    // Basic validation for required fields
    if (!userId || !dateTime || !pair || !tradeType || !entryPrice || !lotSize) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields.',
        },
        { status: 400 }
      );
    }

    // Validate tradeType
    if (!["Buy", "Sell"].includes(tradeType)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid trade type. Must be either "Buy" or "Sell".',
        },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found.',
        },
        { status: 404 }
      );
    }

    // Create the trade entry in the database
    const trade = await prisma.trade.create({
      data: {
        user: { connect: { id: userId } },
        dateTime: new Date(dateTime),
        exitDateTime: exitDateTime ? new Date(exitDateTime) : null,
        hoursHeld: hoursHeld !== undefined ? hoursHeld : 0,
        stars: stars !== undefined ? stars : 0,
        pair,
        tradeType,
        lotSize: lotSize !== undefined ? lotSize : 0,
        entryPrice,
        takeProfit: takeProfit !== undefined ? takeProfit : null,
        stopLoss: stopLoss !== undefined ? stopLoss : null,
        tpDollars: tpDollars !== undefined ? tpDollars : 0,
        slDollars: slDollars !== undefined ? slDollars : 0,
        actualExit: actualExit !== undefined ? actualExit : null,
        actualProfitLoss: actualProfitLoss !== undefined ? actualProfitLoss : 0,
        quickRationale: quickRationale || "To be added later",
        comments: comments || "To be added later",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Trade entry created successfully',
        trade,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating trade entry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
```