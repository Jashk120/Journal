import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    // Find the user with Prisma
    const user = await prisma.user.findUnique({
      where: { username: decodedUsername },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User does not exist',
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExp) > new Date();
    
    if (isCodeValid && isCodeNotExpired) {
      // Update user's verification status with Prisma
      await prisma.user.update({
        where: { username: decodedUsername },
        data: { isVerified: true },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Account verified successfully',
        },
        { status: 200 }
      );
      
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: 'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Incorrect verification code',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error Verifying User:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error Verifying User',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
