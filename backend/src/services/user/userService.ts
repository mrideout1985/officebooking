import prisma from "../../configs/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET;
console.log("Secret Key:", secretKey);

export const createUser = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  try {
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

export const loginUser = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  try {
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
      { user: existingUser.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    return {
      token,
    };
  } catch (error) {
    throw error;
  }
};
