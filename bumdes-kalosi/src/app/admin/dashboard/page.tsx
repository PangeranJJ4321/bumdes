"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { trpc as api } from "@/lib/trpc/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardReports } from "@/components/dashboard-reports"

import { useSearchParams } from "next/navigation"

import { useState, useEffect } from "react"

import { Suspense } from "react"

function DashboardContent() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "overview"
  const tabParam = searchParams.get("tab")
  const initialTab = defaultTab

  const [tab, setTab] = useState(initialTab)
  const [activityUnit, setActivityUnit] = useState<string | undefined>(undefined)

  const { data: stats } = api.dashboard.getStats.useQuery()
  const { data: activity } = api.dashboard.getRecentActivity.useQuery({
    unit: activityUnit as any
  })
  const { data: chartData } = api.dashboard.getChartData.useQuery()

  // Set default tab if provided in URL (only on mount)
  useEffect(() => {
    if (tabParam) {
      setTab(tabParam)
    }
  }, [tabParam])

  return (
    <div className="flex flex-1 flex-col p-4 pt-0">
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <div className="flex items-center justify-between px-4 lg:px-6 mt-4">
          <TabsList>
            <TabsTrigger value="overview" className="text-base px-4 py-2">Overview</TabsTrigger>
            <TabsTrigger value="reports" className="text-base px-4 py-2">Rekap & Laporan</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards stats={stats} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={chartData || []} />
              </div>
              <DataTable
                data={activity?.recentOrders || []}
                reviews={activity?.recentReviews || []}
                onUnitChange={setActivityUnit}
                selectedUnit={activityUnit}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <DashboardReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>}>
          <DashboardContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
