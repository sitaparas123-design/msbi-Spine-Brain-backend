"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetRoutes = budgetRoutes;
const budget_controller_1 = require("../controllers/budget.controller");
const budget_schema_1 = require("../validators/budget.schema");
async function budgetRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.get('/overview', budget_controller_1.getBudgetOverviewHandler);
    server.get('/planned-vs-actual', budget_controller_1.getPlannedVsActualHandler);
    server.get('/vendor-spending', budget_controller_1.getVendorSpendingHandler);
    server.post('/expenses', {
        schema: {
            body: budget_schema_1.createExpenseSchema,
        },
    }, budget_controller_1.createExpenseHandler);
}
