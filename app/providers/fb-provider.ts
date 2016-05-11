import {Page, Platform, Events} from "ionic-angular";
import {Injectable} from "angular2/core";
import {UserData} from "../providers/user-data";

@Injectable()
export class FbProvider {

  result = null;

  constructor(private events:Events, private platform:Platform, private userData:UserData) {
  }

  // This method is executed when the user starts the app
  getFbLoginStatus() {
    console.log("Fb-provider: getFbLoginStatus() reached...");
    this.result = new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        if (this.platform.is('cordova')) {
          facebookConnectPlugin.getLoginStatus((success) => {
            console.log("getLoginStatus connetion...");
            if (success.status === 'connected') {
              console.log('getLoginStatus', success.status);

              this.events.publish('user:login');

              // Check if we have our user saved
              this.userData.getUser(success.authResponse.userID).then(() => {
                console.log("Fb-provider: getUser(): ");
                resolve(success);
              });
            } else if (success.status === 'not_authorized') {
              console.log('getLoginStatus', success.status);
              resolve(success);
            } else if (success.status === 'unknown') {
              console.log('getLoginStatus', success.status);
              resolve(success);
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
    return this.result;
  }

  login() {
    console.log("Fb-provider: login() reached...");
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.getFbLoginStatus().then((FbLoginStatus) => {
          this.fbLoginStatusSuccess(FbLoginStatus, resolve, reject);
        });
      } else {
        reject('Please run me on a device');
      }
    });
  }

  fbLoginStatusSuccess(FbLoginStatus, resolve, reject) {
    console.log("PaceApp: User status:", FbLoginStatus.status);
    if (FbLoginStatus.status === 'connected') {
      console.log("We shouldn't get here...");
    } else {
      console.log("getFbLoginStatus", FbLoginStatus.status);

      facebookConnectPlugin.login(['email', 'public_profile'], (success) => {
        console.log("Login call successful!");
        this.fbLoginSuccess(success).then(() => {
          console.log("Resolving after fbLoginSuccess...");
          resolve();
        });
      }, (err) => {
        this.fbLoginError(err);
        reject(err);
      });
    }
  };

  fbLoginError(err) {
    console.log("Unsuccessful Facebook login!");
    console.log(JSON.stringify(err));
  };

  fbLoginSuccess(success) {
    return new Promise((resolve, reject) => {
      if (success.status === 'connected') {
        this.getCurrentUserProfile(success.authResponse.accessToken).then(
          (profileData) => {
            console.log("fbLoginSuccess: getCurrentUserProfile:");
            console.log(JSON.stringify(profileData));

            this.userData.saveNewPaceUser(profileData, success.status).then(() => {
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

  uri = null;
  // This method is to get the user profile info from the facebook api
  getCurrentUserProfile(authResponse) {
    console.log("Fb-provider: getCurrentUserProfile() reached...");
    this.uri = "me?fields=email,name&access_token=" + authResponse;
    console.log(this.uri);
    return new Promise((resolve, reject) => {
      facebookConnectPlugin.api(this.uri, null,
        (profileData) => {
          console.log(JSON.stringify(profileData));
          console.log("Resolving...");
          resolve(profileData);
        }, (err) => {
          reject(err);
        });
    });
  }
}
