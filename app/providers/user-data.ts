import {Injectable} from "angular2/core";
import {Storage, LocalStorage, Events} from "ionic-angular";
import {Http} from "angular2/http";
import "rxjs/add/operator/map";
// import {FbProvider} from '../providers/fb-provider';

@Injectable()
export class UserData {

    constructor(private events:Events, private http:Http) {
    }

    _favorites = [];
    storage = new Storage(LocalStorage);
    HAS_LOGGED_IN = 'hasLoggedIn';

    url = null;
    paceUser = null;

    getUser(userID) {
        console.log("UserData: getUser() reached...", "UserID:", userID);

        return new Promise(resolve => {
            this.getPaceUser(userID).then((paceUser) => {
                console.log("Got PaceUser...");
                resolve(paceUser);
            });
        });
    }

    getPaceUser(userID) {
        console.log("UserData: getPaceUser() reached...");

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
                console.log("Error occurred while fetching user data... probably need to enable correct cors mapping");
                console.log(JSON.stringify(error.json()));
            }, () => console.log('User data fetching complete!'));
        });
    }

    saveNewPaceUser(userProfile, status, accessToken) {
        return new Promise((resolve, reject) => {
            this.url = 'http://localhost:8080/api/user';
            console.log(JSON.stringify(userProfile));
            console.log("Making request to: " + this.url);

            this.paceUser = JSON.stringify({
                facebookId: userProfile.id,
                name: userProfile.name,
                authResponse: status,
                accessToken: accessToken,
                picture: "http://graph.facebook.com/" + userProfile.id + "/picture?type=large"
            });

            this.http.post(this.url, this.paceUser).subscribe(paceUser => {
                console.log("Created user from BackPace...");
                console.log(JSON.stringify(paceUser.json()));
                resolve(paceUser)
            }, error => {
                console.log("Error... is backend running? probably need to enable cors mapping?");
                console.log(JSON.stringify(error.json()));
                reject();
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

    login() {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.events.publish('user:login');
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
