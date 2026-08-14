"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const db_1 = __importDefault(require("../plugins/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
class AuthService {
    async login(data) {
        const user = await db_1.default.user.findUnique({ where: { email: data.email } });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isValidPassword = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.roleName }, JWT_SECRET, { expiresIn: '1d' });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.roleName,
                departmentId: user.departmentId
            }
        };
    }
    async getCurrentUser(userId) {
        return db_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                roleName: true,
                isActive: true,
                department: true,
            }
        });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
