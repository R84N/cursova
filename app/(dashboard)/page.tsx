"use client"

import React from "react";
import EmptyOrg from "./_components/EmptyOrg";
import { useOrganization } from "@clerk/nextjs";
import BoardList from "./_components/BoardList";


interface DashboardPageProps  {
  searchParams:{
    search?:string,
    favorites?:string
  }
}

const DashboardPage = ({searchParams}:DashboardPageProps) => {

  const {organization} = useOrganization();

  return (
  <div className="flex-1 h-[calc(100%-76px)]">
    {!organization?(
      <EmptyOrg />
    ):(
      <BoardList orgId={organization.id} query={searchParams} />
    )}
   
  </div>
);
};

export default DashboardPage;
