"use client";

// Компонент навігаційного меню

// Імпортуємо всі необхідні залежності

import { UserButton } from "@clerk/nextjs";
import SearcInput from "./search-input";

const Navbar = () => {
  return (
    <div className="flex items-center gap-x-4 p-5 ">
      <div className="hidden lg:flex  w-full">
        <SearcInput />
      </div>
      <UserButton />
    </div>
  );
};

export default Navbar;
