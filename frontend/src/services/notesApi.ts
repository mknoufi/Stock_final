import {
  createNote,
  deleteNote as deleteApiNote,
  listNotes,
  type Note as ApiNote,
  updateNote as updateApiNote,
} from "./api/notesApi";

/** Note data structure */
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

const toLegacyNote = (note: ApiNote): Note => ({
  id: note.id,
  content: note.content || note.body || "",
  created_at: note.createdAt,
  created_by: note.userId,
});

// Notes API service
export const NotesAPI = {
  getNotes: async (_sessionId: string): Promise<NotesResponse> => {
    const notes = await listNotes();
    return { notes: notes.map(toLegacyNote) };
  },

  addNote: async (
    _sessionId: string,
    note: Omit<Note, "id">,
  ): Promise<ApiResult> => {
    await createNote({
      content: note.content,
      body: note.content,
      title: note.content.slice(0, 80),
    });
    return { success: true };
  },

  updateNote: async (
    noteId: string,
    note: Partial<Note>,
  ): Promise<ApiResult> => {
    await updateApiNote(noteId, {
      content: note.content,
      body: note.content,
      title: typeof note.content === "string" ? note.content.slice(0, 80) : undefined,
    });
    return { success: true };
  },

  deleteNote: async (noteId: string): Promise<ApiResult> => {
    await deleteApiNote(noteId);
    return { success: true };
  },
};
