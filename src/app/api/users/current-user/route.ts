import { getDataFromToken } from "@/helper/getDataFromTokens"; // Make sure this helper retrieves the user ID correctly
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Get user ID from token using the helper function
        const userId = await getDataFromToken(request);

        // Retrieve user data from the database using Prisma
        const user = await prisma.user.findUnique({
            where: { id: userId }, // Use the correct ID field based on your schema
            select: {
                id: true,
                fullname: true,
                username: true,
                email: true,
                avatar: true,
                
            },
        });

        // Check if the user was found
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Return the found user data
        return NextResponse.json({
            message: "User found",
            data: user,
        });
    } catch (error: any) {
        // Return error message in case of failure
        return NextResponse.json({ error: error.message }, { status: 400 });
    } finally {
        await prisma.$disconnect(); // Ensure Prisma client disconnects
    }
}
