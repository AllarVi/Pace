import {IonicApp, Page, NavController, Platform} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';
import {UserData} from '../../providers/user-data';
import {FbProvider} from '../../providers/fb-provider';

@Page({
    templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
    static get parameters() {
        return [[NavController], [UserData], [Platform], [FbProvider]];
    }

    constructor(nav, userData, platform, fbProvider) {
        this.platform = platform;
        this.fb = fbProvider;
        this.email = '';
        this.name = '';
        this.id = '';

        this.nav = nav;
        this.userData = userData;

        this.login = {};
        this.submitted = false;
    }

    fbLogin() {
        console.log("Login.js reached");
        this.fb.login().then(() => {
            this.fb.getCurrentUserProfile().then(
                (profileData) => {
                    this.email = profileData.email;
                    console.log(this.email);
                    this.name = profileData.name;
                    console.log(this.name);
                    this.id = profileData.id;
                    console.log(this.id);
                }
            );
        });
    }

    onLogin(form) {
        this.submitted = true;

        if (form.valid) {
            this.userData.login();
            this.nav.push(TabsPage);
        }
    }

    onSignup() {
        this.nav.push(SignupPage);
    }
}
