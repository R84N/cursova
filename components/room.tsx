"use client";

// Компонент який потрібен для того, щоб створити "кімнату дошки"

// Імпортуємо залежності  

import { ReactNode } from "react";
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "@liveblocks/react";
import { LiveblocksProvider } from "@liveblocks/react";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { Layer } from "@/types/canvas";

const Room = ({ children, roomId }: { children: ReactNode; roomId: string }) => {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={16}>
      <RoomProvider id={roomId} 
      initialPresence={{
        cursor:null,
        selection:[],
        pencilDraft:null,
        penColor: null
        }}

      initialStorage={{
        layers:new LiveMap<string, LiveObject<Layer>>(),
        layerIds:new LiveList([]),
      }}
      >
        <ClientSideSuspense fallback={<div>Loading...</div>}>{() => children}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export default Room;
