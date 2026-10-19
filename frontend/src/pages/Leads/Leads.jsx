"use client";

import * as React from "react";
import { ArrowUpDown, MoreHorizontal, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLeads, createLead, updateLead, deleteLead } from "../../api/leads.api";
import { CreateLeadModal } from "./CreateLead";
import { EditLeadModal } from "./EditLead";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function Leads() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [leads, setLeads] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [selectedLead, setSelectedLead] = React.useState(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [leadToDelete, setLeadToDelete] = React.useState(null);

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const loadLeads = async () => {
    try {
      const res = await getLeads();
      setLeads(res.data.leads || []);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
     // setLoading(false);
    }
  };
  React.useEffect(() => {
    loadLeads();
  }, [user?.tenant_id]);

  const handleDeleteLead = async () => {
    if (!leadToDelete) return;
    try {
      await deleteLead(leadToDelete.id);
      const res = await getLeads();
      loadLeads();
      setDeleteConfirmOpen(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

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
              className="pl-0 hover:bg-transparent font-bold"
            >
              Name <ArrowUpDown className="ml-1 h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to sort by name</p>
          </TooltipContent>
        </Tooltip>
      ),
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "contact_info",
      header: "Contact Info",
      cell: ({ row }) => <span>{row.original.contact_info}</span>,
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => <span>{row.original.source || "-"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <span>{row.original.status || "-"}</span>,
    },
    {
      accessorKey: "expected_value",
      header: ({ column }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="pl-0 hover:bg-transparent font-bold text-black"
            >
              Value <ArrowUpDown className="ml-1 h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to sort by value</p>
          </TooltipContent>
        </Tooltip>
      ),
      cell: ({ row }) => <span>{row.original.expected_value ? `$${ row.original.expected_value}` : "-"}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div onClick={(e)=>e.stopPropagation()}>
        <Tooltip>
          <TooltipTrigger asChild>

            <Button
              variant="outline"
              className="text-red-400 "
              onClick={() => {setLeadToDelete(row.original); setDeleteConfirmOpen(true); }}
            >
              <Trash  />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Lead</p>
          </TooltipContent>
        </Tooltip>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: leads,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
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
        <div className="flex items-center py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Filter leads by name..."
                value={table.getColumn("name")?.getFilterValue() || ""}
                onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                className="w-56 md:w-96"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter leads by name</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="ml-auto "
                
                size="sm"
                onClick={() => setCreateOpen(true)}
              >
                <Plus /> Lead
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new lead</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className='bg-sidebar'>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id} className="font-bold text-black">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {leads.length ? (
                table.getRowModel().rows.map((row) => (
                  <Tooltip key={row.id}>
                    <TooltipTrigger asChild>
                      <TableRow
                        className="cursor-pointer"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}
                           onClick={() => navigate(`/dashboard/leads/${row.original.id}`)}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view lead details</p>
                    </TooltipContent>
                  </Tooltip>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center h-24">
                    {loading ? "Loading..." : "No leads found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modals fetch pipelines/stages/users internally */}
        <CreateLeadModal
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={async (data) => {
            await createLead(data);
            await loadLeads();
          }}
        />

        <EditLeadModal
          open={editOpen}
          onOpenChange={setEditOpen}
          lead={selectedLead}
          onSubmit={async (data) => {
            await updateLead(selectedLead.id, data);
            const res = await getLeads();
            setLeads(res.data || []);
          }}
        />

        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete lead<span className="font-bold"> "{leadToDelete?.name}"?</span> This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteLead}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
