"use client"

// Компонент для створення нової дошки 

// Імпортуємо залежності

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";


// Типізуємо пропси
interface NewBoardButtonProps{
    orgId:string,
    disabled?:boolean,

}



const NewBoardButton = ({orgId,disabled}:NewBoardButtonProps) => {

    // Отримуємо функцію для створення дошки

    const create = useMutation(api.board.create); 

    // При натиску на компонент створюємо нову дошку в організації

    const onClick = () => { 
        create({ 
        orgId, 
        title: "Untitled" 
        }) 
        .then(()=>{
            toast.success("Board created")
        })
        .catch(()=>toast.error("Failed to create board"));
    }
  return (
    <button 
        disabled={disabled} 
        onClick={onClick} 
        className={cn( "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg cursor-pointer  hover:bg-blue-800  flex flex-col items-center justify-center py-6", disabled && "opacity-75" )} >
        <div /> 
        <Plus className="h-12 w-12 text-white stroke-1"/>
        <p className="text-sm text-white font-light">
            Створити дошку
        </p> 
    </button>
  )
}

export default NewBoardButton