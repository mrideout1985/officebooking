import { Router } from "express";
import { z } from "zod";
import {
  handleCreateUser,
  handleGetloggedInUser,
  handleLoginUser,
} from "../controllers/userController";
import { validateSchema } from "../middlewares/validateSchema";
import { authenticateToken } from "../middlewares/authenticateToken";

const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get logged in user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-08-17T12:34:56.789Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-08-17T12:34:56.789Z"
 *       401:
 *         description: Unauthorized - User is not logged in or token is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access - please log in"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving user data"
 */
router.get("/me", authenticateToken, handleGetloggedInUser)

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: Password1
 *     responses:
 *       200:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post("/create", validateSchema(createUserSchema), handleCreateUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: Password1
 *     responses:
 *       200:
 *         description: Successfully logged in. Returns the user details and a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTYyNjQ2MDAwMCwiZXhwIjoxNjI2NDYzNjAwfQ.9LhMIlb6eUnuKmI1EJg7Yv73iI-XO7Y-JXcbY2DHDFg
 *       401:
 *         description: Unauthorized. Incorrect email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is not registered or Incorrect Password
 *       500:
 *         description: Server error
 */
router.post("/login", validateSchema(loginUserSchema), handleLoginUser);

export default router;
