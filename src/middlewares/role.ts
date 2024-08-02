import { Request, Response, NextFunction } from 'express';

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Superadmin role required.' });
  }
};
