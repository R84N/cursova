// Перше бічне меню на сторінці з дошками

// Імпортуємо всі необхідні залежності 

import React from "react";
import NewButton from "./new-button";
import List from "./list";

const Sidebar = () => {
  return (
    <aside className=" left-0 bg-blue-950 h-full w-[60px] flex p-3 flex-col gap-y-4 text-white">
      <List />
      <NewButton />
      
    </aside>
  );
};

export default Sidebar;
