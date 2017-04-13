import {Injectable} from "angular2/core";
import {Storage, LocalStorage, Events} from "ionic-angular";
import {Http, Headers} from "angular2/http";
import "rxjs/add/operator/map";

@Injectable()
export class UserData {

    // BASE_URL = 'localhost';

    // TTU
    // BASE_URL = '10.224.4.183';

    // Viinamae
    BASE_URL = '192.168.0.101';

    constructor(private events: Events, private http: Http) {
    }

    _favorites = [];
    storage = new Storage(LocalStorage);
    HAS_LOGGED_IN = 'hasLoggedIn';

    url = null;
    paceUser = null;

    userId = null;
    userToken = null;

    shortTeamView = null;

    teams = null;

    getUser(userID) {
        console.log("UserID to make request with:", userID);

        return new Promise(resolve => {
            this.getPaceUser(userID).then((paceUser) => {
                resolve(paceUser);
            });
        });
    }

    getPaceUser(userID) {
        console.log("UserData:getPaceUser()");
        return new Promise(resolve => {
            // TODO: Uncomment for backend request
            // let url = this.constructGetPaceUserUrl(userID);
            // let paceUser = this.extractPaceUser(this.makeGetHttpReq(url));
            let paceUser = this.extractPaceUser(this.mockGetPaceUser());
            resolve(paceUser)
        });
    }

    getUserShortTeamView() {
        console.log("UserData:getUserShortTeamView()");
        return new Promise(resolve => {
            // TODO: Uncomment for backend request
            // let url = this.constructGetUserShortTeamViewUrl();
            // let userShortTeamView = this.extractUserShortTeamView(this.makeGetHttpReq(url));
            let userShortTeamView = this.extractUserShortTeamView(this.mockUserShortTeamView());
            resolve(userShortTeamView)
        });
    }

    private extractUserShortTeamView(shortTeamView) {
        // TODO: maybe add shortTeamView.json() for backend
        this.shortTeamView = shortTeamView;

        return shortTeamView;
    }

    private extractPaceUser(paceUser) {
        console.log("User data from BackPace...", JSON.stringify(paceUser.json()));
        this.paceUser = paceUser.json();
        this.userId = this.paceUser.facebookId;
        this.userToken = this.paceUser.accessToken;

        return paceUser;
    }

    private constructGetPaceUserUrl(userID) {
        let url = 'http://' + this.BASE_URL + ':8080/api/user?facebookId=' + userID;
        console.log("Making request to: " + url);
        return url;
    }

    private constructGetUserShortTeamViewUrl() {
        let url = 'http://' + this.BASE_URL + ':8080/api/dashboard?facebookId=' + this.userId + '&teamView=short&token=' + this.userToken;
        console.log("Making request to: " + url);
        return url;
    }

    private makeGetHttpReq(url) {
        this.http.get(url).subscribe(result => {
            return result;
        }, error => {
            this.handleGetHttpReqError(error);
        }, () => this.handleGetHttpReqFinally());
    }

    private handleGetHttpReqFinally() {
        console.log('User data fetching complete!');
    }

    private handleGetHttpReqError(error) {
        console.log("Error occurred while fetching user data... probably need to enable correct cors mapping");
        console.log(JSON.stringify(error.json()));
    }

    getTeamData(teamId) {
        return new Promise(resolve => {
            this.url = 'http://' + this.BASE_URL + ':8080/api/team?facebookId=' + this.userId + '&token=' + this.userToken + '&teamId=' + teamId;
            console.log("Making request to: " + this.url);
            this.http.get(this.url).subscribe(teamMembers => {
                resolve(teamMembers.json())
            }, error => {
                console.log("Error occurred while fetching user data... probably need to enable correct cors mapping");
                console.log(JSON.stringify(error.json()));
            });
        });
    }

    getPaceUserData() {
        return this.paceUser;
    }

    getPaceUserPicture() {
        return new Promise((resolve, reject) => {
            this.url = this.paceUser.picture + '&redirect=false';
            console.log("Making request to", this.url);
            this.http.get(this.url).subscribe(success => {
                console.log("Success!");
                resolve(success);
            }, error => {
                console.log("Error!");
                reject(error);
            });
        });
    }

