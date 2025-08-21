"use client";

import { TaskParam } from "@/types/appNode";

export default function BrowserInstanceParam({ param }: ParamProps) {
  return <div className="text-xs">{param.name}</div>;
}
