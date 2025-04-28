"use client"

// Компонент для відображення користувачів, які зараз знаходяться на дошці 

// Імпортуємо залежності

import UserAvatar from "./user-avatar"
import { useOthers, useSelf } from "@liveblocks/react"

// Число яке відповідає за те, скільки користувачів відображено на дошці

const MAX_SHOWN_USERS = 2

const Participance = () => {

  // Отримуємо користувачів на дошці

  const users = useOthers();

  // Отримуємо себе

  const currentUser = useSelf();

  // Булева змінна яка вказує чим кількість користувачів на дошці більша за MAX_SHOWN_USERS

  const hasMoreUsers = users.length > MAX_SHOWN_USERS

  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
        <div className="flex gap-x-2">
          {users.slice(0,MAX_SHOWN_USERS).map(({connectionId, info})=>{
            return(
              <UserAvatar
                key={connectionId}
                src={info?.picture}
                name={info?.name}
                fallback={info?.name?.[0] || "T"}
              />
            )
          })}
          {currentUser &&(
            <UserAvatar 
                src={currentUser.info?.picture}
                name={`${currentUser.info?.name} (YOU)`}
                fallback={currentUser.info?.name?.[0] || "T"}
            />
          )}

          {hasMoreUsers && (
            <UserAvatar
              name={`${users.length - MAX_SHOWN_USERS} more`}
              fallback={`+${users.length - MAX_SHOWN_USERS}`} 
            />
          )}
        </div>
    </div>
  )
}

export default Participance