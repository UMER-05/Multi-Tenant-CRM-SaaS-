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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Pencil, Trash, User } from "lucide-react"

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
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { fetchUsers, addUser, deleteUser, updateUser } from "../../api/users.api";
import { UserDetailsModal } from "./UserDetails"
import { EditUserModal } from "./EditUser";
import { CreateUserModal } from './CreateUser'
import { useAuth } from '../../context/AuthContext';

export default function Users() {

  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const [selectedUser, setSelectedUser] = React.useState(null)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState(null)
  const { user } = useAuth();

  const tenantId = user?.tenant_id;


  // Columns for user table
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
      accessorKey: "full_name",
      header: "Full Name",
      cell: ({ row }) => <div className="capitalize font-medium">{row.getValue("full_name")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="pl-0 hover:bg-transparent "
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
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: () => <div className="text-left">Role</div>,
      cell: ({ row }) => {
        const roleValue = row.getValue("role")
        return <div> {roleValue === 3
          ? "Super Admin"
          : roleValue === 2
            ? "Admin"
            : "User"}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        return (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className='border-none bg-transparent hover:bg-transparent' onClick={() => { setSelectedUser(user); setEditOpen(true) }} ><Pencil className="text-green-300" /> </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit user</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button className='bg-transparent hover:bg-transparent ' onClick={() => {
                  setUserToDelete(user)
                  setDeleteConfirmOpen(true)
                }}>
                  <Trash className="text-red-300" /></Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete user</p>
              </TooltipContent>
            </Tooltip>
          </>

        )
      },
    },
  ]

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Fetch users
  React.useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const data = await fetchUsers(tenantId)
        setUsers(data.data || [])
      } catch (err) {
        console.error("Failed to fetch users:", err)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [tenantId])

  const table = useReactTable({
    data: users,
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

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id)
        // Refetch users
        const dataFetched = await fetchUsers(tenantId)
        setUsers(dataFetched.data || [])
        setDeleteConfirmOpen(false)
        setUserToDelete(null)
      } catch (error) {
        console.error("Failed to delete user:", error)
      }
    }
  }

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Filter emails..."
                value={table.getColumn("email")?.getFilterValue() || ""}
                onChange={(e) => table.getColumn("email")?.setFilterValue(e.target.value)}
                className="max-w-sm"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter users by email</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size='sm'  className="ml-auto mr-1 " onClick={() => setCreateOpen(true)}>
                +<User />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new user</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" >
                    Columns <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table.getAllColumns()
                    .filter((col) => col.getCanHide())
                    .map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col.id}
                        className="capitalize"
                        checked={col.getIsVisible()}
                        onCheckedChange={(value) => col.toggleVisibility(!!value)}
                      >
                        {col.id}
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
        <Table >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='font-bold  bg-sidebar-accent text-black'>
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
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

      <UserDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        userId={selectedUser}
      />

      <EditUserModal
        open={editOpen}
        onOpenChange={setEditOpen}
        user={selectedUser}
        onSubmit={async (data) => {
          await updateUser(selectedUser.id, data);
          // Refetch users
          const dataFetched = await fetchUsers(tenantId);
          setUsers(dataFetched.data || []);
        }}
      />
      <CreateUserModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={async (data) => {
          await addUser(data);
          const dataFetched = await fetchUsers(tenantId);
          setUsers(dataFetched.data || []);
        }}
        tenantId={tenantId}
      />
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete user "{userToDelete?.full_name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  )
}
