import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json().catch(() => null); 
    console.log("Request Body:", reqBody);
    const { email, password } = reqBody;
    

    // Check if user exists with Prisma
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }
    

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }
  


    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    // Create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
        expiresIn: "1d",
    });

    // Set the token in an HTTP-only cookie
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60, // 1 day in seconds
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: "Error when trying to login" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
