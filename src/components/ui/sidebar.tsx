
"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button, type ButtonProps } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarContextProps {
  isCollapsed: boolean
  isMobile: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [isCollapsed, setCollapsed] = React.useState(true)

  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])

  const pathname = usePathname()
  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [pathname, isMobile])

  return (
    <SidebarContext.Provider value={{ isCollapsed, isMobile, setCollapsed }}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed, isMobile } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "transition-[margin-left] duration-300 ease-in-out",
        !isMobile && (!isCollapsed ? "lg:ml-64" : "lg:ml-16"),
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const Sidebar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  const { isCollapsed, isMobile, setCollapsed } = useSidebar()

  return (
    <>
      {!isCollapsed && isMobile && (
        <div
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
        />
      )}
      <aside
        ref={ref}
        className={cn(
          "fixed top-0 left-0 z-20 flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isMobile ? "w-64" : isCollapsed ? "w-16" : "w-64",
          isMobile && isCollapsed && "-translate-x-full",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-20 items-center border-b p-4",
        isCollapsed ? "justify-center [&_span]:hidden" : "justify-start",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ScrollArea>
>(({ className, ...props }, ref) => {
  return <ScrollArea ref={ref} className={cn("flex-1", className)} {...props} />
})
SidebarContent.displayName = "SidebarContent"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn("flex flex-col gap-y-1 p-2", className)}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-col gap-y-1", className)} {...props} />
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  if (isCollapsed) return null
  return (
    <h4
      ref={ref}
      className={cn(
        "px-3 pt-2 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends ButtonProps {
  isActive?: boolean
  tooltip?: React.ComponentProps<typeof TooltipContent>
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, isActive, tooltip, asChild, children, ...props }, ref) => {
  const { isCollapsed } = useSidebar()

  const button = (
    <Button
      ref={ref}
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "h-10 w-full justify-start",
        isCollapsed && "w-10 justify-center p-2.5 [&_span]:hidden",
        className
      )}
      asChild={asChild}
      {...props}
    >
      {children}
    </Button>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        {tooltip && <TooltipContent {...tooltip} />}
      </Tooltip>
    )
  }
  return button
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    const { isCollapsed, setCollapsed } = useSidebar()
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!isCollapsed)}
        className={cn("shrink-0", className)}
        {...props}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

export {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
}
