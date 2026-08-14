import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../plugins/db';
import { z } from 'zod';

const createRoleSchema = z.object({
  name: z.string().min(2),
  permissions: z.record(z.string(), z.boolean()).optional()
});

const updateRoleSchema = z.object({
  permissions: z.record(z.string(), z.boolean())
});

export const getRolesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return reply.send({ success: true, data: roles });
  } catch (error: any) {
    return reply.status(500).send({ success: false, message: error.message });
  }
};

export const createRoleHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = createRoleSchema.parse(request.body);
    
    // Check if role exists
    const existing = await prisma.role.findUnique({ where: { name: data.name } });
    if (existing) {
      return reply.status(400).send({ success: false, message: 'Role already exists' });
    }

    const role = await prisma.role.create({
      data: {
        name: data.name,
        permissions: (data.permissions || {}) as any,
        isSystem: false
      }
    });

    return reply.status(201).send({ success: true, data: role });
  } catch (error: any) {
    return reply.status(400).send({ success: false, message: error.message });
  }
};

export const updateRolePermissionsHandler = async (
  request: FastifyRequest<{ Params: { name: string } }>, 
  reply: FastifyReply
) => {
  try {
    const { name } = request.params;
    const data = updateRoleSchema.parse(request.body);

    const role = await prisma.role.update({
      where: { name },
      data: { permissions: data.permissions as any }
    });

    return reply.send({ success: true, data: role });
  } catch (error: any) {
    return reply.status(400).send({ success: false, message: error.message });
  }
};

export const deleteRoleHandler = async (
  request: FastifyRequest<{ Params: { name: string } }>, 
  reply: FastifyReply
) => {
  try {
    const { name } = request.params;
    
    const role = await prisma.role.findUnique({ where: { name } });
    if (!role) {
      return reply.status(404).send({ success: false, message: 'Role not found' });
    }

    if (role.isSystem) {
      return reply.status(403).send({ success: false, message: 'Cannot delete system roles' });
    }

    // Assign users of this role to Admin as fallback to prevent orphans
    await prisma.user.updateMany({
      where: { roleName: name },
      data: { roleName: 'Admin' }
    });

    await prisma.role.delete({ where: { name } });

    return reply.send({ success: true, message: 'Role deleted successfully' });
  } catch (error: any) {
    return reply.status(500).send({ success: false, message: error.message });
  }
};
