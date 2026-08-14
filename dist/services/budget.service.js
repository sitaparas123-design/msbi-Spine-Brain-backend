"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetService = exports.BudgetService = void 0;
const db_1 = __importDefault(require("../plugins/db"));
class BudgetService {
    async getBudgetOverview() {
        return db_1.default.budget.findMany({
            include: {
                expenses: true,
            },
        });
    }
    async getPlannedVsActual(query = {}) {
        const { startDate, endDate } = query.startDate && query.endDate
            ? { startDate: new Date(query.startDate), endDate: new Date(query.endDate) }
            : { startDate: new Date(0), endDate: new Date('9999-12-31') };
        const budgets = await db_1.default.budget.findMany();
        // Fetch paid ad spend within the date range
        const adMetrics = await db_1.default.campaignMetricSnapshot.findMany({
            where: { date: { gte: startDate, lte: endDate } },
            include: { campaign: true }
        });
        const adSpendByYearMonthCurrency = {};
        adMetrics.forEach(m => {
            const year = m.date.getFullYear();
            const month = m.date.getMonth() + 1; // 1-12
            const currency = m.currencyCode || 'USD';
            const key = `${year}-${month}-${currency}`;
            if (!adSpendByYearMonthCurrency[key]) {
                adSpendByYearMonthCurrency[key] = { google: 0, meta: 0, currency };
            }
            if (m.campaign.platform === 'google_ads') {
                adSpendByYearMonthCurrency[key].google += Number(m.spend);
            }
            else if (m.campaign.platform === 'meta') {
                adSpendByYearMonthCurrency[key].meta += Number(m.spend);
            }
        });
        const expenses = await db_1.default.expense.findMany({
            where: { date: { gte: startDate, lte: endDate } }
        });
        return budgets.map(b => {
            const currencies = {};
            if (b.month) {
                Object.keys(adSpendByYearMonthCurrency).forEach(k => {
                    if (k.startsWith(`${b.year}-${b.month}-`)) {
                        const data = adSpendByYearMonthCurrency[k];
                        if (!currencies[data.currency])
                            currencies[data.currency] = { googleAdsSpend: 0, metaAdsSpend: 0 };
                        currencies[data.currency].googleAdsSpend += data.google;
                        currencies[data.currency].metaAdsSpend += data.meta;
                    }
                });
            }
            else {
                // annual
                Object.keys(adSpendByYearMonthCurrency).forEach(k => {
                    if (k.startsWith(`${b.year}-`)) {
                        const data = adSpendByYearMonthCurrency[k];
                        if (!currencies[data.currency])
                            currencies[data.currency] = { googleAdsSpend: 0, metaAdsSpend: 0 };
                        currencies[data.currency].googleAdsSpend += data.google;
                        currencies[data.currency].metaAdsSpend += data.meta;
                    }
                });
            }
            // Calculate actual expenses for this budget in the date range
            const budgetExpenses = expenses.filter(e => e.budgetId === b.id);
            const manualExpenses = budgetExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
            return {
                year: b.year,
                month: b.month,
                planned: Number(b.totalPlanned),
                manualExpenses, // Separate from automated ad spend to avoid double count
                adSpendCurrencies: currencies,
                variance: Number(b.totalPlanned) - manualExpenses
            };
        });
    }
    async getVendorSpending() {
        const expenses = await db_1.default.expense.findMany({
            include: { vendor: true }
        });
        const vendorMap = {};
        expenses.forEach(ex => {
            const vendorName = ex.vendor ? ex.vendor.name : 'Unknown Vendor';
            vendorMap[vendorName] = (vendorMap[vendorName] || 0) + Number(ex.amount);
        });
        return Object.entries(vendorMap).map(([vendor, totalSpend]) => ({
            vendor,
            totalSpend
        })).sort((a, b) => b.totalSpend - a.totalSpend);
    }
    async addExpense(data) {
        const expense = await db_1.default.expense.create({
            data: {
                budgetId: data.budgetId,
                category: data.category,
                amount: data.amount,
                vendorId: data.vendorId,
                date: new Date(data.date),
                description: data.description,
            },
        });
        // Automatically update the budget's total actual
        await db_1.default.budget.update({
            where: { id: data.budgetId },
            data: { totalActual: { increment: data.amount } }
        });
        return expense;
    }
}
exports.BudgetService = BudgetService;
exports.budgetService = new BudgetService();
