import Canvas from "./_components/canvas"
import Room from "@/components/room"

interface BoardIdPageProps {
  params: Promise<{
    boardId: string
  }>
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { boardId } = await params

  return (
    <Room roomId={boardId}>
      <Canvas boardId={boardId} />
    </Room>
  )
}

export default BoardIdPage
