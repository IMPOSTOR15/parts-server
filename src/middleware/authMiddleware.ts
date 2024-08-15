import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: any; // You can replace 'any' with a more specific type if you know the shape of the decoded token
}

export default function (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void {
    if (req.method === 'OPTIONS') {
        return next(); // Here we return void, so it's fine
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Не авторизован" });
        }

        const token = authHeader.split(' ')[1]; // Bearer <token>
        if (!token) {
            return res.status(401).json({ message: "Не авторизован" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
        req.user = decoded;
        next(); // This returns void, which is fine
    } catch (e) {
        return res.status(401).json({ message: "Не авторизован" });
    }
}
