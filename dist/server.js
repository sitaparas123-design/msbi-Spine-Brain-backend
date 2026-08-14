"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const logger_1 = require("./utils/logger");
const db_1 = __importDefault(require("./plugins/db"));
dotenv_1.default.config();
const PORT = parseInt(process.env.PORT || '8000', 10);
const start = async () => {
    const app = (0, app_1.buildApp)();
    try {
        // Test DB connection
        await db_1.default.$connect();
        logger_1.logger.info('Connected to PostgreSQL Database via Prisma');
        await app.listen({ port: PORT, host: '0.0.0.0' });
        logger_1.logger.info(`Server listening on http://localhost:${PORT}`);
    }
    catch (err) {
        logger_1.logger.error(err);
        process.exit(1);
    }
};
start();
