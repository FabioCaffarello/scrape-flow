"use client";

import useFlowValidation from "@/components/hooks/useFlowValidation";
import { ReactNode } from "react";
import { useReactFlow } from "@xyflow/react";
import { cn } from "@/lib/utils";

function NodeCard({
  children,
  nodeId,
  isSelected,
}: {
  children: ReactNode;
  isSelected: boolean;
  nodeId: string;
}) {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();
  const hasInvalidInuts = invalidInputs.some((node) => node.nodeId === nodeId);
  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, mesured } = node;
        if (!position || !mesured) return;
        const { width, height } = mesured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;

        if (x === undefined || y === undefined) return;

        setCenter(x, y, {
          zoom: 1,
          duration: 500,
        });
      }}
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-primary",
        hasInvalidInuts && "border-destructive border-2",
      )}
    >
      {children}
    </div>
  );
}

export default NodeCard;
