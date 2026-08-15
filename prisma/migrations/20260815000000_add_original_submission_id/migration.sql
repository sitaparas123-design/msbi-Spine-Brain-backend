-- AlterTable
ALTER TABLE `lead` ADD COLUMN `originalSubmissionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `lead_originalSubmissionId_key` ON `lead`(`originalSubmissionId`);
