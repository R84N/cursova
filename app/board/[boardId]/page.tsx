"use server"

import React from "react";
import Canvas from "./_components/canvas";
import Room from "@/components/room";

const BoardIdPage = async ({ params }: { params: { boardId: string } }) => {
  return (
    <Room roomId={params.boardId}>
      <Canvas boardId={params.boardId} />
    </Room>
  );
};

export default BoardIdPage;
