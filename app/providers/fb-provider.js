import {Page, Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';

@Injectable()
export class FbProvider {
    static get parameters(){
        return [Platform];
    }
    
    constructor( platform ) {
        this.platform = platform;
    }

    login() {
        console.log("Fb-provider reached");
        p = new Promise((resolve, reject) => {
            if(this.platform.is('cordova')) {
                facebookConnectPlugin.login([ 'email' ], (success) => {
                    console.log(JSON.stringify(success));
                    resolve(success);
                },(err) => {
                    console.log(JSON.stringify(err));
                    reject(err);
                });

            } else {
                console.log("Please run me on a device");
                reject('Please run me on a device');
            }
        });
        return p;
    }

    getCurrentUserProfile() {
        p = new Promise((resolve, reject) => {
            facebookConnectPlugin.api('me?fields=email,name', null,
                (profileData) => {
                    console.log(JSON.stringify(profileData));
                    resolve(profileData);
                },(err) => {
                    console.log(JSON.stringify(err));
                    reject(err);
                });
        });
        return p;
    }
}
