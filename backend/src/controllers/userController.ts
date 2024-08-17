import { Request, Response } from "express";
import { createUser, loginUser } from "../services/user/userService";

export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await createUser(email, password);

    return res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

export const handleLoginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    return res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
};
