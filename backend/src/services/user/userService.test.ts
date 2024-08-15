import prisma from '../../configs/prisma';
import { createUser } from './userService';

jest.mock('../../configs/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn()
  }
}));

describe('createUser service', () => {
  it('should create a new user successfully', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com'
    });

    const result = await createUser('John Doe', 'john.doe@example.com');

    expect(result).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com'
    });
  });

  it('should throw an error if email is already in use', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com'
    });

    await expect(
      createUser('John Doe', 'john.doe@example.com')
    ).rejects.toThrow('Email already in use');
  });
});
