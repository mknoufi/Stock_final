import apiClient from "../httpClient";

export interface Note {
  id?: string;
  tenantId?: string;
  userId?: string;
  createdAt?: string;
  tags?: string[];
  title?: string;
  content?: string;
  body?: string; // legacy alias used by existing UI
}

export async function listNotes(params?: {
  q?: string;
  page?: number;
  pageSize?: number;
}) {
  const res = await apiClient.get("/api/notes", { params });
  const records = res.data?.data || [];
  return records.map((note: any) => ({
    id: note.id,
    title: note.title,
    content: note.content,
    body: note.content,
    createdAt: note.created_at,
    userId: note.created_by,
  })) as Note[];
}

export async function createNote(note: Note) {
  const content = (note.content || note.body || "").trim();
  const title = (note.title || content.slice(0, 80) || "Untitled").trim();
  const res = await apiClient.post("/api/notes", {
    title,
    content,
  });
  const data = res.data?.data;
  return {
    id: data?.id,
    title: data?.title,
    content: data?.content,
    body: data?.content,
    createdAt: data?.created_at,
    userId: data?.created_by,
  } as Note;
}

export async function updateNote(id: string, note: Partial<Note>) {
  const payload: Record<string, string> = {};
  if (typeof note.title === "string") payload.title = note.title;
  if (typeof note.content === "string") payload.content = note.content;
  if (typeof note.body === "string") payload.content = note.body;

  const res = await apiClient.put(`/api/notes/${id}`, payload);
  return res.data?.data;
}

export async function deleteNote(id: string) {
  const res = await apiClient.delete(`/api/notes/${id}`);
  return res.data;
}
