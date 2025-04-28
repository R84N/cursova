"use client"

// Компонент перейменування дошки

// Імпортуємо залежності 

import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogClose, 
    DialogFooter, 
    DialogTitle, 
    } from "@/components/ui/dialog";

import { useRenameModal } from "@/store/use-rename-modal";
import { FormEventHandler, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";


const RenameModal = () => {

    // Отримаємо функцію для оновлення

    const update = useMutation(api.board.update);

    // Отримуємо данні з сховища для попапа     

    const {isOpen, onClose, initialValues} = useRenameModal();

    // Створюємо реактивну змінну для імені дошки

    const [title, setTitle] = useState(initialValues.title)

// Коли оновлюється початкове значення імені дошки, оновлюємо нашу змінну

useEffect(()=>{
    setTitle(initialValues.title);
},[initialValues.title]);

// Функція відправки запиту на перейменування дошки

const Submit:FormEventHandler<HTMLFormElement> = (e)=> {
    e.preventDefault();
    update({id:initialValues.id as Id<"boards">,title})
    .then(()=>{
        toast.success("Renamed")
        onClose();
    })
    .catch(()=>{
        toast.error("Error renaming board")
    })
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent> 
            <DialogHeader> 
                <DialogTitle> 
                    Edit board title 
                </DialogTitle> 
            </DialogHeader> 
            <DialogDescription> 
                Enter a new title for this board 
            </DialogDescription>
            <form onSubmit={Submit} className="space-y-4">
                <Input
                disabled={false}
                required
                maxLength={60} 
                value={title}
                onChange={(e)=> setTitle(e.target.value)}
                placeholder="Board title"
                />
                <DialogFooter> 
            <DialogClose asChild> 
            <Button type="button" variant="outline" className="cursor-pointer"> 
            Cancel 
            </Button> 
            </DialogClose> 
            <Button disabled={false} type="submit" className="cursor-pointer"> 
            Save 
            </Button> 
            </DialogFooter> 
            </form>
        </DialogContent> 
    </Dialog>
  )
}

export default RenameModal