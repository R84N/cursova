// Компонент відповідає за олівець

// Імпортуємо всі залежності 


import { getSvgPathFromStroke } from "@/lib/utils";
import getStroke from "perfect-freehand";

// Типізуємо пропси
interface PathProps {
    x:number,
    y: number,
    points: number[][],
    fill: string,
    onPointerDown?: (e: React.PointerEvent) => void;
    stroke?:string,
}

const Path = ({x,y,points,fill,onPointerDown,stroke}:PathProps) =>{
 return(
    <path 
    className="drop-shadow-md"
    onPointerDown={onPointerDown}
    d={getSvgPathFromStroke(
        getStroke(points,{
            size:16,
            thinning:0.5,
            smoothing:0.5,
            streamline:0.5
        })
    )}
    style={{
        transform:`translate(${x}px, ${y}px)`
    }}

    x={0}
    y={0}
    fill={fill}
    stroke={stroke}
    strokeWidth={1}
    />
 )
}

export default Path