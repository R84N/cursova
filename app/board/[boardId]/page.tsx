// Сторінка дошки 

// Імпортуємо залежності 

import Canvas from "./_components/canvas"
import Room from "@/components/room"

// Типізуємо пропси 
interface BoardIdPageProps {
  params: Promise<{
    boardId: string
  }>
}



const BoardIdPage = async ({ params }: BoardIdPageProps) => {

  // отримуємо id дошки

  const { boardId } = await params

  return (
    <Room roomId={boardId}>
      <Canvas boardId={boardId} />
    </Room>
  )
}

export default BoardIdPage
