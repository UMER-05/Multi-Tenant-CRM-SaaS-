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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useAuth } from "../../context/AuthContext";
import { getPipelines } from "../../api/pipelines.api";
import { getStages } from "../../api/stages.api";
import { fetchUsers } from "../../api/users.api";

const createLeadSchema = z.object({
  name: z.string().min(2, "Lead name is required"),
  contact_info: z.string().min(1, "Contact info is required"),
  source: z.string().min(1, "Source is required"),
  expected_value: z.number().optional(),
  assigned_user_id: z.string().optional(),
  pipeline_id: z.string().min(1, "Pipeline is required"),
  pipeline_stage_id: z.string().min(1, "Stage is required"),
  status: z.enum(["open", "closed"]),
  outcome: z.enum(["win", "lose", "pending"]).default("pending"),
});

export function CreateLeadModal({ open, onOpenChange,  onSubmit }) {
const [users, setUsers] = React.useState([]);
const [pipelines, setPipelines] = React.useState([]);
const [stages, setStages] = React.useState([]);
const { user } = useAuth();
  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: "",
      contact_info: "",
      source: "",
      expected_value: 0,
      assigned_user_id: "",
      pipeline_id: "",
      pipeline_stage_id: "",
      status: "open",
      outcome: "pending",
    },
  });


  const selectedPipelineId = watch("pipeline_id");

  React.useEffect(() => {
    reset({
      name: "",
      contact_info: "",
      source: "",
      expected_value: 0,
      assigned_user_id: "",
      pipeline_id: "",
      pipeline_stage_id: "",
      status: "open",
      outcome: "pending",
    });
  }, [reset]);

  // Reset stage selection when pipeline changes
  React.useEffect(() => {
    if (selectedPipelineId) {
      setValue("pipeline_stage_id", "");
    }
  }, [selectedPipelineId, setValue]);

  // Fetch data when modal opens
  React.useEffect(() => {
    if (open && user?.tenant_id) {
      const loadData = async () => {
        try {
          const [pipelinesRes, usersRes] = await Promise.all([
            getPipelines(),
            fetchUsers(user.tenant_id)
          ]);
          setPipelines(pipelinesRes.data || []);
          setUsers(usersRes.data || []);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      };
      loadData();
    }
  }, [open, user?.tenant_id]);

  React.useEffect(() => {
    if (selectedPipelineId) {
      const loadStages = async () => {
        try {
          const stagesRes = await getStages(selectedPipelineId);
          setStages(stagesRes.data || []);
        } catch (error) {
          console.error("Failed to fetch stages:", error);
          setStages([]);
        }
      };
      loadStages();
    } else {
      setStages([]);
    }
  }, [selectedPipelineId]);

  const submitHandler = async (data) => {
    await onSubmit({
      ...data,
      expected_value: data.expected_value ? parseFloat(data.expected_value) : null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Lead</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Lead Name</FieldLabel>
              <Input {...register("name")} placeholder="Lead Name" />
              {errors.name && <FieldDescription className="text-red-500">{errors.name.message}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel>Contact Info</FieldLabel>
              <Input {...register("contact_info")} placeholder="Contact Info" />
              {errors.contact_info && <FieldDescription className="text-red-500">{errors.contact_info.message}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel>Source</FieldLabel>
              <Input {...register("source")} placeholder="Source" />
              {errors.source && <FieldDescription className="text-red-500">{errors.source.message}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel>Expected Value</FieldLabel>
              <Input {...register("expected_value", { valueAsNumber: true })} type="number" step="0.01" placeholder="Expected Value" />
              {errors.expected_value && <FieldDescription className="text-red-500">{errors.expected_value.message}</FieldDescription>}
            </Field>

         
              <Field>
                <FieldLabel>Assigned User (Optional)</FieldLabel>
                <Controller
                  name="assigned_user_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select User (Optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No assignment</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user?.id} value={user?.id}>
                            {user?.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.assigned_user_id && <FieldDescription className="text-red-500">{errors.assigned_user_id.message}</FieldDescription>}
              </Field>
         

            <Field>
              <FieldLabel>Pipeline</FieldLabel>
              <Controller
                name="pipeline_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Pipeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {pipelines && pipelines.length > 0 ? (
                        pipelines.map((pipeline) => (
                          <SelectItem key={pipeline.id} value={pipeline.id}>
                            {pipeline.name}
                          </SelectItem>
                        ))
                      ) : null}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.pipeline_id && <FieldDescription className="text-red-500">{errors.pipeline_id.message}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel>Stage</FieldLabel>
              <Controller
                name="pipeline_stage_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedPipelineId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={selectedPipelineId ? "Select Stage" : "Select Pipeline first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {stages && stages.length > 0 ? (
                        stages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.name}
                          </SelectItem>
                        ))
                      ) : null}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.pipeline_stage_id && <FieldDescription className="text-red-500">{errors.pipeline_stage_id.message}</FieldDescription>}
            </Field>

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
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <FieldDescription className="text-red-500">{errors.status.message}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel>Outcome</FieldLabel>
              <Controller
                name="outcome"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Outcome" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="win">Win</SelectItem>
                      <SelectItem value="lose">Lose</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.outcome && <FieldDescription className="text-red-500">{errors.outcome.message}</FieldDescription>}
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Lead"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}