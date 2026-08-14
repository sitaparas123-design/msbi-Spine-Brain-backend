"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallsHandler = exports.createCallWebhookHandler = void 0;
const calls_service_1 = require("../services/calls.service");
const createCallWebhookHandler = async (request, reply) => {
    const callLog = await calls_service_1.callsService.createCall(request.body);
    return reply.send({ success: true, data: callLog });
};
exports.createCallWebhookHandler = createCallWebhookHandler;
const getCallsHandler = async (request, reply) => {
    const calls = await calls_service_1.callsService.getCalls();
    return reply.send({ success: true, data: calls });
};
exports.getCallsHandler = getCallsHandler;
