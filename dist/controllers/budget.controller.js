"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpenseHandler = exports.getVendorSpendingHandler = exports.getPlannedVsActualHandler = exports.getBudgetOverviewHandler = void 0;
const budget_service_1 = require("../services/budget.service");
const getBudgetOverviewHandler = async (request, reply) => {
    const budgets = await budget_service_1.budgetService.getBudgetOverview();
    return reply.send({ success: true, data: budgets });
};
exports.getBudgetOverviewHandler = getBudgetOverviewHandler;
const getPlannedVsActualHandler = async (request, reply) => {
    const data = await budget_service_1.budgetService.getPlannedVsActual();
    return reply.send({ success: true, data });
};
exports.getPlannedVsActualHandler = getPlannedVsActualHandler;
const getVendorSpendingHandler = async (request, reply) => {
    const data = await budget_service_1.budgetService.getVendorSpending();
    return reply.send({ success: true, data });
};
exports.getVendorSpendingHandler = getVendorSpendingHandler;
const createExpenseHandler = async (request, reply) => {
    const expense = await budget_service_1.budgetService.addExpense(request.body);
    return reply.status(201).send({ success: true, data: expense });
};
exports.createExpenseHandler = createExpenseHandler;
