import {} from "jest";
import "rxjs/add/observable/of";
import { Observable } from "rxjs/Observable";
import { IServer, LoginService } from "../src2/services";

describe("login", () => {
    const fakeServer = {
        listen: () => {
            return Observable.of(`5555`);
        },
    } as IServer;

    const badFakeServer = {
        listen: () => {
            return new Observable((subject) => {
                setInterval(() => {
                    subject.next(new Error(`user not granted permission`));
                }, 1000);
            });
        },
    } as IServer;

    it("should return a google loging url address", () => {
        const loging = new LoginService(fakeServer);
        const url = loging.getLoginUrl();
        expect(url).toBeDefined();
    });

    it("should return token from google login callback", (done) => {
        const loging = new LoginService(fakeServer);
        const observer = loging.listenLoginCallbackCode();
        observer.subscribe((googleResponse) => {
            expect(googleResponse).toBe(`5555`);
            done();
        });
    });

    it("should return error object when a error is returned", (done) => {
        const loging = new LoginService(badFakeServer);
        const observer = loging.listenLoginCallbackCode();
        let errAmmo = 0;
        observer.subscribe((googleResponse) => {
            errAmmo++;
            if (errAmmo === 3) {
                expect(googleResponse instanceof Error).toBe(true);
                done();
            }
        });
    });
});
