import {Injectable} from "angular2/core";
import {Storage, LocalStorage, Events} from "ionic-angular";
import {Http} from "angular2/http";
import "rxjs/add/operator/map";

@Injectable()
export class UserData {

    constructor(private events:Events, private http:Http) {
    }

    _favorites = [];
    storage = new Storage(LocalStorage);
    HAS_LOGGED_IN = 'hasLoggedIn';

    url = null;
    paceUser = null;

    userId = null;
    userToken = null;

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

                this.extracted(paceUser);
                resolve(paceUser)
            }, error => {
                console.log("Error occurred while fetching user data... probably need to enable correct cors mapping");
                console.log(JSON.stringify(error.json()));
            }, () => console.log('User data fetching complete!'));
        });
    }

    shortTeamView = null;

    getUserShortTeamView() {
        console.log("UserData: getUserShortTeamView() reached...");

        return new Promise((resolve, reject) => {
            // this.userId = '1273703759309879';
            // this.userToken = 'EAAD08lC2fhMBAJndhmi8SZCDoFrZAPKBjVZAjYdOjdx9n39StxZAtBtuLKUVEzq6HHTVHZC3B6ZCGymj2iQbLj4PIPNsbkgA7mZAxoFKejCFIuegh6da8keBarMj5yMFCQsS7EiqeZB4oY2nycUl4ZAhx6iGZAPCCNevhdDWhTM5uK0FJspaSNSm8sEeDODaM01SAZD';
            this.url = 'http://localhost:8080/api/dashboard?facebookId=' + this.userId + '&teamView=short&token=' + this.userToken;
            console.log("Making request to: " + this.url);
            console.log("Fetching short team views from BackPace...");
            this.http.get(this.url).subscribe(shortTeamView => {
                console.log("ShortTeamView from BackPace...");
                this.shortTeamView = shortTeamView.json();
                resolve(this.shortTeamView);
            }, error => {
                console.log("Error occurred in getUserShortTeamView()");
                reject(error);
            });
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
                this.extracted(paceUser);
                resolve(paceUser)
            }, error => {
                console.log("Error... is backend running? probably need to enable cors mapping?");
                console.log(JSON.stringify(error.json()));
                reject();
            }, () => console.log('User data fetching complete!'));
        });
    }

    private extracted(paceUser) {
        this.paceUser = paceUser.json();
        this.userId = this.paceUser.facebookId;
        this.userToken = this.paceUser.accessToken;
    };

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
