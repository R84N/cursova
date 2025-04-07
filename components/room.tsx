"use client"

import { ReactNode } from "react"
import { ClientSideSuspense } from "@liveblocks/react"
import { RoomProvider } from "@liveblocks/react"
import { LiveblocksProvider } from "@liveblocks/react"



const Room = ({children, roomId}:{children:ReactNode, roomId:string}) => {
  return (
    <LiveblocksProvider publicApiKey="pk_dev_9N9WyWUiSJea2nPKfCUFaYpKvTLyL7OAD8EXWbnAxk8Ca09wgng2Aacv7WFDe1Hk">
        <RoomProvider id={roomId} initialPresence={{}}>
            <ClientSideSuspense fallback={<div>Loading...</div>}>
                {()=>children}
            </ClientSideSuspense>
        </RoomProvider>
    </LiveblocksProvider>
    
  )
}

export default Room