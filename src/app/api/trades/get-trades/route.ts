import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Export the GET function
export async function GET(req: Request) {
    try {
        // Retrieve all trade entries
        const trades = await prisma.trade.findMany();

        return NextResponse.json(trades, { status: 200 });

    } catch (error) {
        console.error("Error retrieving trades:", error);

        // Handle error with message check
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure Prisma client disconnects
    }
}
