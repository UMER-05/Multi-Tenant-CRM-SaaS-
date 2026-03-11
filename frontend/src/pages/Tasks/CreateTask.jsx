"use client";

import * as React from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "../../context/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { fetchUsers } from '../../api/users.api.js';
import { getLeads } from '../../api/leads.api.js';

const createTaskSchema = z.object({
  taskName: z.string().min(2, "Task name is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]),
  assigned_user: z.string(),
  assigned_lead: z.string(),
  priority: z.enum(["Urgent", "High", "Medium", "Low"]).default("Medium"), 
  due_date: z.string().min(1, "Due date is required"), 
});

export function CreateTaskModal({ open, onOpenChange, onSubmit }) {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);

  // Fetch users
  useEffect(() => {
    const getUsersData = async () => {
      try {
        const res = await fetchUsers(user.tenant_id);
        console.log('user res', res.data);
        setUsers(res.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsersData();
  }, [user.tenant_id]);

  // Fetch leads
  useEffect(() => {
    fetchAllLeads();
  }, []);

  const fetchAllLeads = async () => {
    try {
      let allLeads = [];
      let page = 1;
      let totalPages = 1;

      do {
        const res = await getLeads({ page, limit: 30 });
        allLeads = [...allLeads, ...(res.data.leads || [])];
        totalPages = res.totalPages || 1;
        page++;
      } while (page <= totalPages);

      setLeads(allLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeads([]);
    }
  };

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      taskName: "",
      description: "",
      status: "pending",
      assigned_user: "",
      assigned_lead: "",
      priority: "Medium",
      due_date: "",
    },
  });

  React.useEffect(() => {
    reset({
      taskName: "",
      description: "",
      status: "pending",
      assigned_user: "",
      assigned_lead: "",
    });
  }, [reset]);

  const submitHandler = async (data) => {
    const formattedData = {
    ...data,
    due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
  };

  await onSubmit(formattedData);
  onOpenChange(false)
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Task Name</FieldLabel>
              <Input {...register("taskName")} placeholder="Task Name" />
              {errors.taskName && <FieldDescription className="text-red-500">{errors.taskName.message}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input {...register("description")} placeholder="Description" />
              {errors.description && <FieldDescription className="text-red-500">{errors.description.message}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <FieldDescription className="text-red-500">{errors.status.message}</FieldDescription>}
            </Field>
            <Field>
              <FieldLabel>Priority</FieldLabel>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && <FieldDescription className="text-red-500">{errors.priority.message}</FieldDescription>}
            </Field>
            <Field>
              <FieldLabel>Assign User</FieldLabel>
              <Controller
                name="assigned_user"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>{u.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Assign Lead</FieldLabel>
              <Controller
                name="assigned_lead"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.map((l) => (
                        <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>Due Date</FieldLabel>
              <Controller
                name="due_date"
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    value={field.value}
                    onChange={field.onChange}
                      min={new Date().toISOString().split("T")[0]} 

                  />
                )}
              />
              {errors.due_date && <FieldDescription className="text-red-500">{errors.due_date.message}</FieldDescription>}
            </Field>

          </FieldGroup>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
