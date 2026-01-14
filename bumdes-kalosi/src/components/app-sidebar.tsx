"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconNews,
  IconBox,
  IconReceipt,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import Link from "next/link"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const user = session?.user

  // Define interface for navigation items
  interface NavItem {
    title: string
    url: string
    icon: React.ElementType
    roles: string[]
    excludeUnits?: string[]
    onlyUnits?: string[]
  }

  // Define all navigation items
  const allNavItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
      roles: ["SUPER_ADMIN", "STAFF"],
    },
    {
      title: "News",
      url: "/admin/dashboard/news",
      icon: IconNews,
      roles: ["SUPER_ADMIN"],
    },
    {
      title: "Products",
      url: "/admin/dashboard/products",
      icon: IconBox,
      roles: ["SUPER_ADMIN", "STAFF"],
    },
    {
      title: "Transactions",
      url: "/admin/dashboard/transactions",
      icon: IconReceipt,
      roles: ["SUPER_ADMIN", "STAFF"],
    },
    {
      title: "Users",
      url: "/admin/dashboard/users",
      icon: IconUsers,
      roles: ["SUPER_ADMIN"],
    },
  ]

  const filteredNavMain = React.useMemo(() => {
    if (!user) return []

    return allNavItems.filter((item) => {
      // Check Role
      if (!item.roles.includes(user.role as string)) {
        return false
      }

      // Check Unit Exclusions (e.g. Products hidden for WISATA)
      if (item.excludeUnits && user.unit && item.excludeUnits.includes(user.unit)) {
        return false
      }

      // Check Unit Inclusions (e.g. Services only for WISATA)
      // If item has `onlyUnits`...
      if (item.onlyUnits) {
        // If Admin, usually sees all, but let's say Admin sees Services too?
        if (user.role === 'SUPER_ADMIN') return true
        // If Staff, must match unit
        if (user.unit && item.onlyUnits.includes(user.unit)) return true
        return false
      }

      return true
    })
  }, [user])

  const documents = [
    {
      name: "Rekap Bumdes",
      url: "/admin/dashboard?tab=reports",
      icon: IconDatabase,
    }
  ]

  const navSecondary = [
    {
      title: "Settings",
      url: "/admin/dashboard/settings",
      icon: IconSettings,
    }
  ]

  // Filter secondary nav: Staff shouldn't see generic Settings?? 
  // User asked for "Overview, Product/Services, Transaction". 
  // So probably hide Settings for Staff.
  const filteredNavSecondary = user?.role === 'SUPER_ADMIN' ? navSecondary : []
  const filteredDocuments = (user?.role === 'SUPER_ADMIN' || user?.role === 'STAFF') ? documents : []

  // User object for NavUser
  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: user?.image || "", // Use image from session
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Bumdes Kalosi</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        {filteredDocuments.length > 0 && <NavDocuments items={filteredDocuments} />}
        {filteredNavSecondary.length > 0 && <NavSecondary items={filteredNavSecondary} className="mt-auto" />}
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={userData} />}
      </SidebarFooter>
    </Sidebar>
  )
}
