import { randomBytes, createHash } from 'crypto';
import { join } from 'path'

const remote = require('electron').remote
let app: any = null
if (remote) {
    app = remote.app
} else {
    app = require('electron').app
}

export const BOOKS_FOLDER_URL = join(app.getPath("documents"), `GooglePlayBooks`);
export const PORT = 8000;
export const SCOPE = `https://www.googleapis.com/auth/books`;
export const CLIENT_ID = `309811375351-bdn7uctom5ukq2q947jfjru4nb294pfv.apps.googleusercontent.com`;
export const CLIENT_SECRET = '3aPH74bY6OQhaIxkHvcfrhiE';
export const CODE_CHALLENGE = generateCodeChallenge();
export const LOCAL_PORT = '8000'
export const LOCAL_SERVER = `http://localhost:${LOCAL_PORT}`;
export const API_KEY = 'api-5876034861387073532-617946';
export const OAUTHTOKEN = 'https://accounts.google.com/o/oauth2/token'
export const GOOGLE_OAUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${LOCAL_SERVER}&code_challenge${CODE_CHALLENGE}&access_type=offline`;

function generateCodeChallenge(): string {
    const verifier = randomBytes(32).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    const sha256 = createHash(`sha256`);
    const hashUpdated = sha256.update(verifier, 'utf8');

    return new Buffer(hashUpdated.digest('hex')).toString('base64');
}