import { sp } from "@pnp/sp";
import moment from "moment";
import { spWebContext } from "../providers/SPWebContext";
import { INote, ISubmitNote, RequestStatuses } from "./DomainObjects";
import { ApiError } from "./InternalErrors";
import { IPerson, Person, UserApiConfig } from "./UserApi";

interface INewNote extends ISubmitNote {
    Id: number,
    Author: IPerson,
    Modified: string,
    __metadata: {
        etag: string
    }
}

interface SPNote {
    Id: number,
    Title: string,
    Text: string,
    Modified: string,
    Request: { Id: number },
    Author: IPerson,
    Status?: RequestStatuses | null,
    __metadata: {
        etag: string
    }
}

export interface INotesApi {
    fetchNotesByRequestId(requestId: number): Promise<INote[]>,
    fetchAllNotes(requestIds: number[]): Promise<INote[]>,
    submitNewNote(newNote: ISubmitNote): Promise<INote>
}

export class NotesApi implements INotesApi {

    notesList = spWebContext.lists.getByTitle("Notes");
    userApi = UserApiConfig.getApi();

    async fetchNotesByRequestId(requestId: number): Promise<INote[]> {
        try {
            let notes: SPNote[] = await this.notesList.items.select("Id", "Request/Id", "Title", "Text", "Modified", "Author/Id", "Author/Title", "Author/EMail", "Status").filter(`RequestId eq ${requestId}`).expand("Request", "Author").orderBy("Modified", false).get();
            return notes.map(spNote => {
                return {
                    Id: spNote.Id,
                    Title: spNote.Title,
                    Text: spNote.Text,
                    Modified: moment(spNote.Modified),
                    Author: new Person(spNote.Author),
                    RequestId: spNote.Request.Id,
                    Status: spNote.Status,
                    "odata.etag": spNote.__metadata.etag
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

    async fetchAllNotes(requestIds: number[]): Promise<INote[]> {
        try {
            let batch = sp.web.createBatch();
            let promises: Promise<SPNote[]>[] = requestIds.map(id => this.notesList.items.select("Id", "Request/Id", "Title", "Text", "Modified", "Author/Id", "Author/Title", "Author/EMail", "Status").filter(`RequestId eq ${id}`).expand("Request", "Author").inBatch(batch).get());
            batch.execute();

            let notes: SPNote[] = [];
            for (let p of promises) {
                (await p).forEach(note => notes.push(note));
            }

            return notes.map(spNote => {
                return {
                    Id: spNote.Id,
                    Title: spNote.Title,
                    Text: spNote.Text,
                    Modified: moment(spNote.Modified),
                    Author: new Person(spNote.Author),
                    RequestId: spNote.Request.Id,
                    Status: spNote.Status,
                    "odata.etag": spNote.__metadata.etag
                }
            });
        } catch (e) {
            let message = "Error occurred while trying to fetch all Notes";
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

    async submitNewNote(newNote: ISubmitNote): Promise<INote> {
        try {
            let returnedNote: INewNote = (await this.notesList.items.add(newNote)).data;
            return {
                Id: returnedNote.Id,
                Title: returnedNote.Title,
                Text: returnedNote.Text,
                Modified: moment(returnedNote.Modified),
                Author: await this.userApi.getCurrentUser(),
                RequestId: returnedNote.RequestId,
                Status: returnedNote.Status,
                "odata.etag": returnedNote.__metadata.etag
            }
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
}

export class NotesApiDev implements INotesApi {

    userApi = UserApiConfig.getApi();

    sleep() {
        return new Promise(r => setTimeout(r, 500));
    }

    notesList: INote[] = [{
        Id: 1,
        Title: "Super Note",
        Text: "This is a very important note, everyone must know about the ramifications of this note.",
        Modified: moment(),
        Author: new Person({
            Id: 1,
            Title: "Default User",
            EMail: "me@example.com"
        }),
        RequestId: 1,
        "odata.etag": "1"
    }, {
        Id: 2,
        Title: "Less Super Important Note",
        Text: "This is a less important note, everyone should still know about the ramifications of this note.",
        Modified: moment().subtract(1, 'day'),
        Author: new Person({
            Id: 1,
            Title: "Default User",
            EMail: "me@example.com"
        }),
        RequestId: 1,
        "odata.etag": "1"
    }, {
        Id: 3,
        Title: "Not Important Note",
        Text: "No one cares about this note.",
        Modified: moment().subtract(2, 'day'),
        Author: new Person({
            Id: 1,
            Title: "Default User",
            EMail: "me@example.com"
        }),
        RequestId: 1,
        "odata.etag": "1"
    }];

    maxId: number = 3;

    async fetchNotesByRequestId(requestId: number): Promise<INote[]> {
        await this.sleep();
        return this.notesList.filter(note => note.RequestId === requestId);
    }

    async fetchAllNotes(requestIds: number[]): Promise<INote[]> {
        await this.sleep();
        return [...this.notesList];
    }

    async submitNewNote(newNote: ISubmitNote): Promise<INote> {
        await this.sleep();
        let note = {
            Id: ++this.maxId,
            Modified: moment(),
            Author: await this.userApi.getCurrentUser(),
            ...newNote,
            "odata.etag": "1"
        }
        this.notesList.unshift(note);
        return note;
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