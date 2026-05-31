import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface AuthRequest extends Request {
    user?: {id: number};
}

/**
 * Middleware para autenticação usando JWT.
 * @param req - Requisição HTTP.
 * @param res - Resposta HTTP.
 * @param next - Função para avançar para o próximo middleware.
 * @returns Promise<void>
 */
export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
    
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
     res.status(401).json({ error: 'Token de autenticação não fornecido.' });
        return;
    }

    const [bearer, token] = authHeader.split(' ');

    if (!token || bearer.toLowerCase() !== 'bearer') {
        res.status(401).json({ message: 'Token inválido.' });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || 'default_secret';
        const decoded = jwt.verify(token, secret) as { id: number };
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token de autenticação inválido.' });
    }
}