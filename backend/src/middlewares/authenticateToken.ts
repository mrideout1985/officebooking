import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken"

export interface CustomRequest extends Request {
    token: string | JwtPayload;
   }

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token
   
      if (!token) {
        throw new Error();
      }
   
      const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
      (req as CustomRequest).token = decoded;

      console.log("decoded", decoded)
   
      next();
    } catch (err) {
      res.status(401).send('Please authenticate');
    }
   };