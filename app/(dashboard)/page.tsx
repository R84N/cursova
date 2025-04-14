"use client"

import React from "react";
import EmptyOrg from "./_components/EmptyOrg";
import { useOrganization } from "@clerk/nextjs";
import BoardList from "./_components/BoardList";



const DashboardPage = () => {

  const {organization} = useOrganization();

  return (
  <div className="flex-1 h-[calc(100%-76px)]">
  
   
  </div>
);
};

export default DashboardPage;
