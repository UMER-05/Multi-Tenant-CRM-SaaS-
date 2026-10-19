import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
    ClipboardPenLine,
    SendHorizonal,
    Paperclip,
    PaperclipIcon,
} from "lucide-react";
import { creareTaskNote, getAllTaskNotes } from "../../api/taskNote.api"
import { sendAttachment, getAttachments } from '../../api/taskAttachment.api';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";

function TaskNoteAndAtachment({ taskId }) {
    const { user } = useAuth();
    const [activeView, setActiveView] = useState("notes")
    const [notes, setNotes] = useState([]);
    const [attachments, setAttachments] = useState([]);
    //note
    const createNoteSchema = z.object({
        content: z.string().min(1, "Note content is required"),
    });
    const { register,reset, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(createNoteSchema),
        defaultValues: {
            content: "",
        },
    });

    const notesubmitHandler = async (data) => {
        await creareTaskNote({ ...data, task_id: taskId });
        fetchNotes();
        reset();

    }



    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ACCEPTED_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const taskAttachmentSchema = z.object({
        files: z
            .instanceof(FileList)
            .refine((files) => files.length > 0, "At least one file is required")
            .refine(
                (files) =>
                    Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
                "Each file must be under 10MB"
            )
            .refine(
                (files) =>
                    Array.from(files).every((file) =>
                        ACCEPTED_TYPES.includes(file.type)
                    ),
                "Invalid file type"
            ),
    });
    const {
        register: registerAttachment,
        handleSubmit: handleAttachmentSubmit,
        formState: { errors: noteErrors },
    } = useForm({
        resolver: zodResolver(taskAttachmentSchema),
    });

    const onAttachmentSubmit = async (data) => {
        const formData = new FormData();

        Array.from(data.files).forEach((file) => {
            formData.append("files", file);
        });

        sendAttachment(taskId, formData)
        fetchAttachments()
        reset();
    };

    const fetchNotes = async () => {
        const res = await getAllTaskNotes(taskId);
        setNotes(res.data || []);
        console.log('notess:', res.data)
    }
    useEffect(() => {
        fetchNotes();
    }, [])

    const fetchAttachments = async () => {
        const res = await getAttachments(taskId);
        setAttachments(res.data || []);
        console.log('attahcmentss:', res.data)
    }
    useEffect(() => {
        fetchAttachments();
    }, [])

    const downloadPdf = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch PDF");

    const blob = await res.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    // OPTION A: Open in new tab (controlled)
    window.open(blobUrl, "_blank");

    // OPTION B: Force download
    /*
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "file.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    */

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  } catch (err) {
    console.error(err);
    alert("Unable to download PDF");
  }
};


    return (
        <Card className="h-[70vh] bg-sidebar-accent flex flex-col pb-4 px-4 rounded-lg">

            <CardHeader className="mb-1 p-3">
                <div className="flex items-center justify-between">

                    <CardTitle className="flex items-center gap-2">
                        {activeView === "notes" ? (
                            <>
                                <ClipboardPenLine className="h-5 w-5" />
                                Task Notes
                            </>
                        ) : (
                            <>
                                <Paperclip className="h-5 w-5" />
                                Task Attachments
                            </>
                        )}
                    </CardTitle>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant={activeView === "notes" ? "default" : "ghost"}
                            onClick={() => setActiveView("notes")}
                        >
                            Notes
                        </Button>
                        <Button
                            size="sm"
                            variant={activeView === "attachments" ? "default" : "ghost"}
                            onClick={() => setActiveView("attachments")}
                        >
                            Attachments
                        </Button>
                    </div>

                </div>
            </CardHeader>

            {/* ===== CONTENT ===== */}
            <CardContent className="rounded-t-lg bg-white flex-1 overflow-y-auto space-y-3">

                {/* NOTES VIEW */}
                {activeView === "notes" &&
                    notes.map((note) => (
                        <div key={note.id} className="flex flex-col mb-4">
                            {/* Header */}
                            {note.createdBy.id !== user.id && <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm text-gray-700">
                                    {note.createdBy.full_name}
                                </span>
                            </div>}

                            {/* Note Body */}
                            <div
                                className={`p-3 shadow-md max-w-[80%] break-words
                                rounded-xl
                                ${note.createdBy.id === user.id
                                        ? "bg-green-100 self-end"
                                        : "bg-blue-50 self-start"
                                    }
                                `}
                            >
                                <p className="text-sm text-gray-800">{note.content}</p>

                                {/* Footer: Date & Time */}
                                <div className="mt-2 text-xs text-gray-500 text-right">
                                    {new Date(note.createdAt).toLocaleDateString()} ·{" "}
                                    {new Date(note.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        </div>

                    ))
                }

                {/* ATTACHMENTS VIEW */}
                {activeView === "attachments" && (
                    attachments.map((file) => (
                        <div className="border rounded-md p-3 bg-white space-y-2">
                            <div className="text-xs text-muted-foreground">
                                <span className="font-bold">{file.User.full_name}</span>
                            </div>

                            <div className="flex flex-col items-start gap-2">
                                <a
                                    href={file.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-sm text-blue-600 hover:underline"
                                >
                                    {file.file_name}
                                </a>
                                <a
                                    href={file.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    </a>
                                    <img
                                        src={file.file_url}
                                        alt={file.file_name}
                                        className="max-w-full max-h-48 rounded-md border object-contain hover:opacity-90 transition"
                                    />
                                    <button
  onClick={() => downloadPdf(file.file_url)}
  className="px-3 py-1.5 text-sm rounded-md border text-blue-600 hover:bg-blue-50"
>
  Download PDF
</button>

                                {/* <a href={file.file_url}
                                 download={file.file_url}
                                >
                                    Download
                                </a> */}
                                
                            </div>
                            {/* BOTTOM: Date & Time */}
                            <div className="text-[11px] text-muted-foreground border-t pt-1">
                                {new Date(file.createdAt).toLocaleDateString()} ·{" "}
                                {new Date(file.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                        </div>
                    ))

                )}

            </CardContent>

            <Separator className="bg-sidebar-accent w-[90%] m-auto" />

            <CardFooter className="rounded-b-lg bg-white justify-center flex p-3">

                {activeView === "notes" && (
                    <div className="w-[80%] flex mb-2 h-10 items-center space-x-2">
                        <form
                            onSubmit={handleSubmit(notesubmitHandler)}
                            className="w-full flex items-center space-x-2"
                        >
                            <Input
                                {...register("content")}
                                type="text"
                                className="h-[90%] py-3"
                                placeholder="Add a new note..."
                            />
                            <button type="submit">
                                <SendHorizonal className="bg-foreground h-8 w-8 text-white rounded-full p-1" />
                            </button>
                        </form>
                    </div>
                )}

                {/* ATTACHMENT UPLOAD */}
                {activeView === "attachments" && (
                    <form onSubmit={handleAttachmentSubmit(onAttachmentSubmit)} className=" bg--200 flex items-center gap-2 ">
                        <input data-text="Choose files" className='bg-red- before:bg-black w-full md:w-[70%] cursor-pointer
                         before:content-[attr(data-text)]   before:p-[4px] before: before:px-[10px] before:absolute before:rounded before:border before:text-white
                          ' type="file" multiple {...registerAttachment("files")} />
                        <Button size="sm">Upload</Button>
                    </form>
                )}

            </CardFooter>

        </Card>
    )
}
export default TaskNoteAndAtachment;