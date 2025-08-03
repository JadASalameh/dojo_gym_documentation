"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/members": "Members Management",
  "/add-member": "Add New Member",
  "/edit-member": "Edit Member",
  "/categories": "Training Categories",
  "/enrollments": "Enrollments",
}

export function Header() {
  const pathname = usePathname()

  // Handle dynamic member detail pages
  let pageName = pageNames[pathname] || "Dashboard"
  if (pathname.startsWith("/member/")) {
    pageName = "Member Details"
  }

  return (
    <header className="border-b border-white/10 bg-[#0b0b0b]/80 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white hover:bg-white/10" />
          <h1 className="text-2xl font-bold text-white">{pageName}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">A</span>
          </div>
        </div>
      </div>
    </header>
  )
}
