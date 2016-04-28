import {Page, Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {UserData} from '../providers/user-data';

@Injectable()
export class FbProvider {
    static get parameters() {
        return [[Platform], [UserData]];
    }

    constructor(platform, userData) {
        this.platform = platform;
        this.userData = userData;

        this.p = null;
    }

    // This method is executed when the user starts the app
    getFbLoginStatus() {
        console.log("Fb-provider: getFbLoginStatus() reached...");
        this.loginStatus = new Promise((resolve, reject) => {
            this.platform.ready().then(() => {
                if (this.platform.is('cordova')) {
                    console.log("Running on a device or simulator...");
                    facebookConnectPlugin.getLoginStatus((success) => {
                        console.log("getLoginStatus connetion...");
                        if (success.status === 'connected') {
                            // The user is logged in and has authenticated your app, and response.authResponse supplies
                            // the user's ID, a valid access token, a signed request, and the time the access token
                            // and signed request each expire
                            console.log('getLoginStatus', success.status);

                            this.userData.getUser(success.authResponse.userID).then((user) => {
                                console.log("Fb-provider: getUser(): ");
                                console.log(JSON.stringify(user.json()));
                                resolve(success);
                            });
                        }
                    }, (err) => {
                        console.log("Unsuccessful login status fetching from Facebook!");
                        reject(err);
                    });
                } else {
                    console.log("Please run me on a device!");
                    reject('Please run me on a device!');
                }
            });
        });
        return this.loginStatus;
    }

    login() {
        console.log("Fb-provider: login() reached...");
        this.p = new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                console.log("Connecting to facebookConnectPlugin...");
                facebookConnectPlugin.login(['email'], (success) => {
                    console.log("Successful connection to Facebook API!");
                    console.log(JSON.stringify(success));
                    resolve(success);
                }, (err) => {
                    console.log("Unsuccessful connection to Facebook API!");
                    console.log(JSON.stringify(err));
                    reject(err);
                });

            } else {
                console.log("Please run me on a device");
                reject('Please run me on a device');
            }
        });
        return this.p;
    }

    getCurrentUserProfile() {
        console.log("Fb-provider: getCurrentUserProfile() reached...");
        this.p = new Promise((resolve, reject) => {
            facebookConnectPlugin.api('me?fields=email,name', null,
                (profileData) => {
                    console.log(JSON.stringify(profileData));
                    resolve(profileData);
                }, (err) => {
                    console.log(JSON.stringify(err));
                    reject(err);
                });
        });
        return this.p;
    }
}
