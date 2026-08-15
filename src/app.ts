import fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { errorHandler } from './middlewares/error.middleware';
import { authRoutes } from './routes/auth.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { userRoutes } from './routes/users.routes';
import { campaignRoutes } from './routes/campaigns.routes';
import { budgetRoutes } from './routes/budget.routes';
import { vendorRoutes } from './routes/vendors.routes';
import { analyticsRoutes } from './routes/analytics.routes';
import { reputationRoutes } from './routes/reputation.routes';
import { settingsRoutes } from './routes/settings.routes';
import { reportsRoutes } from './routes/reports.routes';
import { integrationsRoutes } from './routes/integrations.routes';
import { leadsRoutes } from './routes/leads.routes';
import { callsRoutes } from './routes/calls.routes';
import { formSubmissionsRoutes } from './routes/form-submissions.routes';
import rbacRoutes from './routes/rbac.routes';
import googleOAuthRoutes from './routes/google-oauth.routes';
import { webhooksRoutes } from './routes/webhooks.routes';
import fastifyRateLimit from '@fastify/rate-limit';

export const buildApp = () => {
  const app = fastify({
    logger: false, // Custom logger will be used in server.ts
    ignoreTrailingSlash: true
  });

  // Setup Zod compiler for validation
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Global Error Handler
  app.setErrorHandler(errorHandler);

  // Register Core Plugins
  app.register(cors, {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  
  app.register(fastifyRateLimit, {
    global: false // We will apply it specifically on the routes we want
  });

  // API Status Route
  app.get('/api/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  app.get('/api/health-db-debug', async (request, reply) => {
    try {
      const prismaClient = (app as any).prisma || require('./plugins/db').default;
      const tables = await prismaClient.$queryRawUnsafe(`SHOW TABLES;`);
      
      let leadTableColumns: any = null;
      try {
        leadTableColumns = await prismaClient.$queryRawUnsafe(`DESCRIBE \`Lead\`;`);
      } catch (e: any) {
        leadTableColumns = { error: e.message };
      }

      let leadLowercaseColumns: any = null;
      try {
        leadLowercaseColumns = await prismaClient.$queryRawUnsafe(`DESCRIBE \`lead\`;`);
      } catch (e: any) {
        leadLowercaseColumns = { error: e.message };
      }

      return reply.send({
        success: true,
        tables,
        leadTableColumns,
        leadLowercaseColumns
      });
    } catch (err: any) {
      return reply.send({ success: false, error: err.message });
    }
  });

  // Register Domain Modules (Phase 1, 2, 3 & 4)
  app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.register(dashboardRoutes, { prefix: '/api/v1/dashboard' });
  app.register(userRoutes, { prefix: '/api/v1/users' });
  app.register(campaignRoutes, { prefix: '/api/v1/campaigns' });
  app.register(budgetRoutes, { prefix: '/api/v1/budget' });
  app.register(vendorRoutes, { prefix: '/api/v1/vendors' });
  app.register(analyticsRoutes, { prefix: '/api/v1/analytics' });
  app.register(reputationRoutes, { prefix: '/api/v1/reputation' });
  app.register(settingsRoutes, { prefix: '/api/v1/settings' });
  app.register(reportsRoutes, { prefix: '/api/v1/reports' });
  app.register(integrationsRoutes, { prefix: '/api/v1/integrations' });
  app.register(leadsRoutes, { prefix: '/api/v1/leads' });
  app.register(callsRoutes, { prefix: '/api/v1/calls' });
  app.register(formSubmissionsRoutes, { prefix: '/api/v1/form-submissions' });
  app.register(rbacRoutes, { prefix: '/api/v1/roles' });
  app.register(googleOAuthRoutes, { prefix: '/api/v1/integrations' });
  app.register(webhooksRoutes, { prefix: '/api/v1/webhooks' });

  return app;
};




