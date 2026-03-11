import api from "./api"

export const sendAttachment = async(taskId,data)=>{
    const res = await api.post(`/api/task-attachments/${taskId}`,data)
    console.log('Sent Attachment data',res.data)
    return res.data
}

export const getAttachments = async(taskId)=>{
    const res = await api.get(`/api/task-attachments/${taskId}`)
    console.log('Attachments data',res.data)
    return res.data
}