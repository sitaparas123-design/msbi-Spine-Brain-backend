import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service';
import { LoginInput } from '../validators/auth.schema';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export const loginHandler = async (
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) => {
  try {
    const result = await authService.login(request.body);
    return reply.send({ success: true, data: result });
  } catch (error: any) {
    return reply.status(401).send({ success: false, message: error.message });
  }
};

export const getCurrentUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const user = await authService.getCurrentUser(decoded.userId);
    if (!user) {
      return reply.status(404).send({ success: false, message: 'User not found' });
    }

    return reply.send({ success: true, data: user });
  } catch (error) {
    return reply.status(401).send({ success: false, message: 'Invalid token' });
  }
};
