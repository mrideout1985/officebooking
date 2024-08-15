import prisma from '../../configs/prisma';

export const createUser = async (name: string, email: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    const error = new Error('Email already in use');
    (error as any).status = 400;
    throw error;
  }

  const user = await prisma.user.create({
    data: {
      name,
      email
    }
  });

  return user;
};
