import { spWebContext } from "../providers/SPWebContext";
import { ApiError } from "./InternalErrors";


export interface INote {
    Id: number,
    Title: string,
    Text: string,
    RequestId: number
}

export interface INewNote {
    Title: string,
    Text: string,
    RequestId: number
}

interface SPNote {
    Id: number,
    Title: string,
    Text: string,
    Request: { Id: number }
}

export interface INotesApi {
    fetchNotesByRequestId(requestId: number): Promise<INote[]>,
    submitNewNote(newNote: INewNote): Promise<INote>,
    deleteNoteById(noteId: number): Promise<void>
}

export class NotesApi implements INotesApi {

    notesList = spWebContext.lists.getByTitle("Notes");

    async fetchNotesByRequestId(requestId: number): Promise<INote[]> {
        try {
            let notes: SPNote[] = await this.notesList.items.select("Id", "Request/Id", "Title", "Text").filter(`RequestId eq ${requestId}`).expand("Request").get();
            return notes.map(spNote => {
                return {
                    Id: spNote.Id,
                    Title: spNote.Title,
                    Text: spNote.Text,
                    RequestId: spNote.Request.Id
                }
            });
        } catch (e) {
            let message = `Error occurred while trying to fetch Notes for Request with ID ${requestId}`;
            console.error(message);
            console.error(e);
            if (e instanceof Error) {
                throw new ApiError(e, message + `: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(message + `: ${e}`));
            } else {
                throw new ApiError(undefined, message);
            }
        }
    }

    async submitNewNote(newNote: INewNote): Promise<INote> {
        try {
            return (await this.notesList.items.add(newNote)).data;
        } catch (e) {
            let message = `Error occurred while trying to submit a Note for Request with ID ${newNote.RequestId}`;
            console.error(message);
            console.error(e);
            if (e instanceof Error) {
                throw new ApiError(e, message + `: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(message + `: ${e}`));
            } else {
                throw new ApiError(undefined, message);
            }
        }
    }

    async deleteNoteById(noteId: number): Promise<void> {
        try {
            return this.notesList.items.getById(noteId).delete();
        } catch (e) {
            let message = `Error occurred while trying to delete a Note with ID ${noteId}`;
            console.error(message);
            console.error(e);
            if (e instanceof Error) {
                throw new ApiError(e, message + `: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(message + `: ${e}`));
            } else {
                throw new ApiError(undefined, message);
            }
        }
    }
}

export class NotesApiDev implements INotesApi {

    sleep() {
        return new Promise(r => setTimeout(r, 500));
    }

    notesList: INote[] = [{
        Id: 1,
        Title: "Super Note",
        Text: "This is a very important note, everyone must know about the ramifications of this note.",
        RequestId: 1
    }, {
        Id: 2,
        Title: "Less Super Important Note",
        Text: "This is a less important note, everyone should still know about the ramifications of this note.",
        RequestId: 1
    }];

    maxId: number = 2;

    async fetchNotesByRequestId(requestId: number): Promise<INote[]> {
        await this.sleep();
        return this.notesList.filter(note => note.RequestId === requestId);
    }

    async submitNewNote(newNote: INewNote): Promise<INote> {
        await this.sleep();
        let note = {
            Id: ++this.maxId,
            ...newNote
        }
        this.notesList.push(note);
        return note;
    }

    async deleteNoteById(noteId: number): Promise<void> {
        await this.sleep();
        this.notesList = this.notesList.filter(note => note.Id !== noteId);
    }
}

export class NotesApiConfig {
    private static notesApi: INotesApi

    // optionally supply the api used to set up test data in the dev version
    static getApi(): INotesApi {
        if (!this.notesApi) {
            this.notesApi = process.env.NODE_ENV === 'development' ? new NotesApiDev() : new NotesApi();
        }
        return this.notesApi;
    }
}