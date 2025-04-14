"use client"
import { use } from "react"
import EmptyOrg from "./_components/EmptyOrg"
import { useOrganization } from "@clerk/nextjs"
import BoardList from "./_components/BoardList"

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const DashboardPage = ({ searchParams }: DashboardPageProps) => {
  // In client components, we use React's 'use' function to read the promise
  const resolvedSearchParams = use(searchParams)
  const { organization } = useOrganization()

  return (
    <div className="flex-1 h-[calc(100%-76px)]">
      {!organization ? <EmptyOrg /> : <BoardList orgId={organization.id} query={resolvedSearchParams} />}
    </div>
  )
}

export default DashboardPage
