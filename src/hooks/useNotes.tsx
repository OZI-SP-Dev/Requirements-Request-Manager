import { useState, useEffect } from "react";
import { InternalError } from "../api/InternalErrors";
import { INote, INotesApi, NotesApiConfig } from "../api/NotesApi";


export interface INotes {
    loading: boolean,
    error: string,
    clearError: () => void,
    notes: INote[],
    getGeneralNotes: () => INote[],
    getStatusNotes: () => INote[],
    submitNewNote: (title: string, text: string) => Promise<INote>,
    updateNote: (note: INote) => Promise<INote>,
    deleteNote: (note: INote) => Promise<void>
}

export function useNotes(requestId?: number): INotes {

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [notes, setNotes] = useState<INote[]>([]);

    const notesApi: INotesApi = NotesApiConfig.getApi();

    const clearError = () => setError("");

    const fetchNotes = async () => {
        try {
            setLoading(true);
            if (requestId !== undefined && requestId >= 0) {
                setNotes(await notesApi.fetchNotesByRequestId(requestId));
            }
        } catch (e) {
            console.error(`Error trying to fetch Notes for Request ${requestId}`);
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
                throw e;
            } else if (e instanceof Error) {
                setError(e.message);
                throw new InternalError(e);
            } else if (typeof (e) === "string") {
                setError(e);
                throw new InternalError(new Error(e));
            } else {
                setError(`Unknown error occurred while trying to fetch Notes for Request ${requestId}`);
                throw new InternalError(new Error(`Unknown error occurred while trying to fetch Notes for Request ${requestId}`));
            }
        } finally {
            setLoading(false);
        }
    }

    const validateNewNote = (title: string, text: string) => {
        if (!title) {
            throw new InternalError(new Error("The Title must be filled out!"));
        } else if (!text) {
            throw new InternalError(new Error("The Body must be filled out!"));
        } else if (requestId === undefined || requestId < 0) {
            throw new InternalError(new Error("Cannot submit a Note for an unknown Request!"));
        }
    }

    const submitNewNote = async (title: string, text: string) => {
        try {
            validateNewNote(title, text);
            let newNote = await notesApi.submitNewNote({
                Title: title,
                Text: text,
                // requestId can't be undefined here because of validateNewNote(), but ts throws an error
                RequestId: requestId !== undefined ? requestId : -1
            });
            let allNotes = notes;
            allNotes.unshift(newNote);
            setNotes(allNotes);
            return newNote;
        } catch (e) {
            console.error(`Error trying to submit Note for Request ${requestId}`);
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
                throw e;
            } else if (e instanceof Error) {
                setError(e.message);
                throw new InternalError(e);
            } else if (typeof (e) === "string") {
                setError(e);
                throw new InternalError(new Error(e));
            } else {
                setError(`Unknown error occurred while trying to submit Note for Request ${requestId}`);
                throw new InternalError(new Error(`Unknown error occurred while trying to submit Note for Request ${requestId}`));
            }
        }
    }

    const updateNote = async (note: INote) => {
        try {
            validateNewNote(note.Title, note.Text);
            let updatedNote = await notesApi.updateNote(note);
            let allNotes = notes;
            allNotes = allNotes.filter(n => n.Id !== updatedNote.Id);
            allNotes.unshift(updatedNote);
            setNotes(allNotes);
            return updatedNote;
        } catch (e) {
            console.error(`Error trying to update Note for Request ${requestId}`);
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
                throw e;
            } else if (e instanceof Error) {
                setError(e.message);
                throw new InternalError(e);
            } else if (typeof (e) === "string") {
                setError(e);
                throw new InternalError(new Error(e));
            } else {
                setError(`Unknown error occurred while trying to update Note for Request ${requestId}`);
                throw new InternalError(new Error(`Unknown error occurred while trying to update Note for Request ${requestId}`));
            }
        }
    }

    const deleteNote = async (note: INote) => {
        try {
            await notesApi.deleteNoteById(note.Id);
            setNotes(notes.filter(n => n.Id !== note.Id));
        } catch (e) {
            console.error(`Error trying to delete Note for Request ${requestId}`);
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
                throw e;
            } else if (e instanceof Error) {
                setError(e.message);
                throw new InternalError(e);
            } else if (typeof (e) === "string") {
                setError(e);
                throw new InternalError(new Error(e));
            } else {
                setError(`Unknown error occurred while trying to delete Note for Request ${requestId}`);
                throw new InternalError(new Error(`Unknown error occurred while trying to delete Note for Request ${requestId}`));
            }
        }
    }

    useEffect(() => {
        fetchNotes(); // eslint-disable-next-line
    }, [requestId])

    return ({
        loading,
        error,
        clearError,
        notes,
        getGeneralNotes: () => notes.filter(n => !n.Status),
        getStatusNotes: () => notes.filter(n => n.Status),
        submitNewNote,
        updateNote,
        deleteNote
    })

}