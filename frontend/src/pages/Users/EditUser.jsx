"use client"

import * as React from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {useAuth} from '../../context/AuthContext'
const editUserSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  role: z.coerce.number(),
  password: z.string().optional(),
})

export function EditUserModal({ open, onOpenChange, user, onSubmit }) {
    const {user: savedUser} = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      full_name: "",
      email: "",
      role: 1,
      password: "",
    },
  })

  // Populate form when user changes
  React.useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name || "",
        email: user.email || "",
        role: user.role ?? 1,
        password: "",
      })
    }
  }, [user, reset])

  const submitHandler = async (data) => {
    await onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <FieldGroup>
            {/* FULL NAME */}
            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input {...register("full_name")} placeholder="User full name" />
              {errors.full_name && (
                <FieldDescription className="text-red-500">
                  {errors.full_name.message}
                </FieldDescription>
              )}
            </Field>

            {/* EMAIL */}
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                {...register("email")}
                placeholder="user@example.com"
              />
              {errors.email && (
                <FieldDescription className="text-red-500">
                  {errors.email.message}
                </FieldDescription>
              )}
            </Field>

            {/* ROLE */}
           {savedUser?.role ==3 &&  <Field>
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
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">User</SelectItem>
                      <SelectItem value="2">Admin</SelectItem>
                      {/* <SelectItem value="3">Super Admin</SelectItem> */}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <FieldDescription className="text-red-500">
                  {errors.role.message}
                </FieldDescription>
              )}
            </Field>}

            {/* PASSWORD */}
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                {...register("password")}
                placeholder="Leave blank to keep unchanged"
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
