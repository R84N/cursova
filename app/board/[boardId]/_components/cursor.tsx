"use client"

// Компонент курсора інших користувачів

// Імпортуємо залежності

import { MousePointer2 } from "lucide-react"
import { connectionIdToColor } from "@/lib/utils"
import { useOther } from "@liveblocks/react"

// Типізуємо пропси
interface CursorProps {
    connectionId:number,
}

const Cursor = ({connectionId}:CursorProps) => {

    // Отримуємо інформацію про користувача

    const info = useOther(connectionId, (user)=>user?.info);

    // Отримуємо курсор іншого користувача

    const cursor = useOther(connectionId, (user)=>user.presence.cursor);

    // Отримуємо ім'я, якщо його немає, то виводимо ім'я Teammate

    const name = info?.name || "Teammate";

    // Якщо курсора немає повертаємо null

    if(!cursor){
        return null;
    }

    // Отримуємо кординати курсора 

    const {x,y} =cursor

  return (
    <foreignObject style={{transform:`translateX(${x}px) translateY(${y}px)`}} height={50} width={name.length * 10 + 24}  className="relative drop-shadow-md">
        <MousePointer2 className="h-5 w-5" style={{fill:connectionIdToColor(connectionId), color:connectionIdToColor(connectionId)}}/>
        <div className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold" style={{backgroundColor:connectionIdToColor(connectionId)}}>
            {name}
        </div>
    </foreignObject>
  )
}

export default Cursor