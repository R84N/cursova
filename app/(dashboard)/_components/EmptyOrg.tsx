// Компонент для відображення, коли немоє організацій

// Імпортуємо залежності

import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { CreateOrganization } from '@clerk/nextjs'


const EmptyOrg = () => {
  return (
    <div className='h-full flex flex-col justify-center items-center'>
        <h2 className='text-4xl font-medium'>Вітаємо в DrawBoard</h2>
        <p className='text-gray-500 mt-2'>Створіть організацію, щоб продовжити</p>
        <div className='mt-6'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size='lg' className='cursor-pointer'>Створити організацію</Button>
                </DialogTrigger>
                <DialogContent className='bg-transparent border-0 w-[4s0px] p-0'>
                    <CreateOrganization />
                </DialogContent>
            </Dialog>

        </div>
    </div>
  )
}

export default EmptyOrg