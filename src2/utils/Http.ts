import { IncomingMessage } from "http";
import * as request from "request";
import { HttpError } from "./HttpError";

export class Http implements IHttp {
    public async getFile(url: string): Promise<IStreamEvent> {
        try {
            return await request.get(url);
        } catch (error) {
            throw new HttpError(error);
        }
    }

    public get(url: string) {
        return new Promise((resolve, rejected) => {
            request(url, (error, response, body) => {
                if (error) {
                    rejected(new HttpError(error));
                }
                resolve(body);
            });
        });
    }
}

export interface IHttp {
    getFile( url: string): Promise<IStreamEvent>;
    get(url: string): Promise<any>;
}

export interface IDonwloadProgress {
    size: number;
    soFar: number;
}

interface IStreamEvent {
    on(event: "response", fn: (message: IncomingMessage) => void): this;
    on(event: "data", fn: (buffer: Buffer) => void): this;
    on(event: "error", fn: (err: Error) => void): this;
    on(event: "complete", fn: () => void): this;
}
