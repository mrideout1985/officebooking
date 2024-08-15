import { Request, Response } from 'express';
import { createUser } from '../services/user/userService';

export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await createUser(name, email);

    return res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
};
