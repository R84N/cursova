"use client";

import React from "react";
import Info from "./info";
import Participance from "./participance";
import Toolbar from "./toolbar";

import { useSelf } from "@liveblocks/react";
import { useState } from "react";
import { CanvasMode, CanvasState } from "@/types/canvas";
import { useHistory, useCanUndo, useCanRedo } from "@liveblocks/react";
interface CanvasProps {
  boardId: string;
}

const Canvas = ({ boardId }: CanvasProps) => {

  const [CanvasState, setCanvasState] = useState<CanvasState>({
    mode:CanvasMode.None,
  });

  const history = useHistory();
  const canUndo = useCanRedo();
  const canRedo = useCanRedo();

  return (
    <main className="h-full w-full relative bg-neutral-100 toch-none">
      <Info boardId={boardId} />
      <Participance />
      <Toolbar
        canvasState={CanvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
    </main>
  );
};

export default Canvas;
