"use client"

import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useOrganization } from "@clerk/nextjs"
import { toast } from "sonner"
import { useQuery } from "convex/react"
import BoardCard from "./board-card"
import NewBoardButton from "./NewBoardButton"


interface BoardListProps{
    orgId:string,
    query:{
        search?:string,
        favorites?:string,
    }
}

const BoardList = ({orgId, query}:BoardListProps) => {
    const { organization } = useOrganization();
    const create = useMutation(api.board.create);

    const onClick = () => {
        if (!organization) return;

        create({
            orgId: organization.id,
            title: "Untitled"
        })
        .then((id)=>{
            toast.success("Board created")
        })

        .catch((error)=>{
            toast.error("Fail to create a board")
        })
    };

    const data = useQuery(api.boards.get,{orgId, search: query.search})

    const favoriteData = data?.filter((element)=>element.isFavorite)

    if(data === undefined){
        return(
            <div>
                Loading...
            </div>
        )
    }

    if(!data?.length && query.search){
        return(
            <div>
                Try searching for something else
            </div>
        )
    }

    if(!data?.length && query.favorites){
        return(
            <div>
                No favorites 
            </div>
        )
    }

    if(!data?.length ){
        return(
            <div className='h-full flex flex-col justify-center items-center'>
                <h2 className='text-4xl font-medium'>Немає створених дошок</h2>
                <p className='text-gray-500 mt-2'>Створи свою першу дошку, щоб розпочати !</p>
                <Button onClick={onClick} size='lg' className='cursor-pointer mt-4'>Створити</Button>

            </div>
        )
    }

  return (
    <div>
        <h2 className="text-3xl">
            {query?.favorites?"Favorite boards":"Team boards"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10"> 
            <NewBoardButton orgId={orgId} />
            {query?.favorites?
            favoriteData?.map((board) =>(
                <BoardCard 
                key={board._id}
                id={board._id}
                title={board.title}
                imageUrl={board.imageUrl}
                authorId={board.authorId}
                authorName={board.authorName}
                createdAt={board._creationTime}
                orgId={board.orgId}
                isFavorite={board.isFavorite}
                
                
                />
            ))
            :
            data?.map((board) =>(
                <BoardCard 
                key={board._id}
                id={board._id}
                title={board.title}
                imageUrl={board.imageUrl}
                authorId={board.authorId}
                authorName={board.authorName}
                createdAt={board._creationTime}
                orgId={board.orgId}
                isFavorite={board.isFavorite}
                
                
                />
            ))
        }
            
        </div>
    </div>
  )
}

export default BoardList