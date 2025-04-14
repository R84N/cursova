"use client";

import Image from "next/image";
import Link from "next/link";
import Overlay from "./overlay";
import {formatDistanceToNow} from "date-fns"
import { useAuth } from "@clerk/nextjs";
import Footer from "./footer";
import Actions from "@/components/actions";
import { MoreVertical } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface BoardCardProps {
    id:string,
    title:string,
    authorName:string,
    authorId:string,
    createdAt:number,
    imageUrl:string,
    orgId:string,
    isFavorite:boolean,
}

const BoardCard = ({id,title,authorName,authorId,createdAt,imageUrl,orgId,isFavorite}:BoardCardProps) => {

  const favorite = useMutation(api.board.favorite);
  const unfavorite = useMutation(api.board.unfavorite);

  const {userId} = useAuth();

  const authorLabel = userId === authorId?"You":authorName;
  const createdAtLabel = formatDistanceToNow(createdAt,{
    addSuffix:true,
  });

  const toggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (isFavorite) {
      unfavorite({ id: id as Id<"boards"> });
    } else {
      favorite({ id: id as Id<"boards">, orgId });
    }
  };
  


    return (
    <Link href={`/board/${id}`}>
        <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
            <div className="relative flex-1 bg-amber-50">
                <Image src={imageUrl}
                alt={title}
                fill
                className="object-fit" />
                <Overlay />
                <Actions
                id={id}
                title={title}
                side="right">
                    <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none cursor-pointer" >
                        <MoreVertical className="text-white opacity-75 hover:opacity-100 transition-opacity" />
                    </button>
                </Actions>
            </div>
            <Footer 
            isFavorite={isFavorite}
            title={title}
            authorLabel={authorLabel}
            createdAtlbel={createdAtLabel}
            onClick={toggleFavorite}
            disabled={false}
            />
        </div>
    </Link>
  )
}

export default BoardCard