import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../configs/prisma';
import { handleCreateUser } from '../controllers/userController';
import { z } from 'zod';
import { validateSchema } from '../middlewares/validateSchema';

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address')
});

const router = Router();
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
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
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
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/create', validateSchema(createUserSchema), handleCreateUser);

export default router;
