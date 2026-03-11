"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Building,
  Users,
  ClipboardList,
  GitBranch,
  Layers,
  UserCheck,
  GitBranchPlus
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../components/ui/sidebar";

import { useAuth } from '../../../context/AuthContext';



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const role = user?.role;
  const data = {
    navMain: [
      // {
      //   title: "Managment",
      //   icon: SquareTerminal,
      //   isActive: true,
      //   items: [
      //     ...(role == 3 ? [{ title: "Tenants", url: "/dashboard/tenants" }] : []),
      //     ...(role == 2 ? [{ title: "Users", url: "users" }] : []),
      //     ...(role == 1 || role == 2 ? [{ title: "Tasks", url: "tasks" }] : []),

      //   ],
      // },


      ...(role == 3
        ? [
          {
            title: "Tenants",
            url: "/dashboard/tenants",
            icon: Building,
          },
        ]
        : []),


        ...(role == 2
        ? [
          {
            title: "Users",
            url: "/dashboard/users",
            icon: Users,
          },
        ]
        : []),
        
        
        
      ...(role == 1 || role == 2
        ? [
          {
            title: "Tasks",
            url: "/dashboard/tasks",
            icon: ClipboardList,
          },
          {
            title: "Pipelines Managment",
            url: "/dashboard/pipeline-managment",
            icon: GitBranchPlus,
          },
          {
            title: "Pipelines",
            url: "/dashboard/pipelines",
            icon: GitBranch,
          },
        ]
        : []),


      ...(role == 2
        ? [
          {
            title: "Leads",
            url: "/dashboard/leads",
            icon: UserCheck,
          },
        ]
        : []),


 
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }
  const userData = {
    name: user?.full_name,
    email: user?.email,
    role:user?.role,
    avatar: "https://github.com/shadcn.png",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="border-b  ">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Acme Inc</span>
                  <span className="truncate text-xs font-medium text-muted-foreground ">{user?.Tenant.name}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter >
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
