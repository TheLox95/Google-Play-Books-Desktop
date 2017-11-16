import * as isOnline from 'is-online'

export class ConnectionManager{

    static thereIsInternetConnection(){
        return isOnline();
    }
}