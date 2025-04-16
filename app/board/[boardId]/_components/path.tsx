import getStroke from "perfect-freehand";

interface PathProps {
    x:number,
    y: number,
    points: number[][],
    fill: string,
    onPointerDown: (e: React.PointerEvent) => void;
    stroke?:string,
}

const Path = ({x,y,points,fill,onPointerDown,stroke}:PathProps) =>{
 return(
    <path 
    
    />
 )
}

export default Path