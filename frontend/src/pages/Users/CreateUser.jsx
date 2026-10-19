"use client"

import * as React from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {useAuth} from '../../context/AuthContext'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

const createUserSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  role: z.number(),
  password: z.string().min(6, "Password is required"),
})

export function CreateUserModal({
  open,
  onOpenChange,
  onSubmit,
  tenantId,
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      full_name: "",
      email: "",
      role: 1,
      password: "",
    },
  })

  const submitHandler = async (data) => {
    await onSubmit({...data,tenant_id:tenantId})
    reset()
    onOpenChange(false)
  }
const {user} = useAuth()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input {...register("full_name")} placeholder="John Doe" />
              {errors.full_name && (
                <FieldDescription className="text-red-500">
                  {errors.full_name.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" {...register("email")} placeholder='johndoe@email.com' />
              {errors.email && (
                <FieldDescription className="text-red-500">
                  {errors.email.message}
                </FieldDescription>
              )}
            </Field>
{user?.role ===3 &&
            <Field>
              <FieldLabel>Role</FieldLabel>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">User</SelectItem>
                      <SelectItem value="2">Admin</SelectItem>
                    
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
}
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                {...register("password")}
                placeholder="********"
              />
              {errors.password && (
                <FieldDescription className="text-red-500">
                  {errors.password.message}
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
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
