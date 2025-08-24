-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workflow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "definition" TEXT NOT NULL,
    "executionPlan" TEXT,
    "creditsCost" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "lastRunAt" DATETIME,
    "lastRunId" TEXT,
    "lastRunStatus" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Workflow" ("createdAt", "definition", "description", "id", "lastRunAt", "lastRunId", "lastRunStatus", "name", "status", "updatedAt") SELECT "createdAt", "definition", "description", "id", "lastRunAt", "lastRunId", "lastRunStatus", "name", "status", "updatedAt" FROM "Workflow";
DROP TABLE "Workflow";
ALTER TABLE "new_Workflow" RENAME TO "Workflow";
CREATE UNIQUE INDEX "Workflow_name_key" ON "Workflow"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
