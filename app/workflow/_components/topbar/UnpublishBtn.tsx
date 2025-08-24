"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import { UnpublishWorkflow } from "@/actions/workflows/unpublishWorkflow";

export default function UnpublishBtn({ workflowId }: { workflowId: string }) {


  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow unpublished successfully", { id: workflowId });
    },
    onError: () => {
      toast.error("Failed to unpublish workflow", { id: workflowId });
    },
  });

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Unpublishing workflow...", { id: workflowId });
        mutation.mutate(workflowId);
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-500" />
      Unpublish
    </Button>
  );
}
