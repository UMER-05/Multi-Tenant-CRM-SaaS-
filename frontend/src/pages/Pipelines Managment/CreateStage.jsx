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
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";

const createStageSchema = z.object({
  name: z.string().min(2, "Stage name is required"),
  pipeline_id: z.string().min(1, "Pipeline is required"),
  order: z.number().min(1, "Order must be at least 1"),
});


//React.useEffect(() => {})

export function CreateStageModal({ open, onOpenChange, pipeline_Id, onSubmit }) {
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createStageSchema),
    defaultValues: {
      name: "",
      pipeline_id: pipeline_Id || "",
      order: 1,
    },
  });

  React.useEffect(() => {
    reset({ name: "", pipeline_id: pipeline_Id || "", order: 1 });
  }, [reset]);

  const submitHandler = async (data) => {
    await onSubmit({ ...data, pipeline_id: pipeline_Id, order: parseInt(data.order) });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Stage</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Stage Name</FieldLabel>
              <Input {...register("name")} placeholder="Stage Name" />
              {errors.name && <FieldDescription className="text-red-500">{errors.name.message}</FieldDescription>}
            </Field>



            <Field>
              <FieldLabel>Order</FieldLabel>
              <Input {...register("order", { valueAsNumber: true })} type="number" placeholder="Order" />
              {errors.order && <FieldDescription className="text-red-500">{errors.order.message}</FieldDescription>}
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Stage"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}