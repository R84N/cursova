"use client"

// Сторінка дошок

// Імпорт необхідних компонентів/функцій

import { use } from "react"
import EmptyOrg from "./_components/EmptyOrg"
import { useOrganization } from "@clerk/nextjs"
import BoardList from "./_components/BoardList"


// Типізація для пропсів
interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const DashboardPage = ({ searchParams }: DashboardPageProps) => {
  // Отримуємо парамети пошуку та організації
  const resolvedSearchParams = use(searchParams)
  const { organization } = useOrganization()

  return (
    <div className="flex-1 h-[calc(100%-76px)]">
      {/* Якщо нема організацій виводимо відповідний компонент, якщо є виводимо організації */}
      {!organization ? <EmptyOrg /> : <BoardList orgId={organization.id} query={resolvedSearchParams} />}
    </div>
  )
}

export default DashboardPage
