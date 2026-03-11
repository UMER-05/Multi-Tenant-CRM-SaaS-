"use client";

import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ClipboardCheck, ClipboardList, ListTodo, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTasks, createTasks, updateTask, deleteTask } from "../../api/tasks.api";
import { CreateTaskModal } from "./CreateTask";
import { EditTaskModal } from './EditTask'

export default function Tasks() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [tasks, setTasks] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);

    const [selectedTask, setSelectedTask] = React.useState(null);
    const [createOpen, setCreateOpen] = React.useState(false);

    // Table states
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [detailsOpen, setDetailsOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [taskToDelete, setTaskToDelete] = React.useState(null);
    // Fetch tasks (server-side pagination)
    React.useEffect(() => {
        const loadTasks = async () => {
            setLoading(true);
            try {
                const res = await getTasks({
                    params: {
                        page,
                        limit: 10,
                    },
                });

                setTasks(res.data.tasks || []);
                setTotalPages(res.data.totalPages || 1);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.tenant_id) loadTasks();
    }, [user?.tenant_id, page]);

    const handleDeleteTask = async () => {
        if (taskToDelete) {
            try {
                await deleteTask(taskToDelete.id);
                // Refetch tasks
                const res = await getTasks({
                    params: {
                        page,
                        limit: 10,
                    },
                });
                setTasks(res.data.tasks || []);
                setTotalPages(res.data.totalPages || 1);
                setDeleteConfirmOpen(false);
                setTaskToDelete(null);
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
        }
    };

    // Columns
    const columns = [
        // {
        //     id: "select",
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={table.getIsAllPageRowsSelected()}
        //             onCheckedChange={(value) =>
        //                 table.toggleAllPageRowsSelected(!!value)
        //             }
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <Checkbox
        //             checked={row.getIsSelected()}
        //             onCheckedChange={(value) => row.toggleSelected(!!value)}
        //         />
        //     ),
        //     enableSorting: false,
        // },
        {
            accessorKey: "taskName",
            header: "Task Name",
            cell: ({ row }) =>  <span className="font-medium">{row.original.taskName}</span>,
        },
        {
            accessorKey: "assigned_user",
            header: "Assigned To ",
            cell: ({ row }) =>  <span className="font-normal">{row.original.assignedUser.full_name}</span>,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(column.getIsSorted() === "asc")
                            }
                            className="pl-0 hover:bg-transparent"
                        >
                            Status <ArrowUpDown className="ml-1 h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Click to sort by status</p>
                    </TooltipContent>
                </Tooltip>
            ),
        },
        {
            header: "Priority",
            cell: ({ row }) => row.original.priority || "-",
        },
        {
            header: "Created By",
            cell: ({ row }) => row.original.createdBy.full_name || "-",
        },
        {
            header: "Lead",
            cell: ({ row }) => row.original.assignedLead.name || "-",
        },
       
    ];

    const table = useReactTable({
        data: tasks,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <TooltipProvider>
            <div className="w-full">
                <div className="flex items-center py-4 ">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Input
                                placeholder="Filter tasks by name..."
                                value={table.getColumn("taskName")?.getFilterValue() || ""}
                                onChange={(e) =>
                                    table.getColumn("taskName")?.setFilterValue(e.target.value)
                                }
                                className="w-56 md:w-96  "
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Filter tasks by name</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="ml-auto " size='sm' onClick={() => setCreateOpen(true)}>
                                + <ClipboardList  />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Create new task</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

            <div className="rounded-md border  " >
                <Table className='overflow-hidden' >
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id} className='font-bold  bg-sidebar-accent text-black'>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {tasks.length ? (
                            table.getRowModel().rows.map((row) => (
                                <Tooltip key={row.id}>
                                    <TooltipTrigger asChild>
                                        <TableRow onClick={() => navigate(`/dashboard/tasks/${row.original.id}`)} className="cursor-pointer" > 
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Click to view task details</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center h-24">
                                    {loading ? "Loading..." : "No tasks found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-3 py-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Previous
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Go to previous page</p>
                    </TooltipContent>
                </Tooltip>

                <span className="text-sm">
                    Page {page} of {totalPages}
                </span>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Go to next page</p>
                    </TooltipContent>
                </Tooltip>
            </div>

             <CreateTaskModal
                open={createOpen}
                onOpenChange={setCreateOpen}
                tenantId={user?.tenant_id}
                onSubmit={async (data) => {
                    await createTasks(data);
                    // Refetch tasks
                    const res = await getTasks({
                        params: {
                            page,
                            limit: 10,
                        },
                    });
                    setTasks(res.data.tasks || []);
                    setTotalPages(res.data.totalPages || 1);
                }}
            /> 

           
            <EditTaskModal
                open={editOpen}
                onOpenChange={setEditOpen}
                task={selectedTask}
                onSubmit={async (data) => {
                    await updateTask(selectedTask.id, data);
                    // Refetch tasks
                    const res = await getTasks({
                        params: {
                            page,
                            limit: 10,
                        },
                    });
                    setTasks(res.data.tasks || []);
                    setTotalPages(res.data.totalPages || 1);
                }}
            />

            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete task "{taskToDelete?.taskName}"? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteTask}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
        </TooltipProvider>
    );
}
