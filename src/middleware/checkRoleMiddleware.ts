import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
interface DecodedToken {
    id: number;
    login: string;
    role: string;
    iat: number;
    exp: number;
}
export interface CustomRequest extends Request {
    user?: DecodedToken;
    headers: any;
}

export default function(role: string) {
    return function(req: CustomRequest, res: Response, next: NextFunction): Response | void {
        if (req.method === 'OPTIONS') {
            return next();
        }

        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: "Не авторизован" });
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Не авторизован" });
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as DecodedToken;

            if (decoded.role !== role) {
                return res.status(403).json({ message: "Нет доступа" });
            }

            req.user = decoded;
            next();
        } catch (e) {
            return res.status(401).json({ message: "Не авторизован" });
        }
    }
}
