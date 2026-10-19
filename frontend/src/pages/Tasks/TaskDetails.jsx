"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "../../context/AuthContext"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  User,
  Flag,
  Save,
  X,
  FileText,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Pencil,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getTaskById, updateTask } from "../../api/tasks.api"
import { fetchUsers } from "../../api/users.api"
import { getLeads } from "../../api/leads.api"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TaskNoteAndAtachment from "./TaskNoteAndAtachment"

export default function TaskDetails() {
  const { user } = useAuth()
  const { taskId } = useParams()

  const [task, setTask] = useState(null)
  const [formData, setFormData] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [users, seteUsers] = useState([])
  const [leads, setLeads] = useState([])

  useEffect(() => {
    fetchTask()
  }, [taskId])

  const fetchTask = async () => {
    const res = await getTaskById(taskId)
    setTask(res?.data || null)
    setFormData(res?.data || {})
  }

  useEffect(() => {
    fetchUsers(user?.tenant_id).then(res => seteUsers(res.data))
  }, [])

  useEffect(() => {
    getLeads(user?.tenant_id).then(res => setLeads(res.data.leads))
  }, [])

  const handleSave = async () => {
    await updateTask(taskId, {
      taskName: formData.taskName,
      status: formData.status,
      description: formData.description,
      priority: formData.priority,
      assigned_user: formData.assigned_user,
      assigned_lead: formData.assigned_lead,
    })
    fetchTask()
    setIsEditing(false)
  }

  const handleStatusChange = async (status) => {
    await updateTask(taskId, {
      taskName: task.taskName,
      description: task.description,
      priority: task.priority,
      assigned_user: task.assigned_user,
      assigned_lead: task.assigned_lead,
      status: status
    })
    setTask(prev => ({ ...prev, status }))
    setFormData(prev => ({ ...prev, status }))
  }

  return (
    <TooltipProvider>
      <ScrollArea className="h-full">
        <Tabs defaultValue="details" className="w-full">
          <div className="mx-auto max-w-7xl px-6 py-6 space-y-6">

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="space-y-1">
                  {isEditing ? (
                    <input
                      className="text-2xl font-semibold border rounded-md px-2 py-1 w-full"
                      value={formData.taskName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, taskName: e.target.value })
                      }
                    />
                  ) : (
                    <h1 className="text-2xl font-semibold">
                      {task?.taskName || "—"}
                    </h1>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Task details & activity
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2 text-green-500" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormData(task || {})
                        setIsEditing(false)
                      }}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* TABS */}
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>

            {/* DETAILS */}
            <TabsContent value="details" className="space-y-6">
              <Separator />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* MAIN */}
                <div className="lg:col-span-2 space-y-6">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem icon={Flag} label="Status">
                      <Select
                        value={isEditing ? formData.status : task?.status}
                        onValueChange={(v) =>
                          isEditing
                            ? setFormData({ ...formData, status: v })
                            : handleStatusChange(v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            <span className="text-amber-600 font-medium">
                              Pending
                            </span>
                          </SelectItem>

                          <SelectItem value="in_progress">
                            <span className="text-blue-600 font-medium">
                              In Progress
                            </span>
                          </SelectItem>

                          <SelectItem value="completed">
                            <span className="text-green-600 font-medium">
                              Completed
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </InfoItem>

                    <InfoItem icon={Flag} label="Priority">
                      <Select
                        value={isEditing ? formData.priority : task?.priority}
                        disabled={!isEditing}
                        onValueChange={(v) =>
                          setFormData({ ...formData, priority: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Urgent">
                            <span className="text-red-600 font-medium">
                              Urgent
                            </span>
                          </SelectItem>

                          <SelectItem value="High">
                            <span className="text-orange-600 font-medium">
                              High
                            </span>
                          </SelectItem>

                          <SelectItem value="Medium">
                            <span className="text-amber-600 font-medium">
                              Medium
                            </span>
                          </SelectItem>

                          <SelectItem value="Low">
                            <span className="text-emerald-600 font-medium">
                              Low
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </InfoItem>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem icon={User} label="Assigned User">
                      <Select
                        value={isEditing ? formData.assigned_user : task?.assignedUser?.id}
                        disabled={!isEditing}
                        onValueChange={(v) =>
                          setFormData({ ...formData, assigned_user: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Assign user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map(u => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </InfoItem>

                    <InfoItem icon={User} label="Assigned Lead">
                      <Select
                        value={isEditing ? formData.assigned_lead : task?.assignedLead?.id}
                        disabled={!isEditing}
                        onValueChange={(v) =>
                          setFormData({ ...formData, assigned_lead: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Assign lead" />
                        </SelectTrigger>
                        <SelectContent>
                          {leads.map(l => (
                            <SelectItem key={l.id} value={l.id}>
                              {l.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </InfoItem>
                  </div>
                  <InfoItem label="Description" >
                    {isEditing ? (
                      <RichTextEditor
                        value={formData.description}
                        onChange={(v) =>
                          setFormData({ ...formData, description: v })
                        }
                      />
                    ) : (
                      <div
                        className="prose prose-sm max-w-none min-h-32 "
                        dangerouslySetInnerHTML={{
                          __html: task?.description || "—",
                        }}
                      />
                    )}
                  </InfoItem>
                </div>

                {/* SIDEBAR */}
                <div className="space-y-4 ">
                  <InfoItem
                    icon={User}
                    label="Created By"
                    value={task?.createdBy?.full_name}
                    subValue={task?.createdAt && new Date(task.createdAt).toLocaleString()}
                  />
                  <InfoItem
                    icon={User}
                    label="Updated By"
                    value={task?.updatedBy?.full_name}
                    subValue={task?.updatedAt && new Date(task.updatedAt).toLocaleString()}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes">
              <TaskNoteAndAtachment taskId={taskId} />
            </TabsContent>

            <TabsContent value="attachments">
              <TaskNoteAndAtachment taskId={taskId} />
            </TabsContent>

          </div>
        </Tabs>
      </ScrollArea>
    </TooltipProvider>
  )
}

/* ===== Helpers unchanged ===== */

function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  return (
    <div className="border rounded-lg">
      <div className="flex gap-1 border-b p-2 bg-muted flex-wrap">
        <EditorButton editor={editor} action="bold" icon={Bold} />
        <EditorButton editor={editor} action="italic" icon={Italic} />
        <EditorButton editor={editor} action="underline" icon={UnderlineIcon} />
        <EditorButton editor={editor} action="strike" icon={Strikethrough} />
        <EditorButton editor={editor} action="code" icon={Code} />
      </div>
      <div className="p-3 min-h-[150px] prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

function EditorButton({ editor, action, icon: Icon }) {
  return (
    <button
      onClick={() => editor.commands[`toggle${capitalize(action)}`]()}
      className={`p-2 rounded-md border ${editor.isActive(action) ? "bg-green-200 border-green-400" : "hover:bg-muted"
        }`}
    >
      <Icon size={16} />
    </button>
  )
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function InfoItem({ icon: Icon, label, value, subValue, children }) {
  return (
    <div className="flex gap-3 rounded-xl border p-4">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        {children ? (
          <div className="mt-1">{children}</div>
        ) : (
          <>
            <p className="text-sm font-medium mt-1">{value || "—"}</p>
            {subValue && (
              <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
