'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";


// ----- Constants -----
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const SIDEBAR_WIDTH_DESKTOP = "16rem";
const SIDEBAR_WIDTH_MOBILE = "14rem";

// ----- Types -----
export type SidebarState = "expanded" | "collapsed";

export type SidebarContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  state: SidebarState;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// ----- Hook -----
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
}

// ----- Provider -----
export const SidebarProvider: React.FC<{ defaultOpen?: boolean; children: React.ReactNode }> = ({ defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // extra runtime guard to avoid `document` access during SSR/bundling
    if (typeof document === "undefined") return;
    try {
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${open ? "expanded" : "collapsed"}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; SameSite=Lax`;
    } catch (e) {
      // ignore cookie write errors in restricted environments
    }
  }, [open, mounted]);

  const value = useMemo<SidebarContextType>(() => ({
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    state: open ? "expanded" : "collapsed",
  }), [open, openMobile, isMobile]);

  if (!mounted) return null; // prevent SSR flicker

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

// ----- Mobile trigger -----
export const SidebarTrigger: React.FC = () => {
  const { open, setOpen } = useSidebar();
  return (
    <button
      onClick={() => setOpen(!open)}
      className="fixed left-4 top-4 z-50 rounded-md border bg-background p-2 text-foreground shadow-sm md:hidden"
    >
      ☰
    </button>
  );
};

// ----- Page wrapper -----
export const SidebarInset: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="flex min-h-screen flex-1 flex-col md:pl-[16rem]">{children}</div>;
};

// ----- Main Sidebar -----
export const Sidebar: React.FC<React.ComponentProps<"div"> & { side?: "left" | "right"; collapsible?: "offcanvas" | "icon" | "none"; }> = ({
  side = "left",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  // Mobile Sidebar
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground p-0 [&>button]:hidden"
          style={{ width: SIDEBAR_WIDTH_MOBILE }}
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop Sidebar (non-collapsible)
  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn("bg-sidebar text-sidebar-foreground flex h-full", className)}
        style={{ width: SIDEBAR_WIDTH_DESKTOP }}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Desktop Sidebar (collapsible)
  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-side={side}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-gap"
        className="relative w-0 bg-transparent transition-[width] duration-200 ease-linear"
        style={{ width: SIDEBAR_WIDTH_DESKTOP }}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-screen transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:-left-[16rem]"
            : "right-0 group-data-[collapsible=offcanvas]:-right-[16rem]",
          className
        )}
        style={{ width: SIDEBAR_WIDTH_DESKTOP }}
        {...props}
      >
        <div data-sidebar="sidebar" data-slot="sidebar-inner" className="bg-sidebar flex h-full w-full flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};
