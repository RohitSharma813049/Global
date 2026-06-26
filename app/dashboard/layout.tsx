import React from "react";
import { SidebarProvider } from "@/components/sidebar-context";
import { DashboardLayoutWrapper } from "@/components/layout/dashboard-layout-wrapper";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayoutWrapper>
        {children}
      </DashboardLayoutWrapper>
    </SidebarProvider>
  );
}
