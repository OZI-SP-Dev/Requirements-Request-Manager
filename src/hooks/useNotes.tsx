import { useState, useEffect } from "react";
import { InternalError } from "../api/InternalErrors";
import { INote, INotesApi, NotesApiConfig } from "../api/NotesApi";


export interface INotes {
    loading: boolean,
    error: string,
    clearError: () => void,
    notes: INote[],
    submitNote: (title: string, text: string) => Promise<INote>,
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

    const submitNote = async (title: string, text: string) => {
        try {
            if (title && text) {
                if (requestId !== undefined && requestId >= 0) {
                    let newNote = await notesApi.submitNewNote({
                        Title: title,
                        Text: text,
                        RequestId: requestId
                    });
                    let allNotes = notes;
                    allNotes.push(newNote);
                    setNotes(allNotes);
                    return newNote;
                } else {
                    throw new InternalError(new Error("Cannot submit a new Note for an unknown Request!"))
                }
            } else {
                throw new InternalError(new Error("The Title and Body must be filled out!"))
            }
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

    const deleteNote = async (note: INote) => {
        try {
            await notesApi.deleteNoteById(note.Id);
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
        submitNote,
        deleteNote
    })

}