    getGroups() {
        return new Promise((resolve, reject) => {
            this.url = 'http://' + this.BASE_URL + ':8080/api/dashboard/join_group'
                + '?facebookId=' + this.userId
                + '&token=' + this.userToken
                + '&groups=all';
            console.log("Making request to: " + this.url);
            this.http.get(this.url).subscribe(teams => {
                this.teams = teams.json();
                resolve(this.teams);
            }, error => {
                console.log("Error occurred in getGroups()");
                reject(error);
            });
        });
    }

    groupData = null;

    joinTeam(teamId) {
        return new Promise((resolve, reject) => {
            this.url = 'http://' + this.BASE_URL + ':8080/api/dashboard/join_group?facebookId=' + this.userId + '&token=' +
                this.userToken;
            console.log("Making request to: " + this.url);

            this.groupData = JSON.stringify({
                teamId: teamId
            });

            this.http.post(this.url, this.groupData).subscribe(success => {
                console.log("Joined team...");
                resolve(success);
            }, () => {
                console.log("Error... is backend running? probably need to enable cors mapping?");
                reject();
            }, () => console.log('Joining team complete!'));
        });
    }

    markAttendance(teamId, attendance, date) {
        return new Promise((resolve, reject) => {
            this.url = 'http://' + this.BASE_URL + ':8080/api/team?facebookId=' + this.userId + '&token=' +
                this.userToken + '&teamId=' + teamId + '&attendance=' + attendance + '&date=' + date;
            console.log("Making request to: " + this.url);

            this.groupData = JSON.stringify({});

            this.http.post(this.url, this.groupData).subscribe(success => {
                console.log("Attendance marked...");
                resolve(success);
            }, () => {
                console.log("Error... is backend running? probably need to enable cors mapping?");
                reject();
            }, () => console.log('Marking attendance complete!'));
        });
    }

    getAllAchievements() {
        return new Promise((resolve, reject) => {
            this.url = 'http://' + this.BASE_URL + ':8080/api/profile/goal'
                + '?facebookId=' + this.userId
                + '&token=' + this.userToken;
            console.log("Making request to: " + this.url);
            this.http.get(this.url).subscribe(goals => {
                resolve(goals.json());
            }, error => {
                console.log("Error occurred in getAllAchievements()");
                reject(error);
            });
        });
    }

    uploadAchievement(fileName, image) {
        return new Promise((resolve, reject) => {
            this.url = 'http://' + this.BASE_URL + ':8080/api/fileUpload' +
                '?name=' + fileName +
                '&file=' + image;


            console.log("Making request to: " + this.url);

            var params = JSON.stringify({
                headers: {'Content-Type': undefined}
            });

            this.http.post(this.url, params).subscribe(success => {
                console.log("File upload request complete...");
                resolve(success);
            }, () => {
                console.log("Error... is backend running? probably need to enable cors mapping?");
                reject();
            }, () => console.log('File upload complete!'));
        });
    }

    saveNewPaceUser(userProfile, status, accessToken) {
        return new Promise((resolve, reject) => {
            this.url = 'http://' + this.BASE_URL + ':8080/api/user';
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
                this.extractPaceUser(paceUser);
                resolve(paceUser)
            }, error => {
                console.log("Error... is backend running? probably need to enable cors mapping?");
                console.log(JSON.stringify(error.json()));
                reject();
            }, () => console.log('User data fetching complete!'));
        });
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

    private mockUserShortTeamView() {
        let teamKoss = {
            teamName: "Kossurühm",
            shortTableRowList: [{
                rank: 1,
                userName: "Marin",
                tier: "...",
                points: 1270
            }]
        };

        let teamSalto = {
            teamName: "Saltopoisid",
            shortTableRowList: [{
                rank: 1,
                userName: "Allar",
                tier: "...",
                points: 1000
            }]
        };
        let mockUserShortTeamView = [];
        mockUserShortTeamView.push(teamKoss, teamSalto);
        return mockUserShortTeamView;
    }

    private mockGetPaceUser() {
        return {
            paceUser: {
                facebookId: "",
                accessToken: ""
            }
        };
    }
}
