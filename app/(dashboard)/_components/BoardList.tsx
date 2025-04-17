"use client"

// Компонент дошки 

// Імпортуємо залежності

import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useOrganization } from "@clerk/nextjs"
import { toast } from "sonner"
import { useQuery } from "convex/react"
import BoardCard from "./board-card"
import NewBoardButton from "./NewBoardButton"

// Типізуємо пропси
interface BoardListProps{
    orgId:string,
    query:{
        search?:string,
        favorites?:string,
    }
}

const BoardList = ({orgId, query}:BoardListProps) => {

    // Отримуємо організацію, отримуємо функцію для створення дошки

    const { organization } = useOrganization();
    const create = useMutation(api.board.create);

    // Функція для створення дошки

    const onClick = () => {

        // Перевіряємо, чи є організація

        if (!organization) return;

        // Створюємо організацію, і виводимо відповідне повідомлення

        create({
            orgId: organization.id,
            title: "Untitled"
        })
        .then(()=>{
            toast.success("Board created")
        })

        .catch(()=>{
            toast.error("Fail to create a board")
        })
    };

    // Отримуємо дошки 

    const data = useQuery(api.boards.get,{orgId, search: query.search})

    // За допомогою фільтра отримуємо лиже улюблені дошки 

    const favoriteData = data?.filter((element)=>element.isFavorite)

    // Якщо дошок нема, відображаємо завантаження

    if(data === undefined){
        return(
            <div>
                Loading...
            </div>
        )
    }

    // Якщо є данні пошуку(в інпуті щось введено) виводимо, що дошок нема

    if(!data?.length && query.search){
        return(
            <div>
                Не знайдено дошок 
            </div>
        )
    }

    // Якщо вибрано режим улюблених дошок, але їх нема, відображаємо що немає улюблених

    if(!data?.length && query.favorites){
        return(
            <div>
                Немає улюблених дошок
            </div>
        )
    }

    // Відображаємо, якщо немає створених дошок

    if(!data?.length ){
        return(
            <div className='h-full flex flex-col justify-center items-center'>
                <h2 className='text-4xl font-medium'>Немає створених дошок</h2>
                <p className='text-gray-500 mt-2'>Створи свою першу дошку, щоб розпочати !</p>
                <Button onClick={onClick} size='lg' className='cursor-pointer mt-4'>Створити</Button>

            </div>
        )
    }

    // Відображаємо дошки

  return (
    <div>
        <h2 className="text-3xl">
            {/* В залежності від вибору відображаємо улюблені/всі дошки */}
            {query?.favorites?"Улюблені":"Всі дошки"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10"> 
            <NewBoardButton orgId={orgId} />
            {/* В залежності від вибору відображаємо улюблені/всі дошки */}
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