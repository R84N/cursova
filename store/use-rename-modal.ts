// Глобальне сховище для попапа дошки

// Імпортуємо залежності 

import {create} from "zustand";

// Записуємо значення за замовчуванням

const defaultValues = {id:'', title:''}

// Типізаія пропсів 
interface IRenameModal {
    isOpen:boolean,
    initialValues: typeof defaultValues,
    onOpen: (id:string, title:string) => void,
    onClose: () => void,     
}

// Знавчення які будуть отримуватись в компонентах

export const useRenameModal = create<IRenameModal>((set) =>({
    isOpen:false,
    onOpen:(id,title) => set({
        isOpen: true,
        initialValues:{id,title},
    }),
    onClose: () => set({
        isOpen: false,
        initialValues: defaultValues,
    }),
    initialValues: defaultValues
}))