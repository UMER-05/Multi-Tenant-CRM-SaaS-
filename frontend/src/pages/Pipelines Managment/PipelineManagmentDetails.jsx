"use client"

import { useEffect, useState } from "react"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
    Edit,
    Save,
    X,
    Layers,
    GitBranch,

    Trash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { getPipelineById, updatePipeline } from "../../api/pipelines.api"
import { getStages, updateStage, createStage , deleteStage} from "../../api/stages.api"

import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateStageModal } from "./CreateStage"
export default function PipelineManagmentDetails() {
    const { pipelineId } = useParams()
    const { user } = useAuth();
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [stageToDelete, setStageToDelete] = useState(null);
    const [pipeline, setPipeline] = useState(null)
    const [formData, setFormData] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [editingStageId, setEditingStageId] = useState(null)
    const [editData, setEditData] = useState({
        name: "",
        order: ""
    })

    const [createOpen, setCreateOpen] = useState(false)
    //const [loading, setLoading] = useState(true)
    const [stages, setStages] = useState([])
    useEffect(() => {
        fetchPipeline()
    }, [pipelineId])

    const fetchPipeline = async () => {
        try {
            const res = await getPipelineById(pipelineId)
            setPipeline(res?.data || null)
            setFormData(res?.data || {})
        } finally {
            //   setLoading(false)
        }
    }
    const fetchStages = async () => {
        try {
            const res = await getStages(pipelineId);
            setStages(res?.data || []);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchStages();
    }, [pipelineId]);

    const handleSave = async () => {
        const updateData = {
            name: formData?.name,
        }

        await updatePipeline(pipelineId, updateData)
        setPipeline((prev) => ({ ...prev, ...updateData }))
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditingStageId(null)
        setEditData({ name: "", order: "" })
    }

    const stageHandleSave = async (stageId) => {
        try {
            await updateStage(stageId, editData)
            fetchStages()
            handleCancel()
        } catch (error) {
            console.error(error)
        }
    }
    const handleStageEdit = (stage) => {
        setEditingStageId(stage.id)
        setEditData({
            name: stage.name,
            order: stage.order
        })
    }
    const handleDeleteStage = async () => {    
        try {
          await deleteStage(stageToDelete.id);
          setDeleteConfirmOpen(false);
          await fetchStages();
          setStageToDelete(null);
        } catch (error) {
          console.error("Failed to delete stage:", error);
        }
      };
    
    return (
        <TooltipProvider>
            <ScrollArea className="h-full">
                <div className="p-6 space-y-6 max-w-4xl mx-auto">

                    {/* HEADER */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                <GitBranch className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {isEditing ? (
                                        <Input
                                            value={formData.name || ""}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="text-2xl font-bold"
                                        />
                                    ) : (
                                        pipeline?.name
                                    )}
                                </h1>
                            </div>
                        </div>

                        {user?.role === 2 && (
                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                                                    <X className="h-4 w-4 text-red-400" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Cancel</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="sm" variant='outline'  onClick={handleSave}>
                                                    <Save className="h-4 w-4 text-green-400" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Save changes</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </>
                                ) : (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button  size="sm" onClick={() => setIsEditing(true)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit pipeline</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* DETAILS */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><Layers className="h-4 w-4" /> Pipeline Stages</CardTitle>
                            {/* create a stages */}
                            <Button size="sm" className="ml-auto " onClick={() => setCreateOpen(true)}>
                                <Layers className="h-4 w-4 mr-2" /> Create Stage
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {stages.length === 0 ? (
                                <p className="text-muted-foreground">Add your stages.</p>
                            ) : (

                                <div className="space-y-2">
                                    {stages.map((stage) => {
                                        const isEditing = editingStageId === stage.id

                                        return (
                                            <div
                                                key={stage.id}
                                                className="grid grid-cols-12 items-center p-4 border rounded-lg"
                                            >
                                                {/* Name */}
                                                <div className="col-span-5">
                                                    {isEditing ? (
                                                        <input
                                                            className="w-full border rounded px-2 py-1"
                                                            value={editData.name}
                                                            onChange={(e) =>
                                                                setEditData({ ...editData, name: e.target.value })
                                                            }
                                                        />
                                                    ) : (
                                                        <span className="font-semibold">{stage.name}</span>
                                                    )}
                                                </div>

                                                {/* Order */}
                                                <div className="col-span-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            className="w-full border rounded px-2 py-1"
                                                            value={editData.order}
                                                            onChange={(e) =>
                                                                setEditData({ ...editData, order: e.target.value })
                                                            }
                                                        />
                                                    ) : (
                                                        <span>{stage.order}</span>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="col-span-5 flex justify-end gap-2">
                                                    {isEditing ? (
                                                        <>
                                                            <Button size="sm" onClick={() => stageHandleSave(stage.id)}>
                                                                Save
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={handleCancel}>
                                                                Cancel
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleStageEdit(stage)}
                                                            >
                                                                <Edit className="h-4 w-4  text-green-400" />
                                                                
                                                            </Button>
                                                            <Button variant="outline" size="sm" onClick={() => {
                                                                setStageToDelete(stage);
                                                                setDeleteConfirmOpen(true);
                                                            }}>
                                                                <Trash className="h-4 w-4 text-red-400" />
                                                                
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>


                            )}
                        </CardContent>
                    </Card>



                </div>
                <CreateStageModal
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                    pipeline_Id={pipelineId}
                    onSubmit={async (data) => {
                        await createStage(data);
                        fetchStages();
                    }}
                />
                {/* delete confirm */}
                <Dialog
                          open={deleteConfirmOpen}
                          onOpenChange={setDeleteConfirmOpen}
                        >
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Stage</DialogTitle>
                            </DialogHeader>
                
                            <p>
                              Are you sure you want to delete{" "}
                              <strong>{stageToDelete?.name}</strong>?
                            </p>
                
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setDeleteConfirmOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteStage}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
            </ScrollArea>
        </TooltipProvider>
    );
}