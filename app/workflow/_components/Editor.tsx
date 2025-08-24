"use client";

import React from "react";
import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext";
import { Workflow } from "@prisma/client";
import FlowEditor from "./FlowEditor";
import { ReactFlowProvider } from "@xyflow/react";
import Topbar from "./topbar/TopBar";
import TaskMenu from "./TaskMenu";
import { WorkflowStatus } from "@/types/workflow";

function Editor({ workflow }: { workflow: Workflow }) {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex h-full w-full flex-col overflow-hidden">
          <Topbar
            title="Workflow editor"
            subtitle={workflow.name}
            workflowId={workflow.id}
            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
}

export default Editor;
