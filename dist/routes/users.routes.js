"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const users_controller_1 = require("../controllers/users.controller");
const users_schema_1 = require("../validators/users.schema");
async function userRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.get('/', users_controller_1.getUsersHandler);
    server.post('/', {
        schema: { body: users_schema_1.createUserSchema },
    }, users_controller_1.createUserHandler);
    server.get('/roles', users_controller_1.getRolesHandler);
    server.get('/activity-logs', users_controller_1.getActivityLogsHandler);
}
