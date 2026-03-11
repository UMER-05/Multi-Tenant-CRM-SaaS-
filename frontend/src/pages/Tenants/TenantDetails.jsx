"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Calendar, Users, Pencil, Trash, Building, User } from "lucide-react"
import { addUser, fetchUsers, updateUser, deleteUser } from "../../api/users.api"
import { getTenantById, updateTenant, deleteTenant } from "../../api/tenants.api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CreateUserModal } from "../Users/CreateUser.jsx"
import { EditUserModal } from "../Users/EditUser.jsx";
import { EditTenantModal } from "../Tenants/EditTenant.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TenantDetails() {
  const { tenantId } = useParams()

  const [tenant, setTenant] = React.useState([])
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const [createUserOpen, setCreateUserOpen] = React.useState(false)
  const [userEditOpen, setUserEditOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState(null)
  const [userToDelete, setUserToDelete] = React.useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [tenantEditOpen, setTenantEditOpen] = React.useState(false)
  const [TenantDeleteConfirmOpen, setTenantDeleteConfirmOpen] = React.useState(false)
  const [tenantActive, setTenantActive] = React.useState(tenant?.isActive || false)
  const navigate = useNavigate();
  React.useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const tenantRes = await getTenantById(tenantId)
        setTenant(tenantRes.data || [])
        setTenantActive(tenantRes.data?.isActive || false)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (tenantId) load()
  }, [tenantId])

  React.useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const usersRes = await fetchUsers(tenantId)
        setUsers(usersRes.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tenantId])

  const handleTenantDelete = async () => {
    try {
      await deleteTenant(tenantId)
      navigate('/dashboard/tenants');
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    try {
      await deleteUser(userToDelete)
      const dataFetched = await fetchUsers(tenantId)
      setUsers(dataFetched.data || [])
      setDeleteConfirmOpen(false)
      setUserToDelete(null)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div className="px-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-semibold flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className='text-sm'>{tenant?.name?.[0]}</AvatarFallback>
              </Avatar>
              {tenant?.name}
            </span>
            <p className="text-sm text-muted-foreground">Tenant overview & users</p>
          </div>
          <div className="flex justify-end gap-2  ">
            {/* checkBox */}
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="relative inline-flex items-center cursor-pointer">
                  {/* Hidden checkbox */}
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={tenantActive}
                    onChange={async () => {
                      const newStatus = !tenantActive
                      console.log("Toggling tenant active status to:", newStatus)
                      setTenantActive(newStatus) // update UI immediately

                      try {
                        await updateTenant(tenantId, { isActive: newStatus })
                      } catch (err) {
                        console.error(err)
                        // revert if API fails
                        setTenantActive(!newStatus)
                      }
                    }}
                  />

                  {/* Track */}
                  <div
                    className="w-14 h-8 bg-red-300 rounded-[10px] 
                     peer-checked:bg-green-300 
                     transition-colors duration-300"
                  ></div>

                  {/* Thumb */}
                  <div
                    className="absolute left-[0.3rem] bottom-[0.3rem]
                     w-5 h-5 bg-white rounded-[8px]
                     transition-transform duration-300
                     peer-checked:translate-x-6"
                  ></div>
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle tenant active status</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' className='border-none bg-transparent hover:bg-transparent text-green-300 gap-0 hover:text-green-300' onClick={() => setTenantDeleteConfirmOpen(true)}> <Trash className="text-red-300" /> </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete tenant</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="border-none bg-transparent hover:bg-transparent text-green-300 gap-0 hover:text-green-300" onClick={() => setTenantEditOpen(true)}><Pencil className="text-green-300 " /> </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit tenant</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

      <Separator />

      <div className="grid grid-cols-1  gap-6 lg:grid-cols-[1fr_340px]">
        {/* USERS SECTION */}
        <Card className='order-1 lg:-order-none ' >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" /> Users
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' onClick={() => setCreateUserOpen(true)} className='border-none bg-transparent hover:bg-transparent text-green-300 gap-0 hover:text-green-300'>+<User /></Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create new user</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>

          <CardContent className="space-y-3">
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No users added yet
              </p>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onEdit={() => { setSelectedUser(user); setUserEditOpen(true) }}
                  onDelete={() => { setUserToDelete(user.id); setDeleteConfirmOpen(true) }}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* TENANT INFO */}
        <Card  >
          <CardHeader>
            <CardTitle className="text-base">Tenant Overview</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4  ">


            <Separator />

            <InfoItem icon={Mail} label="Email" value={tenant?.contact_email} />
            <InfoItem icon={Phone} label="Phone" value={tenant?.phone} />
            <InfoItem icon={MapPin} label="Address" value={tenant?.address} />
            <InfoItem icon={Calendar} label="Created" value={new Date(tenant?.createdAt).toLocaleDateString()} />
            <InfoItem icon={Calendar} label="Updated" value={new Date(tenant?.updatedAt).toLocaleDateString()} />
            <InfoItem icon={Users} label="Total Users" value={users?.length} />
          </CardContent>
        </Card>
      </div>

      {/* MODALS */}
      <EditTenantModal
        open={tenantEditOpen}
        onOpenChange={setTenantEditOpen}
        tenant={tenant}
        onSubmit={async (data) => {
          await updateTenant(tenantId, data);
          // Refetch tenants
          const dataFetched = await getTenantById(tenantId);
          setTenant(dataFetched.data || []);
        }}
      />
      <CreateUserModal
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        tenantId={tenantId}
        onSubmit={async (data) => {
          await addUser({ ...data, tenant_id: tenantId })
          const dataFetched = await fetchUsers(tenantId)
          setUsers(dataFetched.data || [])
        }}
      />

      <EditUserModal
        open={userEditOpen}
        onOpenChange={setUserEditOpen}
        user={selectedUser}
        onSubmit={async (data) => {
          if (!selectedUser) return
          await updateUser(selectedUser.id, data)
          const dataFetched = await fetchUsers(tenantId)
          setUsers(dataFetched.data || [])
        }}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={TenantDeleteConfirmOpen} onOpenChange={setTenantDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this tenant? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTenantDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleTenantDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
    </TooltipProvider>
  )
}

/* -------------------- */
/* USER ROW COMPONENT */
function UserRow({ user, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-4 py-3">
      <div>
        <p className="font-medium">{user?.full_name}</p>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs rounded-full bg-muted px-2 py-1">
          {user?.role === 1 ? "User" : user?.role === 2 ? "Admin" : user?.role === 3 ? "Super Admin" : "Unknown"}
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="border-none bg-transparent hover:bg-transparent" onClick={onEdit}>
              <Pencil className="text-green-300" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit user</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="bg-transparent hover:bg-transparent" onClick={onDelete}>
              <Trash className="text-red-300" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete user</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

/* -------------------- */
/* INFO ITEM */
function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value || "-"}</p>
      </div>
    </div>
  )
}
