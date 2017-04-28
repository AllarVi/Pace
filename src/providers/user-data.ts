import {Events} from "ionic-angular";
import {Http} from "@angular/http";
import {Storage} from '@ionic/storage';
import {Injectable} from "@angular/core";

declare const facebookConnectPlugin: any;

@Injectable()
export class UserData {

    BASE_URL = 'localhost:8181';

    // When on USB and hotspot connection
    // BASE_URL = '172.20.10.5:8181';

    constructor(private events: Events,
                private http: Http,
                private storage: Storage) {
    }

    _favorites: Array<any> = [];
    HAS_LOGGED_IN = 'hasLoggedIn';
    PACE_USER = 'paceUser';

    url: any;
    paceUser: any;

    userId: any;
    userToken: any;

    shortTeamView: any;
    teamData: any;

    getPaceUser(userID: any, accessToken: any) {
        console.log("UserID to make request with:", userID);
        return new Promise(resolve => {
            let url = this.constructGetPaceUserUrl(userID, accessToken);
            this.makeGetHttpReq(url).then(result => {
                let paceUser = this.extractPaceUser(this.formatToJSON(result));
                resolve(paceUser)
            });
        });
    }

    getUserShortTeamView() {
        return new Promise(resolve => {
            this.storage.get(this.PACE_USER).then(paceUser => {
                let url = this.constructGetUserShortTeamViewUrl(paceUser);
                this.makeGetHttpReq(url).then(result => {
                    let userTeamView = this.extractUserShortTeamView(this.formatToJSON(result));
                    resolve(userTeamView)
                })
            });
        });
    }

    getTeamData(teamId: any) {
        return new Promise(resolve => {
            this.storage.get(this.PACE_USER).then(paceUser => {
                let url = this.constructGetTeamDataUrl(paceUser, teamId);
                this.makeGetHttpReq(url).then(result => {
                    let teamData = this.extractTeamData(this.formatToJSON(result));
                    resolve(teamData)
                })
            });
        });
    }

    markAttendance(member: any, teamId: any, attendance: any, date: any) {
        return new Promise(resolve => {
            this.storage.get(this.PACE_USER).then(paceUser => {
                let url = this.constructMarkAttendanceUrl(paceUser, teamId, attendance);

                let markAttendanceData = {
                    day: date.day,
                    month: date.month,
                    year: date.year,
                    member: member.userName,
                    facebookId: member.facebookId
                };

                this.makePostHttpReq(url, markAttendanceData).then(result => {
                    let currentMonthAttendance = this.extractCurrentMonthAttendance(this.formatToJSON(result));
                    resolve(currentMonthAttendance)
                })
            });
        });
    }

    getGroups() {
        return new Promise(resolve => {
            this.storage.get(this.PACE_USER).then(paceUser => {
                let url = this.constructGetGroupsUrl(paceUser);

                this.makeGetHttpReq(url).then(result => {
                    let groups = this.extractGroups(this.formatToJSON(result));
                    resolve(groups)
                })
            });
        });
    }

    joinGroup(teamId: any) {
        return new Promise(resolve => {
            this.storage.get(this.PACE_USER).then(paceUser => {
                let url = this.constructJoinGroupUrl(paceUser);

                let groupData = JSON.stringify({
                    teamId: teamId
                });

                this.makePostHttpReq(url, groupData).then(result => {
                    let resultJSON = this.formatToJSON(result);
                    resolve(resultJSON)
                })
            });
        });
    }

    getPaceUserPicture(facebookId: any) {
        return new Promise(resolve => {
            let url = this.constructGetPaceUserPictureUrl(facebookId);

            this.makeGetHttpReq(url).then((result: any) => {
                let paceUserPicture = JSON.parse(result._body);
                resolve(paceUserPicture)
            })
        });
    }

    private extractUserShortTeamView(teamView: any) {
        this.shortTeamView = teamView;

        return teamView;
    }

    private extractTeamData(teamData: any) {
        console.log("teamData from BackPace ", teamData);
        this.teamData = teamData;

        return teamData;
    }

    private extractPaceUser(paceUser: any) {
        // console.log("paceUser from BackPace ", paceUser);
        this.paceUser = paceUser;
        this.userId = paceUser.facebookId;
        this.userToken = paceUser.accessToken;

        this.storage.set(this.PACE_USER, paceUser);
        return paceUser;
    }

    private extractCurrentMonthAttendance(result: any) {
        return result.currentMonthAttendance;
    }

    private extractGroups(result: any) {
        return result;
    }

    private constructGetPaceUserUrl(userID: any, accessToken: any) {
        let url = 'http://' + this.BASE_URL + '/api/user?facebookId=' + userID + '&token=' + accessToken;
        console.log("Making GET request to: " + url);
        return url;
    }

    private constructGetUserShortTeamViewUrl(paceUser: any) {
        let url = 'http://' + this.BASE_URL + '/api/dashboard?facebookId='
            + paceUser.facebookId + '&teamView=short&token=' + paceUser.accessToken;
        console.log("Making GET request to: " + url);
        return url;
    }

