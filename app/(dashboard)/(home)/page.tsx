import { GetPeriods } from "@/actions/analytics/getPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "@/app/(dashboard)/(home)/_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardsValue } from "@/actions/analytics/getStatsCardsValue";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import StatsCard from "@/app/(dashboard)/(home)/_components/StatsCard";
import { GetWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";

function HomePage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const currentDate = new Date();
  const { month, year } = searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodicSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton  className="w-full h-[300px]"/>}>
          <StatsExecutionsStatus selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}

async function PeriodicSelectorWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods = await GetPeriods();
  return <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />;
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetStatsCardsValue(selectedPeriod);
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Worflow executions"
        value={data.workflowsExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase executions"
        value={data.phasesExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full h-[120px]" />
      ))}
    </div>
  );
}

async function StatsExecutionsStatus({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={data}/>;
}

export default HomePage;
