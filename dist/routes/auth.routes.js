"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const auth_controller_1 = require("../controllers/auth.controller");
const auth_schema_1 = require("../validators/auth.schema");
async function authRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.post('/login', {
        schema: {
            body: auth_schema_1.loginSchema,
        },
    }, auth_controller_1.loginHandler);
    server.get('/me', auth_controller_1.getCurrentUserHandler);
}
