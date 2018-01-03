import Store = require('electron-store');
import { Server } from './Server';
import { OAUTHTOKEN, CLIENT_ID, CLIENT_SECRET, LOCAL_SERVER } from './Credentials';
import { post } from 'request';
const configStore = new Store({name: `config`});

interface OAuthAccessHeader {
    code?: string
    refresh_token?: string
    redirect_uri?: string
    client_id: string
    client_secret: string
    grant_type: 'authorization_code' | 'refresh_token'
}

export class GoogleApi {
    private _loginCode;
    private _accessToken;
    private _refreshToken;

    public get accessToken(): string {
        return this._accessToken;
    }


    async requestAutentication() {

        try {
            let formData: OAuthAccessHeader = {
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'grant_type': 'refresh_token',
                'refresh_token': configStore.get('refresh_token')
            };


            if (this._hasRefreshToken() === false) {
                await this._waitForAuthCode()

                formData = {
                    'code': this._loginCode,
                    'client_id': CLIENT_ID,
                    'client_secret': CLIENT_SECRET,
                    'redirect_uri': LOCAL_SERVER,
                    'grant_type': 'authorization_code'
                };
            }

            return this._request(formData)
        
        } catch (error) {
            return Promise.reject(error);
        }

    }

    private _request(formData: OAuthAccessHeader) {
        return new Promise((resolve, rejected) => {
            post(OAUTHTOKEN, {
                headers: { 'Content-Type': `application/x-www-form-urlencoded` },
                form: formData
            }, (err, res) => {
                var json = JSON.parse(res.body);

                if (json.error) {
                    rejected(JSON.parse(res.body));
                }

                this._accessToken = json.access_token
                this._refreshToken = configStore.get('refresh_token')

                if (json.refresh_token !== undefined) {
                    configStore.set('refresh_token', json.refresh_token)
                    this._refreshToken = json.refresh_token
                }

                resolve(this._accessToken);
            });
        });

    }

    private _hasRefreshToken() {
        return configStore.has('refresh_token');
    }

    private _waitForAuthCode() {
        const serverObserver = new Server().listen();
        return new Promise((resolve, rejected) => {
            serverObserver.subscribe(response => {
                if (response.replace(`/?error=`, ``) == "access_denied") {
                    console.log('Error getting login code. Access denied. User must grant the permissions');
                    rejected('access_denied');
                }

                this._loginCode = response.replace(`/?code=`, ``);
                resolve();
            })
        });
    }
}