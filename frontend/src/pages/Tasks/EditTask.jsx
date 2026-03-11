"use client";

import * as React from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const editTaskSchema = z.object({
  taskName: z.string().min(2, "Task name is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]),
});

export function EditTaskModal({ open, onOpenChange, task, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      taskName: "",
      description: "",
      status: "pending",
    },
  });

  /* 🔑 CRITICAL: sync task → form */
  React.useEffect(() => {
    if (task) {
      reset({
        taskName: task.taskName || "",
        description: task.description || "",
        status: task.status || "pending",
      });
    }
  }, [task, reset]);

  const submitHandler = async (data) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <FieldGroup>
            {/* Task Name */}
            <Field>
              <FieldLabel>Task Name</FieldLabel>
              <Input {...register("taskName")} placeholder="Task Name" />
              {errors.taskName && (
                <FieldDescription className="text-red-500">
                  {errors.taskName.message}
                </FieldDescription>
              )}
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input {...register("description")} placeholder="Description" />
              {errors.description && (
                <FieldDescription className="text-red-500">
                  {errors.description.message}
                </FieldDescription>
              )}
            </Field>

            {/* ✅ STATUS (FIXED) */}
            <Field>
              <FieldLabel>Status</FieldLabel>

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">
                        In Progress
                      </SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.status && (
                <FieldDescription className="text-red-500">
                  {errors.status.message}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
