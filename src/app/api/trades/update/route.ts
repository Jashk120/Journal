import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {
            tradeId,
            exitDateTime,
            hoursHeld,
            stars,
            takeProfit,
            stopLoss,
            tpDollars,
            slDollars,
            actualExit,
            actualProfitLoss,
            quickRationale,
            comments,
        } = reqBody;

        // Validate tradeId
        if (!tradeId) {
            return NextResponse.json({ error: "Trade ID is required." }, { status: 400 });
        }

        // Retrieve current trade data
        const currentTrade = await prisma.trade.findUnique({
            where: { id: tradeId }
        });

        if (!currentTrade) {
            return NextResponse.json({ error: "Trade not found." }, { status: 404 });
        }

        // Update the trade entry only with provided values, fallback to current values if not provided
        const updatedTrade = await prisma.trade.update({
            where: { id: tradeId },
            data: {
                exitDateTime: exitDateTime ? new Date(exitDateTime) : currentTrade.exitDateTime,
                hoursHeld: hoursHeld !== undefined ? hoursHeld : currentTrade.hoursHeld,
                stars: stars !== undefined ? stars : currentTrade.stars,
                takeProfit: takeProfit !== undefined ? takeProfit : currentTrade.takeProfit,
                stopLoss: stopLoss !== undefined ? stopLoss : currentTrade.stopLoss,
                tpDollars: tpDollars !== undefined ? tpDollars : currentTrade.tpDollars,
                slDollars: slDollars !== undefined ? slDollars : currentTrade.slDollars,
                actualExit: actualExit !== undefined ? actualExit : currentTrade.actualExit,
                actualProfitLoss: actualProfitLoss !== undefined ? actualProfitLoss : currentTrade.actualProfitLoss,
                quickRationale: quickRationale !== undefined ? quickRationale : currentTrade.quickRationale,
                comments: comments !== undefined ? comments : currentTrade.comments,
            },
        });

        return NextResponse.json(updatedTrade, { status: 200 });

    } catch (error) {
        console.error('Error updating trade:', error);

        // Type guard to check if 'error' is an instance of 'Error'
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure Prisma client disconnects
    }
}
