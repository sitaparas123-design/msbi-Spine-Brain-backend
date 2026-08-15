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

    // Idempotent migration to ensure originalSubmissionId column and index exist in production MySQL database
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE \`Lead\` ADD COLUMN \`originalSubmissionId\` VARCHAR(191) NULL;
      `);
      logger.info('Migration SQL: originalSubmissionId column added successfully');
    } catch (e: any) {
      if (e.message?.includes('Duplicate column') || e.message?.includes('1060')) {
        logger.info('Migration SQL: originalSubmissionId column already exists');
      } else {
        logger.error('Migration SQL error adding column: ' + e.message);
      }
    }

    try {
      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX \`Lead_originalSubmissionId_key\` ON \`Lead\`(\`originalSubmissionId\`);
      `);
      logger.info('Migration SQL: originalSubmissionId unique index created successfully');
    } catch (e: any) {
      if (e.message?.includes('Duplicate key') || e.message?.includes('1061')) {
        logger.info('Migration SQL: unique index already exists');
      } else {
        logger.error('Migration SQL error creating index: ' + e.message);
      }
    }

    await app.listen({ port: PORT, host: '0.0.0.0' });
    logger.info(`Server listening on http://localhost:${PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
