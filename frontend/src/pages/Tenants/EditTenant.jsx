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
} from "@/components/ui/field";

const editTenantSchema = z.object({
  name: z.string().min(2, "Tenant name is required"),
  contact_email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  address: z.string().min(3, "Address is required"),
})

export function EditTenantModal({ open, onOpenChange, tenant, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editTenantSchema),
    defaultValues: {
      name: "",
      contact_email: "",
      phone: "",
      address: "",
    },
  })

  // Populate form when tenant changes
  React.useEffect(() => {
    if (tenant) {
      reset({
        name: tenant.name || "",
        contact_email: tenant.contact_email || "",
        phone: tenant.phone || "",
        address: tenant.address || "",
        password:'',
      })
    }
  }, [tenant, reset])

  const submitHandler = async (data) => {
    await onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Tenant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <FieldGroup>
            {/* NAME */}
            <Field>
              <FieldLabel>Tenant Name</FieldLabel>
              <Input {...register("name")} placeholder="Tenant name" />
              {errors.name && (
                <FieldDescription className="text-red-500">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            {/* EMAIL */}
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

            {/* PHONE */}
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <Input {...register("phone")} placeholder="+92xxxxxxxxx" />
              {errors.phone && (
                <FieldDescription className="text-red-500">
                  {errors.phone.message}
                </FieldDescription>
              )}
            </Field>

            {/* ADDRESS */}
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
