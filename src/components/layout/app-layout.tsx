import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Logo } from './logo';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-7 text-primary" />
            <h1 className="text-xl font-semibold">AR DrillMaster</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src="https://picsum.photos/seed/cadet/100/100" data-ai-hint="profile picture" />
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">Cadet Dinesh</span>
              <span className="text-xs text-sidebar-foreground/70">NCC/23/12345</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between border-b bg-background/50 px-4 backdrop-blur-sm md:hidden">
          <div className="flex items-center gap-2">
            <Logo className="size-7 text-primary" />
            <h1 className="text-lg font-semibold">AR DrillMaster</h1>
          </div>
          <SidebarTrigger />
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
