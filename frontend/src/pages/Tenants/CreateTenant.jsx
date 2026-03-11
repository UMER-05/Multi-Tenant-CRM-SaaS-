"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

const createTenantSchema = z.object({
  name: z.string().min(2, "Tenant name is required"),
  contact_email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  address: z.string().min(3, "Address is required"),
})

export function CreateTenantModal({ open, onOpenChange, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: "",
      contact_email: "",
      phone: "",
      address: "",
    },
  })

  const submitHandler = async (data) => {
    await onSubmit(data)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Tenant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Tenant Name</FieldLabel>
              <Input {...register("name")} placeholder="Tenant name" />
              {errors.name && (
                <FieldDescription className="text-red-500">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                {...register("contact_email")}
                placeholder="tenant@example.com"
              />
              {errors.contact_email && (
                <FieldDescription className="text-red-500">
                  {errors.contact_email.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel>Phone</FieldLabel>
              <Input {...register("phone")} placeholder="+92xxxxxxxxx" />
              {errors.phone && (
                <FieldDescription className="text-red-500">
                  {errors.phone.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel>Address</FieldLabel>
              <Input {...register("address")} placeholder="City, Country" />
              {errors.address && (
                <FieldDescription className="text-red-500">
                  {errors.address.message}
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
              {isSubmitting ? "Creating..." : "Create Tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
