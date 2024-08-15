import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/models';
import ApiError from '../error/ApiError';

const generateJwt = (id: number, login: string, role: string): string => {
    return jwt.sign(
        { id, login, role },
        process.env.SECRET_KEY as string,
        { expiresIn: '24h' }
    );
};

class UserController {
    async getUserData(req: Request, res: Response, next: NextFunction) {
        const { id } = req.body;
        try {
            const user = await User.findOne({ where: { id } });
            return res.json({ user });
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
        }
    }

    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const { login, password, role } = req.body;
            if (!login || !password) {
                return next(ApiError.badRequest('Не задан пароль или логин'));
            }
            const candidate = await User.findOne({ where: { login } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь уже существует'));
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ login, role, password: hashPassword });
            const token = generateJwt(user.id, user.login, user.role);
            return res.json({ token });
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const { login, password } = req.body;
        const user = await User.findOne({ where: { login } });
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'));
        }
        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Неверный пароль'));
        }
        const token = generateJwt(user.id, user.login, user.role);
        return res.json({ token });
    }

    async check(req: Request, res: Response, next: NextFunction) {
        const token = generateJwt(req.body.user.id, req.body.user.login, req.body.user.role);
        return res.json({ token });
    }

    async editUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, name, login } = req.body;
            const user = await User.findOne({ where: { id } });
            if (!user) {
                next(ApiError.badRequest('no user'));
                return;
            }

            if (name) {
                user.name = name;
            }

            if (login) {
                user.login = login;
            }

            await user.save();
            return res.json({ message: 'correct' });
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, password } = req.body;
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.update(
                { password: hashPassword },
                { where: { id } }
            );

            if (user[0] === 0) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            const updatedUser = await User.findOne({ where: { id } });
            if (updatedUser) {
                const token = generateJwt(updatedUser.id, updatedUser.login, updatedUser.role);
                return res.json({ token });
            } else {
                return next(ApiError.internal('Ошибка при обновлении пользователя'));
            }
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
        }
    }
}

export default new UserController();
