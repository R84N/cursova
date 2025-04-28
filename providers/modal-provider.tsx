"use client"

// Провайдер для перейменування дошки

// Імпортуємо залежності 

import RenameModal from "@/components/modals/rename-modal"
import { useEffect, useState } from "react"

const ModalProvider = () => {

  // Реактивна змінна яка спочатку дорівнює false, а потім, коли компонент загружається стає true

const [isMounted, setIsMounted] = useState(false);

useEffect(()=>{
    setIsMounted(true);
},[])

// Якщо не загружено повертаємо

if(!isMounted){
    return null
}

  return (
   <>
    <RenameModal />
   </>
  )
}

export default ModalProvider