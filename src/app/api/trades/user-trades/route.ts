```typescript
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getDataFromToken } from "@/helper/getDataFromTokens";
import type { NextRequest } from "next/server";

const prisma = new PrismaClient();

/**
 * Handles GET request to retrieve paginated trades for the authenticated user.
 *
 * @param request - The incoming HTTP request object.
 * @returns A NextResponse JSON object containing the list of trades and total count, or an error message.
 * @throws {Error} If database query fails or token extraction fails.
 */
export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Invalid userId provided" }, { status: 400 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const sortBy = searchParams.get("sortBy") || "dateTime";

        const offset = (page - 1) * limit;

        const [trades, total] = await Promise.all([
            prisma.trade.findMany({
                where: { userId: userId },
                orderBy: { [sortBy]: "asc" },
                skip: offset,
                take: limit,
            }),
            prisma.trade.count({ where: { userId: userId } }),
        ]);

        return NextResponse.json({ trades, total }, { status: 200 });

    } catch (error) {
        console.error("Error retrieving trades:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
```