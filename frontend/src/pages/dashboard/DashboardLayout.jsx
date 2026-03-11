import { AppSidebar } from "./components/sidebar.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, Link, useLocation, useMatch } from "react-router-dom";

export default function DashboardLayout() {
  const { pathname } = useLocation();

  const isDashboard = pathname === "/dashboard";
  const isTenants = pathname.startsWith("/dashboard/tenants");
  const isTasksList = pathname === "/dashboard/tasks";
  const isUsers = pathname.startsWith("/dashboard/users");
  const isPipelinesManagment = pathname.startsWith("/dashboard/pipeline-managment") 
  const isLeads = pathname.startsWith("/dashboard/leads");
  const isPipeline = pathname.startsWith("/dashboard/pipelines");
  // Dynamic route (IMPORTANT)
  const taskDetailsMatch = useMatch("/dashboard/tasks/:taskId");
  const isTaskDetails = Boolean(taskDetailsMatch);

    const tenantDetailsMatch = useMatch("/dashboard/tenants/:tenantId");
  const isTenantDetails = Boolean(tenantDetailsMatch);

  const pipelineManagmentDetailsMatch = useMatch("/dashboard/pipeline-managment/:pipelineId");
  const isPipelineManagmentDetails = Boolean(pipelineManagmentDetailsMatch);

  const leadDetailsMatch = useMatch("/dashboard/leads/:leadId");
  const isLeadDetails = Boolean(leadDetailsMatch);
  
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />

            <Breadcrumb>
              <BreadcrumbList>

                {/* Dashboard */}
                <BreadcrumbItem>
                  {isDashboard ? (
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {/* Tenants */}
                {isTenants && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {pathname === "/dashboard/tenants" ? (
                        <BreadcrumbPage>Tenants</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to="/dashboard/tenants">Tenants</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </>
                )}
                {isTenantDetails && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}

                {/* Tasks */}
                {(isTasksList || isTaskDetails) && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isTasksList ? (
                        <BreadcrumbPage>Tasks</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to="/dashboard/tasks">Tasks</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </>
                )}

                {/* Task Details */}
                {isTaskDetails && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}

                {/* Users */}
                {isUsers && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {pathname === "/dashboard/users" ? (
                        <BreadcrumbPage>Users</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to="/dashboard/users">Users</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </>
                )}

                {/* Pipelines */}
                {isPipelinesManagment && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {pathname === "/dashboard/pipeline-managment" ? (
                        <BreadcrumbPage>Pipelines Managment</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to="/dashboard/pipeline-managment">Pipelines Managment</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </>
                )}
                {isPipelineManagmentDetails && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
                {isPipeline && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {pathname === "/dashboard/pipelines" ? (
                        <BreadcrumbPage>Pipelines</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to="/dashboard/pipelines">Pipelines</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </>
                )}

               

                {/* Leads */}
                {isLeads && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {pathname === "/dashboard/leads" ? (
                        <BreadcrumbPage>Leads</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to="/dashboard/leads">Leads</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </>
                )}
                {isLeadDetails && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
