import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Export the GET function to retrieve a single trade by tradeId
export async function GET(req: Request, { params }: { params: { tradeId: string } }) {
    const { tradeId } = params; // Extract tradeId from URL parameters

    try {
        // Validate tradeId
        if (!tradeId || typeof tradeId !== "string") {
            return NextResponse.json({ error: "Invalid tradeId provided" }, { status: 400 });
        }

        // Retrieve the trade entry for the specific tradeId
        const trade = await prisma.trade.findUnique({
            where: { id: tradeId } // Ensure tradeId matches your schema type
        });

        if (!trade) {
            return NextResponse.json({ error: "Trade not found" }, { status: 404 });
        }

        return NextResponse.json(trade, { status: 200 });

    } catch (error) {
        console.error("Error retrieving trade:", error);

        // Handle error with message check
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure Prisma client disconnects
    }
}
