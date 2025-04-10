import Hint from "@/components/hint";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

interface UserAvatarProps{
    src?:string,
    name?:string,
    fallback?:string,
}   

const UserAvatar = ({src,name,fallback}:UserAvatarProps) => {
  return (
    <Hint label={name || "Temmate"} side="bottom" sideOffset={18}>
        <Avatar 
        className="h-8 w-8 border"
        >
            <AvatarImage src={src} />
            <AvatarFallback className="text-xs font-semibold">
                {fallback}
            </AvatarFallback>
        </Avatar>
    </Hint>
  )
}

export default UserAvatar