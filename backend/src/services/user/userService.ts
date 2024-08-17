import prisma from "../../configs/prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createUser = async (email: string, password: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error = new Error("Email already in use");
      (error as any).status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      const error = new Error("Email is not registered");
      (error as any).status = 401;
      throw error;
    }
    
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      const error = new Error("Incorrect Password");
      (error as any).status = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        user: {
          id: existingUser.id,
          email: existingUser.email,
        },
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    console.log(token)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
  } catch (error) {
    throw error;
  }
};

export const getLoggedInUser = async (userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      const error = new Error("User not found");
      (error as any).status = 404;
      throw error;
    }

    return user;
  } catch (error) {
    throw error;
  }
};
