export const authMiddleware = (req, res, next) => {
    // Basic verification: expecting the frontend to pass the Firebase UID in headers
    // For a fully secure production app, we would use firebase-admin to verify an ID Token here
    const uid = req.headers['x-user-id'];
    if (!uid) {
        res.status(401).json({ message: 'Unauthorized: No User ID provided' });
        return;
    }
    req.user = { uid: uid };
    next();
};
