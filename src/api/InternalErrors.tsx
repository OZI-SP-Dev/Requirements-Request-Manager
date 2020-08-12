
export class InternalError implements Error {
    name: string = "InternalError";
    message: string;
    stack?: string | undefined;

    constructor(e?: Error, message?: string) {
        if (e) {
            this.message = message ? message : e.message;
            this.stack = e.stack;
        } else if (message) {
            this.message = message;
        } else {
            this.message = "An unknown error occurred internally!";
        }
    }
}

export class ApiError extends InternalError {
    name: string = "ApiError";

    constructor(e?: Error, message?: string) {
        super(e, message ? message : e ? e.message : "An unknown error occurred while communicating with SharePoint!");
    }
}

export class NotAuthorizedError extends InternalError {
    name: string = "NotAuthorizedError";

    constructor(e?: Error, message?: string) {
        super(e, message ? message : e ? e.message : "You are not authorized to do this!");
    }
}