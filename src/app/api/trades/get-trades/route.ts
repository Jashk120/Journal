```typescript
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Export the GET function
/**
 * Handles GET requests to retrieve all trade entries from the database.
 *
 * @param req - The incoming HTTP request object.
 * @returns A NextResponse containing the array of trades with status 200, or an error message with status 500.
 */
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
```