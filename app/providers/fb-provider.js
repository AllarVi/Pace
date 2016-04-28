import {Page, Platform, Events} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {UserData} from '../providers/user-data';

@Injectable()
export class FbProvider {
    static get parameters() {
        return [[Events], [Platform], [UserData]];
    }

    constructor(events, platform, userData) {
        this.platform = platform;
        this.userData = userData;
        this.events = events;

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
                            console.log('getLoginStatus', success.status);

                            this.events.publish('user:login');

                            this.userData.getUser(success.authResponse.userID).then((user) => {
                                console.log("Fb-provider: getUser(): ");
                                console.log(JSON.stringify(user.json()));
                                resolve(success);
                            });
                        } else if (success.status === 'not_authorized') {
                            console.log('getLoginStatus', success.status);
                        } else if (success.status === 'unknown') {
                            console.log('getLoginStatus', success.status);
                        }
                        resolve(success);
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
                    if (success.status === 'connected') {
                        this.events.publish('user:login');
                        console.log("Successful connection to Facebook API!");
                        console.log(JSON.stringify(success));
                    }
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
