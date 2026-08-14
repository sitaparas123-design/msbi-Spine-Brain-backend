"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = exports.UsersService = void 0;
const db_1 = __importDefault(require("../plugins/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UsersService {
    async getAllUsers() {
        return db_1.default.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                roleName: true,
                isActive: true,
                department: true,
                createdAt: true,
            },
        });
    }
    async createUser(data) {
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(data.password, salt);
        return db_1.default.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                roleName: data.role,
                departmentId: data.departmentId,
            },
        });
    }
    async getRoles() {
        // In a simple setup, extract unique roles from DB or return static list
        return [
            { id: 'ADMIN', name: 'Administrator' },
            { id: 'MARKETING_MANAGER', name: 'Marketing Manager' },
            { id: 'USER', name: 'Standard User' }
        ];
    }
    async getActivityLogs() {
        return db_1.default.activityLog.findMany({
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
            orderBy: { timestamp: 'desc' },
            take: 50
        });
    }
}
exports.UsersService = UsersService;
exports.usersService = new UsersService();
