"use client";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import Hint from "@/components/hint";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const Info = ({ boardId }: InfoProps) => {
  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  return (
    <div className="absolute top-2 left-2 Ibg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
    <Hint label="Повернутись до дошок" side="bottom" sideOffset={10}>
      <Button asChild className="px-2" variant="board">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" height={30} width={30} />
          <span className={cn("font-semibold text-xl ml-2 text-black", font.className)}>Board</span>
        </Link>
      </Button>
    </Hint>
    <div className="text-neutral-300 px-1.5">
        |
    </div>
    <Button variant='board' className="text-base font-normal px-2">
      {data?.title}
    </Button>

    </div>
  );
};

export default Info;
