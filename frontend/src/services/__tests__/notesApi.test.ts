import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { NotesAPI } from "../notesApi";

const mockListNotes = jest.fn() as jest.Mock;
const mockCreateNote = jest.fn() as jest.Mock;
const mockUpdateNote = jest.fn() as jest.Mock;
const mockDeleteNote = jest.fn() as jest.Mock;

jest.mock("../api/notesApi", () => ({
  listNotes: (...args: unknown[]) => mockListNotes(...args),
  createNote: (...args: unknown[]) => mockCreateNote(...args),
  updateNote: (...args: unknown[]) => mockUpdateNote(...args),
  deleteNote: (...args: unknown[]) => mockDeleteNote(...args),
}));

describe("NotesAPI compatibility wrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("delegates getNotes to real notes API layer", async () => {
    (mockListNotes as any).mockResolvedValue([
      {
        id: "n-1",
        content: "hello",
        createdAt: "2026-02-11T00:00:00Z",
        userId: "admin-1",
      },
    ]);

    const result = await NotesAPI.getNotes("session-1");

    expect(mockListNotes).toHaveBeenCalledTimes(1);
    expect(result.notes[0]).toEqual(
      expect.objectContaining({
        id: "n-1",
        content: "hello",
        created_by: "admin-1",
      }),
    );
  });

  it("delegates add/update/delete operations", async () => {
    (mockCreateNote as any).mockResolvedValue({ id: "n-2" });
    (mockUpdateNote as any).mockResolvedValue({ id: "n-2" });
    (mockDeleteNote as any).mockResolvedValue({ success: true });

    await NotesAPI.addNote("session-1", { content: "new note" });
    await NotesAPI.updateNote("n-2", { content: "updated" });
    await NotesAPI.deleteNote("n-2");

    expect(mockCreateNote).toHaveBeenCalledTimes(1);
    expect(mockUpdateNote).toHaveBeenCalledTimes(1);
    expect(mockDeleteNote).toHaveBeenCalledTimes(1);
  });
});
