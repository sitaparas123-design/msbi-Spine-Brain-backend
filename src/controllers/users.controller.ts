import { FastifyRequest, FastifyReply } from 'fastify';
import { usersService } from '../services/users.service';
import { CreateUserInput } from '../validators/users.schema';

export const getUsersHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const users = await usersService.getAllUsers();
  return reply.send({ success: true, data: users });
};

export const createUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) => {
  try {
    const user = await usersService.createUser(request.body);
    // Exclude password from response
    const { passwordHash, ...safeUser } = user;
    return reply.status(201).send({ success: true, data: safeUser });
  } catch (err: any) {
    return reply.status(400).send({ success: false, message: 'Email already exists or invalid data.' });
  }
};

export const getRolesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const roles = await usersService.getRoles();
  return reply.send({ success: true, data: roles });
};

export const getActivityLogsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const logs = await usersService.getActivityLogs();
  return reply.send({ success: true, data: logs });
};
