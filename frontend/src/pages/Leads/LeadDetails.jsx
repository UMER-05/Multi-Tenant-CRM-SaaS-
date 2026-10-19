"use client"

import { use, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Edit,
  Save,
  X,
  FileText,
  UserMinus,
  UserStarIcon,
  UserCheck2Icon,
  UserCheck,
  Contact,
  Phone,
  PhoneCall,
  SquareArrowUpRight,
  SquareArrowDown,
  Currency,
  CurlyBraces,
  CurrencyIcon,
  Vault,
  DoorClosedLocked,
  CircleDollarSign,
  UserCircle,
  GitBranch,
  StarIcon,
  Layers,
  StarOff,
  ActivitySquare,
  Activity,
  CircleArrowDown,
  Circle,
  CircleCheck,
  Goal,
  ArrowUpDown,
  Target,
} from "lucide-react";
import { useForm, Controller, useWatch } from "react-hook-form"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLeadById, updateLead } from "../../api/leads.api"
import { getPipelines } from "../../api/pipelines.api"
import { getStages } from "../../api/stages.api"
import { fetchUsers } from "../../api/users.api"
import { useAuth } from "../../context/AuthContext";
import { fa } from "zod/v4/locales"

export default function LeadDetails() {
  const { leadId } = useParams()
  const { user } = useAuth();
  const [lead, setLead] = useState({})
  const [pipelines, setPipelines] = useState([])
  const [stages, setStages] = useState([])
  const [users, setUsers] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  // const [loading, setLoading] = useState(true);
  const { control, handleSubmit, reset } = useForm();
  const pipelineId = useWatch({ control, name: 'pipeline_id' });

  useEffect(() => {
    fetchData()
  }, [leadId])

  useEffect(() => {
    if (Object.keys(lead).length > 0) {
      reset(lead);
    }
  }, [lead, reset]);

  const fetchData = async () => {
    try {
      const leadRes = await getLeadById(leadId);
      const leadData = leadRes?.data;
      setLead(leadData);
    } catch (error) {
      console.error("Failed to fetch lead data:", error);
    }
  }

  useEffect(() => {
    if (isEditing) {
      const fetchLists = async () => {
        const [pipelinesRes, usersRes] = await Promise.all([
          getPipelines(),
          fetchUsers(user?.tenant_id),
        ]);
        setPipelines(pipelinesRes?.data || [])
        setUsers(usersRes?.data || [])
      };
      fetchLists();
    }
  }, [isEditing, user?.tenant_id, lead?.pipeline_id]);
  useEffect(() => {
    const fetchStages = async () => {
      if (pipelineId) {
        const stagesRes = await getStages(pipelineId);
        setStages(stagesRes?.data || []);
      }
    };
    fetchStages();
  }, [pipelineId]);

  const onSubmit = async (data) => {
    const updateData = {
      name: data?.name,
      contact_info: data?.contact_info,
      source: data?.source,
      expected_value: data?.expected_value ? parseFloat(data.expected_value) : null,
      assigned_user_id: data?.assigned_user_id,
      pipeline_id: data?.pipeline_id,
      pipeline_stage_id: data?.pipeline_stage_id,
      status: data?.status,
      outcome: data?.outcome,
    }

    await updateLead(leadId, updateData)
      setLead((prev) => ({ ...prev, ...updateData }))
      setIsEditing(false)
  }

  //if (loading) return <div>Loading...</div>

  return (
    <TooltipProvider>
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6 max-w-4xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <UserCheck className="h-5 w-5 text-muted-foreground" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {isEditing ? (
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => <Input {...field} className="text-2xl font-bold" />}
                    />
                  ) : (
                    lead?.name
                  )}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className='' variant='outline' size="sm" onClick={handleSubmit(onSubmit)}>
                        <Save className="text-green-400 h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save changes</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button  className='text-red-500'variant='outline' size="sm" onClick={() => setIsEditing(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cancel</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit lead</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          <Separator />

          {/* DETAILS */}
          <div className="space-y-4">


            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex"><Phone className="h-5 w-4 mr-2"/> Contact Info</h3>
              {isEditing ? (
                <Controller
                  name="contact_info"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              ) : (
                <p className="text-sm border rounded p-2 ">{lead?.contact_info}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex"><SquareArrowDown className="h-5 w-4 mr-2"/>Source</h3>
              {isEditing ? (
                <Controller
                  name="source"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              ) : (
                <p className="text-sm  border rounded p-2">{lead?.source}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex"><CircleDollarSign className="h-5 w-4 mr-2"/>Expected Value</h3>
              {isEditing ? (
                <Controller
                  name="expected_value"
                  control={control}
                  render={({ field }) => <Input {...field} type="number" step="0.01" />}
                />
              ) : (
                <p className="text-sm  border rounded p-2">{lead?.expected_value}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex"><UserCircle className="h-5 w-4 mr-2"/>Assigned User</h3>
              {isEditing ? (
                <Controller
                  name="assigned_user_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select User" />
                      </SelectTrigger>
                      <SelectContent>
                        {users && users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <p className="text-sm border  rounded p-2">{lead?.assignedUser?.full_name || "Not assigned"}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex"><GitBranch className="h-5 w-4 mr-2"/>Pipeline</h3>
              {isEditing ? (
                <Controller
                  name="pipeline_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Pipeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {pipelines.map((pipeline) => (
                          <SelectItem key={pipeline.id} value={pipeline.id.toString()}>
                            {pipeline.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <p className="text-sm  border  rounded p-2">{lead?.Pipeline?.name}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex"><Layers className="h-5 w-4 mr-2"/> Stage</h3>
              {isEditing ? (
                <Controller
                  name="pipeline_stage_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id.toString()}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <p className="text-sm border  rounded p-2">{lead?.Stage?.name}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex"><CircleCheck className="h-5 w-4 mr-2"/> Status</h3>
              {isEditing ? (
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
              ) : (
                <p className="text-sm border  rounded p-2">{lead?.status}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex"> <Goal className="h-5 w-4 mr-2"/>Outcome</h3>
              {isEditing ? (
                <Controller
                  name="outcome"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
              ) : (
                <p className="text-sm border rounded p-2">{lead?.outcome || "N/A"}</p>
              )}
            </div>
          </div>

        </div>
      </ScrollArea>
    </TooltipProvider>
  );
}