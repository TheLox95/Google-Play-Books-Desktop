export class HttpError extends Error {

    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, HttpError.prototype);
    }

}
