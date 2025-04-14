import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {camera, Color, Point, Side, XYWH} from "@/types/canvas"
import { Match } from "date-fns"
import { match } from "assert"
import { headers } from "next/headers"

// набір кольорів

const COLORS = [
  "#DC2626",
  "#D97706",
  "#059669",
  "#7C3AED",
  "DB27777"
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// функція яка ибирає випадковий колір для користувача 

export function connectionIdToColor(connectionId:number):string{
  return COLORS[connectionId % COLORS.length]
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: camera
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}


// перетворення rgb об'єкта в hex
export function colorToCss(color:Color) {
  
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2,"0")}${color.b.toString(16).padStart(2,"0")}`
}

// логіка зміни розміру об'єктів

export function resizeBounds(
  bounds:XYWH,
  corner:Side,
  point:Point
):XYWH{
  const result = {
    x:bounds.x,
    y:bounds.y,
    width:bounds.width,
    height:bounds.height
  }

  if((corner & Side.Left) === Side.Left){
    result.x = Math.min(point.x, bounds.x + bounds.width)
    result.width = Math.abs(bounds.x+ bounds.width - point.x)
  }

  if((corner & Side.Right)==Side.Right){
    result.x = Math.min(point.x, bounds.x)
    result.width = Math.abs(point.x - bounds.x)
  }

  if((corner & Side.Top)=== Side.Top){
    result.y = Math.min(point.y, bounds.y + bounds.height)
    result.height = Math.abs(bounds.y + bounds.height - point.y)
  }

  if((corner & Side.Bottom) === Side.Bottom){
    result.y = Math.min(point.y, bounds.y)
    result.height = Math.abs(point.y - bounds.y)
  }

  return result
}