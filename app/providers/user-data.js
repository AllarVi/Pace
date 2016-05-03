import {Injectable} from 'angular2/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import {Http} from 'angular2/http';
// import {FbProvider} from '../providers/fb-provider';
import 'rxjs/add/operator/map';

@Injectable()
export class UserData {
    static get parameters() {
        return [[Events], [Http]];
    }

    constructor(events, http) {
        this._favorites = [];
        this.storage = new Storage(LocalStorage);
        this.events = events;
        this.HAS_LOGGED_IN = 'hasLoggedIn';

        this.http = http;
    }

    getUser(userID) {
        console.log("UserData: getUser() reached...", "UserID:", userID);

        return new Promise(resolve => {
            this.getPaceUser(userID).then((paceUser) => {
                resolve(paceUser);
            });
        });
    }

    getPaceUser(userID) {
        console.log("UserData: getPaceUser() reached...");
        // if (this.paceUser) {
        //     console.log("User already loaded");
        //     console.log(JSON.stringify(this.paceUser.json()));
        //     return Promise.resolve(this.paceUser);
        // }

        // Don't have the data yet
        return new Promise(resolve => {
            this.url = 'http://localhost:8080/api/user?facebookId=' + userID;
            console.log("Making request to: " + this.url);
            console.log("Fetching user data from BackPace...");
            this.http.get(this.url).subscribe(paceUser => {
                console.log("User data from BackPace...");
                console.log(JSON.stringify(paceUser.json()));
                resolve(paceUser)
            }, error => {
                console.log("Error occurred while fetching user data...");
                console.log(JSON.stringify(error.json()));
            }, () => console.log('User data fetching complete!'));
        });
    }

    hasFavorite(sessionName) {
        return (this._favorites.indexOf(sessionName) > -1);
    }

    addFavorite(sessionName) {
        this._favorites.push(sessionName);
    }

    removeFavorite(sessionName) {
        let index = this._favorites.indexOf(sessionName);
        if (index > -1) {
            this._favorites.splice(index, 1);
        }
    }

    login(username, password) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.events.publish('user:login');
    }

    signup(username, password) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.events.publish('user:signup');
    }

    FbLogout() {
        return new Promise((resolve, reject) => {
            this.storage.remove(this.HAS_LOGGED_IN);
            console.log("UserData: logout() reached...");

            facebookConnectPlugin.logout(() => {
                console.log("Logging out...");

                this.events.publish('user:logout');

                resolve();
            }, (err) => {
                console.log("Unsuccessful logout from Facebook!");
                console.error(JSON.stringify(err.json()));

                reject();
            });
        });
    }

    // Return a promise
    hasLoggedIn() {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            return value;
        });
    }
}
