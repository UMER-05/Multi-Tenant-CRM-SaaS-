import api from "./api";

const creareTaskNote = async (data) => {
  const response = await api.post('/api/task-notes', data);
  return response.data;
}

const getAllTaskNotes = async (taskId) => {
  const response = await api.get(`/api/task-notes/${taskId}`);
  return response.data;
}

export { creareTaskNote, getAllTaskNotes };