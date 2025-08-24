"use client";

import React from "react";
import SaveBtn from "@/app/workflow/_components/topbar/SaveBtn";
import ExecuteBtn from "@/app/workflow/_components/topbar/ExecuteBtn";
import PublishBtn from "@/app/workflow/_components/topbar/PublishBtn";
import UnpublishBtn from "@/app/workflow/_components/topbar/UnpublishBtn";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import NavigationTabs from "./NavigationTabs";

interface Props {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideButtons?: boolean;
  isPublished?: boolean;
}

function TopBar({ title, subtitle, workflowId, hideButtons = false, isPublished = false }: Props) {
  const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bolt text-ellipsis truncate">{title}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate text-ellipsis">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <NavigationTabs workflowId={workflowId} />
      <div className="flex gap-1 flex-1 justify-end">
        {hideButtons === false && (
          <>
            <ExecuteBtn workflowId={workflowId} />
            {isPublished && (<>
              <UnpublishBtn workflowId={workflowId} />
            </>)}
            {!isPublished && (<>
              <SaveBtn workflowId={workflowId} />
              <PublishBtn workflowId={workflowId} />
            </>)}
          </>
        )}
      </div>
    </header>
  );
}

export default TopBar;
