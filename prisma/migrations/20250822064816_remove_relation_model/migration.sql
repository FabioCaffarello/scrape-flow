/*
  Warnings:

  - The primary key for the `WorkflowBalance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `balance` on the `WorkflowBalance` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `WorkflowBalance` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkflowBalance" (
    "workflowId" TEXT NOT NULL PRIMARY KEY,
    "credits" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_WorkflowBalance" ("workflowId") SELECT "workflowId" FROM "WorkflowBalance";
DROP TABLE "WorkflowBalance";
ALTER TABLE "new_WorkflowBalance" RENAME TO "WorkflowBalance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
