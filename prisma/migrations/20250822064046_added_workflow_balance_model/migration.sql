-- CreateTable
CREATE TABLE "WorkflowBalance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "balance" REAL NOT NULL DEFAULT 0,
    "workflowId" TEXT NOT NULL,
    CONSTRAINT "WorkflowBalance_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
