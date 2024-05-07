/* eslint-disable prettier/prettier */


import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a custom interface that extends the Request interface
interface CustomRequest extends Request {
  user?: any; // Add the user property
}

export function authenticateToken(req: CustomRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Access token is missing.' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Access token is invalid.' });
    }
    req.user = user;
    next();
  });
}
