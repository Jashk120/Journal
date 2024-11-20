import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
    try {
        const { tradeId } = await request.json();

        // Validate tradeId
        if (!tradeId) {
            return NextResponse.json({ error: "Trade ID is required." }, { status: 400 });
        }

        // Check if the trade exists
        const tradeExists = await prisma.trade.findUnique({
            where: { id: tradeId }
        });

        if (!tradeExists) {
            return NextResponse.json({ error: "Trade not found." }, { status: 404 });
        }

        // Delete the trade
        await prisma.trade.delete({
            where: { id: tradeId }
        });

        return NextResponse.json({ message: "Trade deleted successfully." }, { status: 200 });

    } catch (error) {
        console.error('Error deleting trade:', error);

        // Type guard to check if 'error' is an instance of 'Error'
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure Prisma client disconnects
    }
}
