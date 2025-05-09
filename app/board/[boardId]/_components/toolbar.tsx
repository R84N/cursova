// Компонент меню за кнопками вибору фігури на дошці

// Імпортуємо залежності 

import React from 'react'
import ToolButton from './tool-button'
import { Circle, MousePointer2, Pen, Redo2, Square, StickyNote, Type, Undo2 } from 'lucide-react'
import { CanvasMode, CanvasState, LayerType } from '@/types/canvas'

// Типізуємо пропси
interface ToolbarProps {
    canvasState: CanvasState,
    setCanvasState: (newState:CanvasState)=>void,
    undo: () => void,
    redo: () => void,
    canUndo: boolean,
    canRedo: boolean,
}

const Toolbar = ({canvasState,setCanvasState,undo,redo,canUndo,canRedo}:ToolbarProps) => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4"> 
        <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md"> 
           <ToolButton 
            label="Обрати"
            icon={MousePointer2}
            onClick={()=>setCanvasState({mode:CanvasMode.None,})}
            isActive={
              canvasState.mode === CanvasMode.None ||
              canvasState.mode === CanvasMode.Translating ||
              canvasState.mode === CanvasMode.SelectionNet ||
              canvasState.mode === CanvasMode.Pressing ||
              canvasState.mode === CanvasMode.Resizing
            }
           />

            <ToolButton 
            label="Текст"
            icon={Type}
            onClick={()=>setCanvasState({
              mode:CanvasMode.Inserting,
              layerType:LayerType.Text
            })}
            isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text}
           />

            <ToolButton 
            label="Замітка"
            icon={StickyNote}
            onClick={()=>setCanvasState({
              mode:CanvasMode.Inserting,
              layerType:LayerType.Note
            })}
            isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Note}
           />

            <ToolButton 
            label="Прямокутник"
            icon={Square}
            onClick={()=>setCanvasState({
              mode:CanvasMode.Inserting,
              layerType:LayerType.Rectangle
            })}
            isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle}
           />

            <ToolButton 
            label="Коло"
            icon={Circle}
            onClick={()=>setCanvasState({
              mode:CanvasMode.Inserting,
              layerType:LayerType.Ellipse
            })}
            isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse}
           />

            <ToolButton 
            label="Олівець"
            icon={Pen}
            onClick={()=>setCanvasState({
              mode:CanvasMode.Pencil,
            })}
            isActive={canvasState.mode === CanvasMode.Pencil}
           />
        </div> 
        <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md"> 
            <ToolButton 
            label="Назад"
            icon={Undo2}
            onClick={undo}
            isDisabled={!canUndo}
           />
            <ToolButton 
            label="Вперед"
            icon={Redo2}
            onClick={redo}
            isDisabled={!canRedo}
           />
        </div>
    </div>
  )
}

export default Toolbar