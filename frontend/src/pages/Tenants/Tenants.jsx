"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Building, Pencil, Trash } from "lucide-react"
import { CreateUserModal } from '../Users/CreateUser';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { getTenants, createTenants, updateTenant, deleteTenant } from "../../api/tenants.api"
import { addUser } from '../../api/users.api';
import { TenantDetails } from "./TenantDetails"
import { EditTenantModal } from './EditTenant';
import { CreateTenantModal } from './CreateTenant';


export default function Tenants() {
const navigate = useNavigate();
  const [selectedTenantId, setSelectedTenantId] = React.useState(null)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [selectedTenant, setSelectedTenant] = React.useState(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [tenantToDelete, setTenantToDelete] = React.useState(null);
  const [createUserOpen, setCreateUserOpen] = React.useState(false)

  // const [usersOpen,setUsersOpen] =React.useState(false)

  // Columns
  const columns = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="capitalize font-medium ">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "contact_email",
      header: ({ column }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className='pl-0 hover:bg-transparent'
            >
              Email
              <ArrowUpDown />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to sort by email</p>
          </TooltipContent>
        </Tooltip>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("contact_email")}</div>,
    },
    {
      accessorKey: "phone",
      header: () => <div className="text-left">Phone</div>,
      cell: ({ row }) => {
        return <div>{row.getValue('phone')}</div>
      },
    },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const tenant = row.original
    //     return (

    //       <>
    //         <Button className='border-none bg-transparent hover:bg-transparent' onClick={() => { setSelectedTenant(tenant); setEditOpen(true) }} ><Pencil className="text-green-300"/> </Button>

    //         <Button className='bg-transparent hover:bg-transparent ' onClick={() => {
    //           setTenantToDelete(tenant);
    //           setDeleteConfirmOpen(true);
    //         }}>
    //          <Trash className="text-red-300" /></Button>

    //       </>)
    //   },
    // },
  ]

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [tenants, setTenants] = React.useState([]);
  const [loading, setLoading] = React.useState(false);



  React.useEffect(() => {
    const loadTenants = async () => {
        console.log("Tenants component mounted"); // should log once in prod

      setLoading(true);
      try {
        const data = await getTenants();
        setTenants(data.data || []); // Ensure it's an array
      } catch (error) {
        console.error("Failed to fetch Tenants:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTenants();
  }, []);

  const table = useReactTable({
    data: tenants,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleDeleteTenant = async () => {
    if (tenantToDelete) {
      try {
        await deleteTenant(tenantToDelete.id);
        // Refetch tenants
        const dataFetched = await getTenants();
        setTenants(dataFetched.data || []);
        setDeleteConfirmOpen(false);
        setTenantToDelete(null);
      } catch (error) {
        console.error("Failed to delete tenant:", error);
      }
    }
  }

  return (
    <TooltipProvider>
      <div className="w-full ">
        <div className="flex items-center py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Filter emails..."
                value={table.getColumn("contact_email")?.getFilterValue() || ""}
                onChange={(event) =>
                  table.getColumn("contact_email")?.setFilterValue(event.target.value)
                }
                className="w-56 md:w-96 "
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter tenants by email</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size='sm' variant='outline' className="ml-auto mr-1 text-md text-green-300  bg-transparent hover:bg-transparent hover:text-green-400" onClick={() => setCreateOpen(true)}>
                + <Building  />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new tenant</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="">
                    Columns <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize hover:scale-[1.02] border-b"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle column visibility</p>
            </TooltipContent>
          </Tooltip>
        </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <Tooltip key={row.id}>
                  <TooltipTrigger asChild>
                    <TableRow onClick={() =>
                      navigate(`/dashboard/tenants/${row.original.id}`)} data-state={row.getIsSelected() && "selected"} className="cursor-pointer"> 
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to view tenant details</p>
                  </TooltipContent>
                </Tooltip>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {loading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go to previous page</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go to next page</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>



      <EditTenantModal
        open={editOpen}
        onOpenChange={setEditOpen}
        tenant={selectedTenant}
        onSubmit={async (data) => {
          await updateTenant(selectedTenant.id, data);
          // Refetch tenants
          const dataFetched = await getTenants();
          setTenants(dataFetched.data || []);
        }}
      />
      <CreateTenantModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={async (data) => {
          await createTenants(data);
          // Refetch tenants
          const dataFetched = await getTenants();
          setTenants(dataFetched.data || []);
        }}
      />
      <CreateUserModal
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        onSubmit={async (data) => {
          await addUser(data);
        }}
        tenantId={selectedTenantId}
      />
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete tenant "{tenantToDelete?.name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTenant}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
    </TooltipProvider>
  )
}
