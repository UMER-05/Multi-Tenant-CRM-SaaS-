"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
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

const createPipelineSchema = z.object({
  name: z.string().min(2, "Pipeline name is required"),
});

export function CreatePipelineModal({ open, onOpenChange, onSubmit }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createPipelineSchema),
    defaultValues: {
      name: "",
    },
  });

  React.useEffect(() => {
    reset({ name: "" });
  }, [reset]);

  const submitHandler = async (data) => {
    await onSubmit({ ...data });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Pipeline</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Pipeline Name</FieldLabel>
              <Input {...register("name")} placeholder="Pipeline Name" />
              {errors.name && <FieldDescription className="text-red-500">{errors.name.message}</FieldDescription>}
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Pipeline"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}