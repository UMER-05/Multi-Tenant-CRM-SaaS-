"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Calendar, User, Shield } from "lucide-react"
import { useEffect } from "react"
import { getUserById } from "../../api/users.api.js"

export function UserDetailsModal({ open, onOpenChange, userId }) {
  if (!userId) return null

  const [user, setUser] = React.useState({})
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true)
      try {
        const data = await getUserById(userId)
        console.log("User Details:", data)
        setUser(data.data || {})
      } catch (error) {
        console.error("Failed to fetch user details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [userId])

  const roleLabel =
    user.role === 3
      ? "Super Admin"
      : user.role === 2
      ? "Admin"
      : "User"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Avatar className="h-10 w-10 rounded-xl">
              <AvatarFallback className="rounded-xl bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{user.full_name}</span>
              <span className="text-sm font-normal text-muted-foreground">
                User Profile
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Separator />

        {/* Body */}
        <ScrollArea className="max-h-[70vh] px-6 py-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem icon={Mail} label="Email" value={user.email} />
                <InfoItem icon={Shield} label="Role" value={roleLabel} />
              </div>

              <Separator />

              {/* Meta */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={Calendar}
                  label="Created At"
                  value={new Date(user.createdAt).toLocaleString()}
                />
                <InfoItem
                  icon={Calendar}
                  label="Last Updated"
                  value={new Date(user.updatedAt).toLocaleString()}
                />
              </div>
            </div>
          )}
        </ScrollArea>

        <Separator />

        {/* Footer */}
        <DialogFooter className="px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border p-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  )
}
