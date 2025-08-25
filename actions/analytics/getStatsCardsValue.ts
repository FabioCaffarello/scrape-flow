"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

export async function GetStatsCardsValue(period: Period) {
  const dateRange = PeriodToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: {
          creditsConsumed: true,
        },
      },
    },
  });

  const stats = {
    workflowsExecutions: executions.length,
    creditsConsumed: 0,
    phasesExecutions: 0,
  };

  stats.creditsConsumed = executions.reduce(
    (acc, exec) => acc + exec.creditsConsumed,
    0
  );
  stats.phasesExecutions = executions.reduce(
    (acc, exec) => acc + exec.phases.length,
    0
  );

  return stats;
}
