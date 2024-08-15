import { Request, Response } from 'express';
import { handleCreateUser } from './userController';
import * as userService from '../services/user/userService';

jest.mock('../services/user/userService');

describe('handleCreateUser', () => {
  it('should respond with the created user', async () => {
    const req = {
      body: { name: 'John Doe', email: 'john.doe@example.com' }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    (userService.createUser as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com'
    });

    await handleCreateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com'
    });
  });

  it('should handle errors gracefully', async () => {
    const req = {
      body: { name: 'John Doe', email: 'john.doe@example.com' }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (userService.createUser as jest.Mock).mockRejectedValue(
      new Error('Failed to create user')
    );

    await handleCreateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create user' });
  });
});
