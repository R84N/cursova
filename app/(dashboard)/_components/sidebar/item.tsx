"use client";

// Компонент іконки організації

// Імпортуємо всі необхідні залежності 

import Image from "next/image";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Hint from "@/components/hint";

// Типізуємо пропси
interface ItemProps {
  id: string;
  name: string;
  imageUrl: string;
}



const Item = ({ id, name, imageUrl }: ItemProps) => {

  // Отримуємо організацію, функцію для того, щоб зробити її активною

  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  // Булева змінна, яка містить інформацію про активність дошки

  const isActive = organization?.id === id;

  // Функція для активації організації

  const onClick = () => {

    // Якщо функції нема, повертаємо 

    if (!setActive) return;

    setActive({ organization: id });
  };
  return (
    <div className="aspect-square relative">
      <Hint label={name} side="right" align="start" sideOffset={18}>
        <Image
          alt={name}
          src={imageUrl}
          onClick={onClick}
          className={cn(
            "rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",
            isActive && "opacity-100"
          )}
          width={50}
          height={50}
        />
      </Hint>
    </div>
  );
};

export default Item;
