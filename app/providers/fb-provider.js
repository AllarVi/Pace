import {Page, Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';

@Injectable()
export class FbProvider {
    static get parameters() {
        return [Platform];
    }

    constructor(platform) {
        this.platform = platform;

        this.loginStatus = this.getFbLoginStatus().then(() => {
            console.log("Login status...");
        });

        this.p = null;
    }

    getFbLoginStatus() {
        console.log("Fb-provider: getFbLoginStatus() reached...");
        this.loginStatus = new Promise((resolve, reject) => {
            console.log("Making new Promise...");
            if (this.platform.is('cordova')) {
                console.log("Running on a device or simulator...");
                facebookConnectPlugin.getLoginStatus((success) => {
                    console.log("getLoginStatus connetion...");
                    console.log(success.status);
                    if (success.status === 'connected') {
                        // The user is logged in and has authenticated your app, and response.authResponse supplies
                        // the user's ID, a valid access token, a signed request, and the time the access token
                        // and signed request each expire
                        console.log('getLoginStatus', success.status);
                        resolve(success);

                        // // Check if we have our user saved
                        // var user = UserService.getUser('facebook');
                        //
                        // if (!user.userID) {
                        //     getFacebookProfileInfo(success.authResponse)
                        //         .then(function (profileInfo) {
                        //             // For the purpose of this example I will store user data on local storage
                        //             UserService.setUser({
                        //                 authResponse: success.authResponse,
                        //                 userID: profileInfo.id,
                        //                 name: profileInfo.name,
                        //                 email: profileInfo.email,
                        //                 picture: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                        //             });
                        //
                        //             $state.go('app.home');
                        //         }, function (fail) {
                        //             // Fail get profile info
                        //             console.log('profile info fail', fail);
                        //         });
                        // } else {
                        //     $state.go('app.home');
                        // }
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
