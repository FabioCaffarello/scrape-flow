"use client";

import React from "react";
import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext";
import { Workflow } from "@prisma/client";
import FlowEditor from "./FlowEditor";
import { ReactFlowProvider } from "@xyflow/react";
import Topbar from "./topbar/Topbar";
import TaskMenu from "./TaskMenu";

function Editor({ workflow }: { workflow: Workflow }) {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex h-full w-full flex-col overflow-hidden">
          <Topbar
            title="Workflow editor"
            subtitle={workflow.name}
            workflowId={workflow.id}
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
