"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserHandler = exports.loginHandler = void 0;
const auth_service_1 = require("../services/auth.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const loginHandler = async (request, reply) => {
    try {
        const result = await auth_service_1.authService.login(request.body);
        return reply.send({ success: true, data: result });
    }
    catch (error) {
        return reply.status(401).send({ success: false, message: error.message });
    }
};
exports.loginHandler = loginHandler;
const getCurrentUserHandler = async (request, reply) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({ success: false, message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await auth_service_1.authService.getCurrentUser(decoded.userId);
        if (!user) {
            return reply.status(404).send({ success: false, message: 'User not found' });
        }
        return reply.send({ success: true, data: user });
    }
    catch (error) {
        return reply.status(401).send({ success: false, message: 'Invalid token' });
    }
};
exports.getCurrentUserHandler = getCurrentUserHandler;
