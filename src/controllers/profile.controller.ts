import { Request, Response } from 'express';

export const getProfile = async (req: Request, res: Response) => {
  // Profile controller implementation
  res.json({ message: 'Profile endpoint' });
};

export const getUserProfile = async (req: Request, res: Response) => {
  // User profile controller implementation
  res.json({ message: 'User profile endpoint' });
};

export default { getProfile, getUserProfile };
