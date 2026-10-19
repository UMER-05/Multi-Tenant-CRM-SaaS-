"use client";

import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { getPipelines, createPipeline, updatePipeline, deletePipeline } from "../../api/pipelines.api";
import { CreatePipelineModal } from "./CreatePipeline";
//import { EditPipelineModal } from './EditPipeline'

export default function PipelinesManagment() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [pipelines, setPipelines] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const [selectedPipeline, setSelectedPipeline] = React.useState(null);
    const [createOpen, setCreateOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [pipelineToDelete, setPipelineToDelete] = React.useState(null);

    // Table states
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    // Fetch pipelines
    React.useEffect(() => {
        const loadPipelines = async () => {
            setLoading(true);
            try {
                const res = await getPipelines();
                setPipelines(res.data || []);
            } catch (error) {
                console.error("Failed to fetch pipelines:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.tenant_id) loadPipelines();
    }, [user?.tenant_id]);

    const handleDeletePipeline = async () => {
        if (pipelineToDelete) {
            try {
                await deletePipeline(pipelineToDelete.id);
                // Refetch pipelines
                const res = await getPipelines();
                setPipelines(res.data || []);
                setDeleteConfirmOpen(false);
                setPipelineToDelete(null);
            } catch (error) {
                console.error("Failed to delete pipeline:", error);
            }
        }
    };

    // Columns
    const columns = [
        {
            accessorKey: "name",
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
                            Name <ArrowUpDown className="ml-1 h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Click to sort by name</p>
                    </TooltipContent>
                </Tooltip>
            ),
            cell: ({ row }) =>  <span className="font-medium">{row.original.name}</span>,
        },
    ];

    const table = useReactTable({
        data: pipelines,
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
                                placeholder="Filter by name..."
                                value={table.getColumn("name")?.getFilterValue() || ""}
                                onChange={(e) =>
                                    table.getColumn("name")?.setFilterValue(e.target.value)
                                }
                                className="w-56 md:w-96  "
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Filter by name</p>
                        </TooltipContent>
                    </Tooltip>
                    {user?.role === 2 && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className="ml-auto " size='sm' onClick={() => setCreateOpen(true)}>
                                    <Plus/> Pipeline
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Create new pipeline</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
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
                        {pipelines.length ? (
                            table.getRowModel().rows.map((row) => (
                                <Tooltip key={row.id}>
                                    <TooltipTrigger asChild>
                                        <TableRow onClick={() => navigate(`/dashboard/pipeline-managment/${row.original.id}`)} className="cursor-pointer" >
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
                                        <p>Click to view pipeline details</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center h-24">
                                    {loading ? "Loading..." : "No pipelines found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {user?.role === 2 && (
                <>
                    <CreatePipelineModal
                        open={createOpen}
                        onOpenChange={setCreateOpen}
                        onSubmit={async (data) => {
                            await createPipeline(data);
                            // Refetch pipelines
                            const res = await getPipelines();
                            setPipelines(res.data || []);
                        }}
                    />

                    {/* <EditPipelineModal
                        open={editOpen}
                        onOpenChange={setEditOpen}
                        pipeline={selectedPipeline}
                        onSubmit={async (data) => {
                            await updatePipeline(selectedPipeline.id, data);
                            // Refetch pipelines
                            const res = await getPipelines();
                            setPipelines(res.data || []);
                        }}
                    /> */}
                </>
            )}

            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete pipeline "{pipelineToDelete?.name}"? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeletePipeline}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
        </TooltipProvider>
    );
}