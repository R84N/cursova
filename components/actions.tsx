"use client"

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import {
DropdownMenu, 
DropdownMenuTrigger, 
DropdownMenuContent, 
DropdownMenuItem, 
}
from "@/components/ui/dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useRenameModal } from "@/store/use-rename-modal";
import { Id } from "@/convex/_generated/dataModel";


interface ActionsProps { 
    children: React. ReactNode; 
    side?: DropdownMenuContentProps ["side"]; 
    sideOffset?: DropdownMenuContentProps ["sideOffset"]; 
    id: string; 
    title:string,
};

const Actions = ({children,side,sideOffset,id,title}:DropdownMenuContentProps) => {
    
    const {onOpen} = useRenameModal();

    
    
    
    const onCopyLink = () => { 
        navigator.clipboard.writeText( 
        `${window.location. origin}/board/${id}`, 
        ) 
        .then(() => toast.success("Link copied")) 
        .catch(() => toast.error("Failed to copy link")) 
        }

        const remove = useMutation(api.board.remove);
    
        const onDelete = ()=>{
            remove({id:id as Id<"boards">})
            .then(()=>toast.success("Boared deleted"))
            .catch(()=>toast.error("Failed to delete board"))
        }
  return (
    <DropdownMenu> 
        <DropdownMenuTrigger asChild> 
            {children} 
        </DropdownMenuTrigger>
        <DropdownMenuContent 
        onClick={(e) => e.stopPropagation()} 
        side={side} 
        sideOffset={sideOffset} 
        className="w-60"> 
        <DropdownMenuItem 
        onClick={onCopyLink}
        className="p-3 cursor-pointer" 
        > 
        <Link2 className="h-4 w-4 mr-2" /> 
        Скопіювати посилання
        </DropdownMenuItem> 
        <DropdownMenuItem 
        onClick={onDelete}
        className="p-3 cursor-pointer" 
        > 
        <Trash2 className="h-4 w-4 mr-2" /> 
            Видалити
        </DropdownMenuItem> 
        <DropdownMenuItem 

        onClick={()=>onOpen(id!,title!)}
        className="p-3 cursor-pointer" 
        > 
        <Pencil className="h-4 w-4 mr-2" /> 
        Перейменувати 
        </DropdownMenuItem> 
    </DropdownMenuContent> 
    </DropdownMenu>
    
  )
}

export default Actions

