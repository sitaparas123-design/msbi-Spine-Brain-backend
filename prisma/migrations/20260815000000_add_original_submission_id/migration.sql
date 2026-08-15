-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `originalSubmissionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Lead_originalSubmissionId_key` ON `Lead`(`originalSubmissionId`);
