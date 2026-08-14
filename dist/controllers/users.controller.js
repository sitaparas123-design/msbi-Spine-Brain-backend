"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityLogsHandler = exports.getRolesHandler = exports.createUserHandler = exports.getUsersHandler = void 0;
const users_service_1 = require("../services/users.service");
const getUsersHandler = async (request, reply) => {
    const users = await users_service_1.usersService.getAllUsers();
    return reply.send({ success: true, data: users });
};
exports.getUsersHandler = getUsersHandler;
const createUserHandler = async (request, reply) => {
    try {
        const user = await users_service_1.usersService.createUser(request.body);
        // Exclude password from response
        const { passwordHash, ...safeUser } = user;
        return reply.status(201).send({ success: true, data: safeUser });
    }
    catch (err) {
        return reply.status(400).send({ success: false, message: 'Email already exists or invalid data.' });
    }
};
exports.createUserHandler = createUserHandler;
const getRolesHandler = async (request, reply) => {
    const roles = await users_service_1.usersService.getRoles();
    return reply.send({ success: true, data: roles });
};
exports.getRolesHandler = getRolesHandler;
const getActivityLogsHandler = async (request, reply) => {
    const logs = await users_service_1.usersService.getActivityLogs();
    return reply.send({ success: true, data: logs });
};
exports.getActivityLogsHandler = getActivityLogsHandler;
