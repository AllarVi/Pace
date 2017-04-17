import {Platform, Events} from "ionic-angular";
import {UserData} from "./user-data";
import {Injectable} from "@angular/core";

declare const facebookConnectPlugin: any;

@Injectable()
export class FbProvider {

    result: any;

    constructor(private events: Events, private platform: Platform, private userData: UserData) {
    }

    getFbLoginStatus() {
        console.log("Fb-provider: getFbLoginStatus() reached...");
        this.result = new Promise((resolve, reject) => {
            this.platform.ready().then(() => {
                if (this.platform.is('cordova')) {
                    facebookConnectPlugin.getLoginStatus((success: any) => {
                        if (success.status === 'connected') {
                            this.handleConnected(success, resolve);
                        } else if (success.status === 'not_authorized') {
                            this.handleNotAuthorized(success, resolve);
                        } else if (success.status === 'unknown') {
                            this.handleUnknown(success, resolve);
                        }
                    }, (err: any) => {
                        console.log("Unsuccessful login status fetching from Facebook!");
                        reject(err);
                    });
                } else {
                    console.log("Please run me on a device!");
                    reject('Please run me on a device!');
                }
            });
        });
        return this.result;
    }

    private handleUnknown(success: any, resolve) {
        console.log('Login Status: ', success.status);
        resolve(success);
    }

    private handleNotAuthorized(success: any, resolve) {
        console.log('Login Status: ', success.status);
        resolve(success);
    }

    private handleConnected(success: any, resolve) {
        console.log('Login Status: ', success.status);
        // Check if we have our user saved in the backend
        this.userData.getPaceUser(success.authResponse.userID).then(() => {
            this.userData.saveLoginStorage(true);
            resolve(success);
        });
    }

    login() {
        console.log("Fb-provider: login() reached...");
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                this.getFbLoginStatus().then((FbLoginStatus: any) => {
                    this.fbLoginStatusSuccess(FbLoginStatus, resolve, reject);
                });
            } else {
                reject('Please run me on a device');
            }
        });
    }

    fbLoginStatusSuccess(FbLoginStatus: any, resolve: any, reject: any) {
        console.log("PaceApp: User status:", FbLoginStatus.status);
        if (FbLoginStatus.status === 'connected') {
            console.log("We shouldn't get here...");
            resolve();
        } else {
            console.log("getFbLoginStatus", FbLoginStatus.status);

            facebookConnectPlugin.login(['email', 'public_profile'], (success: any) => {
                console.log("Login call successful!");
                this.fbLoginSuccess(success).then(() => {
                    console.log("Resolving after fbLoginSuccess...");
                    resolve();
                });
            }, (err: any) => {
                this.fbLoginError(err);
                reject(err);
            });
        }
    };

    fbLoginError(err: any) {
        console.log("Unsuccessful Facebook login!");
        console.log(JSON.stringify(err));
    };

    fbLoginSuccess(success: any) {
        return new Promise((resolve, reject) => {
            if (success.status === 'connected') {
                this.getCurrentUserProfile(success.authResponse.accessToken).then(
                    (profileData) => {
                        console.log("fbLoginSuccess: getCurrentUserProfile:");
                        console.log(JSON.stringify(profileData));

                        this.userData.saveNewPaceUser(profileData, success.status, success.authResponse.accessToken).then(() => {
                            console.log("Publishing login...");
                            this.events.publish('user:login');
                            resolve()
                        }, err => {
                            console.log(JSON.stringify(err));
                            reject()
                        });
                    }
                );
            }
        });
    }

    uri: any;
    // This method is to get the user profile info from the facebook api
    getCurrentUserProfile(authResponse: any) {
        console.log("Fb-provider: getCurrentUserProfile() reached...");
        this.uri = "me?fields=email,name&access_token=" + authResponse;
        console.log(this.uri);
        return new Promise((resolve, reject) => {
            facebookConnectPlugin.api(this.uri, null,
                (profileData: any) => {
                    console.log(JSON.stringify(profileData));
                    console.log("Resolving...");
                    resolve(profileData);
                }, (err: any) => {
                    reject(err);
                }).then();
        });
    }
}
