import dotenv from 'dotenv';
import { buildApp } from './app';
import { logger } from './utils/logger';
import prisma from './plugins/db';

dotenv.config();

const PORT = parseInt(process.env.PORT || '8000', 10);

const start = async () => {
  const app = buildApp();

  try {
    // Test DB connection
    await prisma.$connect();
    logger.info('Connected to PostgreSQL Database via Prisma');

    await app.listen({ port: PORT, host: '0.0.0.0' });
    logger.info(`Server listening on http://localhost:${PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
