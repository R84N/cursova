// Компонент квадрата/прямокутника

// Імпортуємо залежності 

import { RectangleLayer } from "@/types/canvas"
import { colorToCss } from "@/lib/utils";

// Типізуємо пропси
interface RectangleProps { 
    id: string; 
    layer: RectangleLayer; 
    onPointerDown: (e: React. PointerEvent, id: string) => void; 
    selectionColor?: string; 
    };

const Rectangle = ({id,layer,onPointerDown,selectionColor}:RectangleProps) => {

    // Отримуємо інформацію про фігуру

    const {x,y, width,height,fill} = layer


  return (
    <rect 
    className="drop-shadow-md" 
    onPointerDown={(e) => onPointerDown(e, id)} 
    style={{ 
    transform: `translate(${x}px, ${y}px)`, 
    }} 
    x={0} 
    y={0} 
    width={width} 
    height={height} 
    strokeWidth={1} 
    fill={fill ? colorToCss(fill): "#000"} 
    stroke={selectionColor || "transparent"}
    />    
  )
}

export default Rectangle