import { Request, Response } from "express";
import { createUser, getLoggedInUser, loginUser } from "../services/user/userService";
import { json } from "body-parser";
import { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  token?: JwtPayload;
}

export const handleCreateUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await createUser(email, password);
    return res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

export const handleLoginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await loginUser(req, res);
    return res.status(201).json(user);
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Failed to log in user" });
  }
};
export const handleGetloggedInUser = async (req: CustomRequest, res: Response) => {
    try {
      const user = await getLoggedInUser(req.token?.user)
      return res.status(200).json(user)
    } catch (error) {
      console.log("Error getting user data:", error)
      return res.status(500).json({error: "Failed to retrieve user data"})
    }
  }