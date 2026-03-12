import {
  createNote,
  deleteNote as deleteNoteById,
  listNotes,
  updateNote as updateNoteById,
  type Note as ApiNote,
} from "./api/notesApi";

/** Legacy note type kept for compatibility with existing callers. */
export interface Note {
  id?: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

/** Note response from API */
interface NotesResponse {
  notes: Note[];
}

/** API operation result */
interface ApiResult {
  success: boolean;
  message?: string;
}

const toApiNote = (sessionId: string, note: Omit<Note, "id">): ApiNote => ({
  body: note.content,
  tags: sessionId ? ["session", sessionId] : ["session"],
});

const fromApiNote = (note: any): Note => ({
  id: note?.id,
  content: note?.body ?? "",
  created_at: note?.createdAt,
  updated_at: note?.updatedAt,
  created_by: note?.userId,
});

// Notes API service
export const NotesAPI = {
  getNotes: async (sessionId: string): Promise<NotesResponse> => {
    const data = await listNotes({ q: sessionId, page: 1, pageSize: 200 });
    const source = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.notes)
        ? data.notes
        : Array.isArray(data)
          ? data
          : [];

    return { notes: source.map(fromApiNote) };
  },

  addNote: async (
    sessionId: string,
    note: Omit<Note, "id">,
  ): Promise<ApiResult> => {
    await createNote(toApiNote(sessionId, note));
    return { success: true };
  },

  updateNote: async (
    noteId: string,
    note: Partial<Note>,
  ): Promise<ApiResult> => {
    await updateNoteById(noteId, { body: note.content });
    return { success: true };
  },

  deleteNote: async (noteId: string): Promise<ApiResult> => {
    await deleteNoteById(noteId);
    return { success: true };
  },
};
