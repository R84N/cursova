"use client";

// Компонент списку організацій

import { useOrganizationList } from "@clerk/nextjs";

import React from "react";
import Item from "./item";

const List = () => {

  // Отримуємо організації, в яких ми знаходимся

  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  // Якщо нема організацій, повертаємо

  if (!userMemberships.data?.length) return null;

  return (
    <ul className="space-y-4">
      {userMemberships.data?.map((mem) => (
        <Item
          key={mem.organization.id}
          id={mem.organization.id}
          name={mem.organization.name}
          imageUrl={mem.organization.imageUrl}
        />
      ))}
    </ul>
  );
};

export default List;
