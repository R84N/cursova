"use client"

// Компонент відображення присутності курсорів інших користувачів

// Імпортуємо залежності
import { memo } from "react"
import { shallow, useOthersConnectionIds, useOthersMapped } from "@liveblocks/react"
import Cursor from "./cursor";
import Path from "./path";
import { colorToCss } from "@/lib/utils";

// Компонент, що рендерить курсори інших користувачів
const Cursors = () => {
    // Отримуємо ID з'єднань інших користувачів
    const ids = useOthersConnectionIds();

    return (
        <>
            {ids.map((connectionId) => (
                <Cursor 
                    key={connectionId}
                    connectionId={connectionId}
                />
            ))}
        </>
    )
}

// Компонент, що рендерить чернетки малюнків інших користувачів
const Drafts = () => {
  // Отримуємо дані про чернетку та обраний колір пера для кожного користувача
  const others = useOthersMapped((other) => ({
    pencilDraft: other.presence.pencilDraft,
    penColor: other.presence.penColor,
  }), shallow)

  return (
    <>
      {others.map(([key, other]) => {
        // Якщо є чернетка — рендеримо шлях (Path)
        if (other.pencilDraft) {
          return (
            <Path 
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss(other.penColor) : "#000"}
            />
          )
        }

        return null
      })}
    </>
  )
}

// Головний компонент присутності курсорів та чернеток малюнків
export const CursorPresence = memo(() => {  
  return (
    <>
      <Drafts />
      <Cursors />
    </>
  )
})

export default CursorPresence
