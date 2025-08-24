import React from "react";
import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import ExecutionViewer from "./_components/ExecutionViewer";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import Topbar from "@/app/workflow/_components/topbar/TopBar";

export default function ExecutionViewerPage({
  params,
}: {
  params: { executionId: string; workflowId: string };
}) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={params.workflowId}
        title="Workflow run details"
        subtitle={`Run ID: ${params.executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
  if (!workflowExecution) {
    return <div>Not found</div>;
  }
  return <ExecutionViewer initialData={workflowExecution} />;
}
