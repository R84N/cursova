"use client";

import React from "react";
import Info from "./info";
import Participance from "./participance";
import Toolbar from "./toolbar";

import { useSelf } from "@liveblocks/react";

interface CanvasProps {
  boardId: string;
}

const Canvas = ({ boardId }: CanvasProps) => {
  const info = useSelf();

  return (
    <main className="h-full w-full relative bg-neutral-100 toch-none">
      <Info />
      <Participance />
      <Toolbar />
    </main>
  );
};

export default Canvas;
