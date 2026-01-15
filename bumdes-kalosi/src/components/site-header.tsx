import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-background flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-4 px-4 lg:px-8">
        <SidebarTrigger className="-ml-1 rounded-none hover:bg-slate-100" />
        <div className="w-[1px] h-6 bg-slate-200" />
        <h1 className="text-lg font-serif italic text-black">Manajemen BUMDes Sumber Kalosi</h1>
      </div>
    </header>
  )
}
