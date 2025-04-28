"use client"

// Компонент відповідаючий за сітку навколо фігури при натисканні 

// Імпоотуємо залежності 

import { useSelectionBounds } from "@/hooks/use-selection-bounce"
import { LayerType, Side, XYWH } from "@/types/canvas"
import { useSelf, useStorage } from "@liveblocks/react"
import { memo } from "react"

// Типізуємо пропси 
interface SelectionBoxProps{
    onReziHandlePointerDown:(corner:Side, initialBounds:XYWH)=>void,
}

// Висота і ширина квадратиків 

const HANDLE_WIDTH = 8

const SelectionBox = memo(({onReziHandlePointerDown}:SelectionBoxProps) => {

    // Отримуємо ID одного шару, якщо в користувача виділено лише один шар

    const soleLayerId = useSelf((me)=>
        me.presence.selection.length === 1 ? me.presence.selection[0] : null
    )

    // Визначаємо, чи показувати "handles" (керуючі точки або маніпулятори)

    const isShowingHandles = useStorage((root)=>
    soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
    )

    // Отримуємо параметри прямокутника, що обгортає фігуру

    const bounds = useSelectionBounds();

    // Якщо параметрів немає, то повертаємо

    if(!bounds){
        return null
    }
  return (
    <>
    
        <rect 
            className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
            style={{transform:`translate(${bounds.x}px, ${bounds.y}px)`}}
            x={0}
            y={0}
            width={bounds.width}
            height={bounds.height} 
        />

{isShowingHandles&& (
            <>
                <rect className="fill-white stroke-1 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"nwse-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation()
                    onReziHandlePointerDown(Side.Top + Side.Left, bounds)
                }}
                />

<rect className="fill-white stroke-1 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"ns-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform: `translate(${bounds.x + bounds.width/2 - HANDLE_WIDTH/2}px, ${bounds.y - HANDLE_WIDTH/2}px)`,
            
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation()
                    onReziHandlePointerDown(Side.Top, bounds)
                }}
                />

<rect className="fill-white stroke-1 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"nesw-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform: `translate(${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, ${bounds.y - HANDLE_WIDTH / 2 }px)`,
            
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation()
                    onReziHandlePointerDown(Side.Top+Side.Right, bounds)
                }}
                />

<rect className="fill-white stroke-1 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"ew-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform: `translate(${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, ${bounds.y + bounds.height/2 - HANDLE_WIDTH / 2 }px)`,
            
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation()
                    onReziHandlePointerDown(Side.Right, bounds)
                }}
                />

<rect className="fill-white stroke-1 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"nwse-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform: `translate(${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2 }px)`,
            
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation()
                    onReziHandlePointerDown(Side.Bottom + Side.Right, bounds)
                }}
                />

<rect className="fill-white stroke-1 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"ns-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform: `translate(${bounds.x  + bounds.width/2 - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2  + bounds.height }px)`,
            
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation()
                    onReziHandlePointerDown(Side.Bottom, bounds)
                }}
                />

<rect className="fill-white stroke-1 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"nesw-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2  + bounds.height }px)`,
            
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation()
                    onReziHandlePointerDown(Side.Bottom +Side.Left, bounds)
                }}
                />

<rect className="fill-white stroke-1 stroke-blue-500"
                x={0}
                y={0}
                style={{
                    cursor:"ew-resize",
                    width:`${HANDLE_WIDTH}px`,
                    height:`${HANDLE_WIDTH}px`,
                    transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2  + bounds.height/2 }px)`,
            
                }}
                onPointerDown={(e)=>{
                    e.stopPropagation()
                    onReziHandlePointerDown(Side.Left, bounds)
                }}
                />
            </>
        )}
    </>
  )
})

export default SelectionBox