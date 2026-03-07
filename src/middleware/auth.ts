import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Basic verification: expecting the frontend to pass the Firebase UID in headers
    // For a fully secure production app, we would use firebase-admin to verify an ID Token here
    const uid = req.headers['x-user-id'];
    if (!uid) {
        res.status(401).json({ message: 'Unauthorized: No User ID provided' });
        return;
    }
    (req as any).user = { uid: uid as string };
    next();
};