    private constructGetTeamDataUrl(paceUser: any, teamId: any) {
        let url = 'http://' + this.BASE_URL + '/api/team?facebookId=' + paceUser.facebookId
            + '&token=' + paceUser.accessToken + '&teamId=' + teamId;
        console.log("Making GET request to: " + url);
        return url;
    }

    private constructMarkAttendanceUrl(paceUser: any, teamId: any, attendance: any) {
        let url = 'http://' + this.BASE_URL + '/api/team?facebookId=' + paceUser.facebookId
            + '&token=' + paceUser.accessToken + '&teamId=' + teamId + '&attendance=' + attendance;
        console.log("Making POST request to: " + url);
        return url;
    }

    private constructGetGroupsUrl(paceUser: any) {
        let url = 'http://' + this.BASE_URL + '/api/dashboard/join_group'
            + '?facebookId=' + paceUser.facebookId
            + '&token=' + paceUser.accessToken
            + '&groups=all';
        console.log("Making GET request to: ", url);
        return url;
    }

    private constructJoinGroupUrl(paceUser: any) {
        let url = 'http://' + this.BASE_URL + '/api/dashboard/join_group?facebookId=' +
            paceUser.facebookId + '&token=' +
            paceUser.accessToken;
        console.log("Making POST request to: " + url);
        return url;
    }

    private constructGetPaceUserPictureUrl(facebookId: any) {
        let url = "http://graph.facebook.com/" + facebookId + "/picture?type=large" + '&redirect=false';
        console.log("Making GET request to: ", url);
        return url;
    }

    private makeGetHttpReq(url: any) {
        return new Promise(resolve => {
            this.http.get(url).subscribe(result => {
                resolve(result);
            }, error => {
                this.handleGetHttpReqError(error);
            }, () => this.handleGetHttpReqFinally());
        });
    }

    private makePostHttpReq(url: any, data: any) {
        return new Promise(resolve => {
            this.http.post(url, data).subscribe(result => {
                resolve(result);
            }, error => {
                this.handlePostHttpReqError(error);
            }, () => this.handlePostHttpReqFinally());
        });
    }

    private handleGetHttpReqFinally() {
        console.log('GET Http request complete!');
    }

    private handlePostHttpReqFinally() {
        console.log('POST Http request complete!');
    }

    private handleGetHttpReqError(error: any) {
        console.log("Error occurred while GET... probably need to enable correct cors mapping");
        console.log(JSON.stringify(error.json()));
    }

    private handlePostHttpReqError(error: any) {
        console.log("Error occurred while POST... probably need to enable correct cors mapping");
        console.log(JSON.stringify(error.json()));
    }

    getPaceUserFromStorage() {
        return new Promise(resolve => {
            this.storage.get(this.PACE_USER).then((paceUser: any) => {
                resolve(paceUser);
            })
        })
    }

    saveNewPaceUser(userProfile: any, status: any, accessToken: any) {
        return new Promise((resolve, reject) => {
            console.log("Saving new Pace user");
            // this.url = 'http://' + this.BASE_URL + ':8080/api/user';

            this.paceUser = JSON.stringify({
                facebookId: userProfile.id,
                name: userProfile.name,
                authResponse: status,
                accessToken: accessToken,
                picture: "http://graph.facebook.com/" + userProfile.id + "/picture?type=large"
            });

            // this.http.post(this.url, this.paceUser).subscribe(paceUser => {
            //     this.extractPaceUser(paceUser);
            //     resolve(paceUser)
            // }, error => {
            //     console.log("Error... is backend running? probably need to enable cors mapping?");
            //     console.log(JSON.stringify(error.json()));
            //     reject();
            // }, () => console.log('User data fetching complete!'));

            let paceUser = this.extractPaceUser(this.mockGetPaceUser());
            resolve(paceUser);
        });
    }

    removeFavorite(sessionName: any) {
        let index = this._favorites.indexOf(sessionName);
        if (index > -1) {
            this._favorites.splice(index, 1);
        }
    }

    saveLoginStorage(hasLoggedIn: boolean) {
        this.storage.set(this.HAS_LOGGED_IN, hasLoggedIn);
    }

    FbLogout() {
        return new Promise((resolve, reject) => {
            this.storage.remove(this.HAS_LOGGED_IN);
            console.log("UserData: logout() reached...");

            facebookConnectPlugin.logout(() => {
                console.log("Logging out...");

                this.events.publish('user:logout');

                resolve();
            }, (err: any) => {
                console.log("Unsuccessful logout from Facebook!");
                console.error(JSON.stringify(err.json()));

                reject();
            });
        });
    }

    hasLoggedIn(): Promise<boolean> {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            return value === true;
        });
    };

    private formatToJSON(result: any) {
        return result.json();
    }

    private mockGetPaceUser() {
        return {
            facebookId: "",
            accessToken: ""
        };
    }

}
