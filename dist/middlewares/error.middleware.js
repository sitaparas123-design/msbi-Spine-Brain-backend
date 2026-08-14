"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (error, request, reply) => {
    logger_1.logger.error(error);
    if (error.validation) {
        return reply.status(400).send({
            success: false,
            message: 'Validation Error',
            errors: error.validation,
        });
    }
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : error.message;
    reply.status(statusCode).send({
        success: false,
        message,
    });
};
exports.errorHandler = errorHandler;
