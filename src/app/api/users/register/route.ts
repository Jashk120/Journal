import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from "@/helper/SendVerificationEmail";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json().catch(() => null); // Safely handle potential errors
    console.log("Request Body:", reqBody);

    const { username, email, password, fullname, age } = reqBody; 

    if (!(username || email)){
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide Email and username',
        },
        { status: 400 }
      );
    }
    const existingVerifiedUserByUsername = await prisma.user.findFirst({
      where: {
        username: username,
        isVerified: true,
      },
    });

    if (existingVerifiedUserByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    // Check if an unverified user with the same email exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // If user is verified, throw error; else update
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      }

      // Update unverified user with new data
      
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          verifyCode,
          verifyCodeExp: new Date(Date.now() + 3600000), // 1 hour expiry
        },
      });
    } else {
      // Create a new user
      

      await prisma.user.create({
        data: {
          fullname,
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExp: new Date(Date.now() + 3600000), // 1 hour expiry
          isVerified: false,
          isActive: true,
          avatar: '',
          role: 'user',
          createdAt: new Date(),
          age,
        },
      });
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, fullname, verifyCode);
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User registered successfully. Please verify your account.',
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error during user registration:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
