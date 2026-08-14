"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoleHandler = exports.updateRolePermissionsHandler = exports.createRoleHandler = exports.getRolesHandler = void 0;
const db_1 = __importDefault(require("../plugins/db"));
const zod_1 = require("zod");
const createRoleSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    permissions: zod_1.z.record(zod_1.z.string(), zod_1.z.boolean()).optional()
});
const updateRoleSchema = zod_1.z.object({
    permissions: zod_1.z.record(zod_1.z.string(), zod_1.z.boolean())
});
const getRolesHandler = async (request, reply) => {
    try {
        const roles = await db_1.default.role.findMany({
            orderBy: { createdAt: 'asc' }
        });
        return reply.send({ success: true, data: roles });
    }
    catch (error) {
        return reply.status(500).send({ success: false, message: error.message });
    }
};
exports.getRolesHandler = getRolesHandler;
const createRoleHandler = async (request, reply) => {
    try {
        const data = createRoleSchema.parse(request.body);
        // Check if role exists
        const existing = await db_1.default.role.findUnique({ where: { name: data.name } });
        if (existing) {
            return reply.status(400).send({ success: false, message: 'Role already exists' });
        }
        const role = await db_1.default.role.create({
            data: {
                name: data.name,
                permissions: (data.permissions || {}),
                isSystem: false
            }
        });
        return reply.status(201).send({ success: true, data: role });
    }
    catch (error) {
        return reply.status(400).send({ success: false, message: error.message });
    }
};
exports.createRoleHandler = createRoleHandler;
const updateRolePermissionsHandler = async (request, reply) => {
    try {
        const { name } = request.params;
        const data = updateRoleSchema.parse(request.body);
        const role = await db_1.default.role.update({
            where: { name },
            data: { permissions: data.permissions }
        });
        return reply.send({ success: true, data: role });
    }
    catch (error) {
        return reply.status(400).send({ success: false, message: error.message });
    }
};
exports.updateRolePermissionsHandler = updateRolePermissionsHandler;
const deleteRoleHandler = async (request, reply) => {
    try {
        const { name } = request.params;
        const role = await db_1.default.role.findUnique({ where: { name } });
        if (!role) {
            return reply.status(404).send({ success: false, message: 'Role not found' });
        }
        if (role.isSystem) {
            return reply.status(403).send({ success: false, message: 'Cannot delete system roles' });
        }
        // Assign users of this role to Admin as fallback to prevent orphans
        await db_1.default.user.updateMany({
            where: { roleName: name },
            data: { roleName: 'Admin' }
        });
        await db_1.default.role.delete({ where: { name } });
        return reply.send({ success: true, message: 'Role deleted successfully' });
    }
    catch (error) {
        return reply.status(500).send({ success: false, message: error.message });
    }
};
exports.deleteRoleHandler = deleteRoleHandler;
