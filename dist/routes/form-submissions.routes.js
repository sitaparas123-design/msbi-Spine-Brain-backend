"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formSubmissionsRoutes = formSubmissionsRoutes;
const form_submissions_controller_1 = require("../controllers/form-submissions.controller");
async function formSubmissionsRoutes(fastify) {
    // Use requireAuth to protect these endpoints via RBAC once auth is fully implemented
    fastify.get('', form_submissions_controller_1.getFormSubmissionsHandler);
    fastify.get('/:id', form_submissions_controller_1.getFormSubmissionByIdHandler);
}
