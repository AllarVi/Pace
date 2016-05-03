import {IonicApp, Page, NavController, MenuController, Platform} from "ionic-angular";
import {TabsPage} from "../tabs/tabs";
import {UserData} from "../../providers/user-data";
import {FbProvider} from "../../providers/fb-provider";

@Page({
    templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
    static get parameters() {
        return [[NavController], [MenuController], [UserData], [Platform], [FbProvider]];
    }

    constructor(nav, menu, userData, platform, fbProvider) {
        this.platform = platform;
        this.fb = fbProvider;
        this.email = '';
        this.name = '';

        this.nav = nav;
        this.menu = menu;
        this.userData = userData;

        this.login = {};
        this.submitted = false;

        this.slides = [
            {
                title: "Welcome to <b>ICA</b>",
                description: "The <b>Ionic Conference App</b> is a practical preview of the Ionic Framework in action, and a demonstration of proper code use.",
                image: "img/ica-slidebox-img-1.png"
            },
            {
                title: "What is Ionic?",
                description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
                image: "img/ica-slidebox-img-2.png"
            },
            {
                title: " What is Ionic Platform?",
                description: "The <b>Ionic Platform</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
                image: "img/ica-slidebox-img-3.png"
            }
        ];
    }

    fbLogin() {
        console.log("Facebook login initialized...");
        this.fb.login().then(() => {
            this.fb.getCurrentUserProfile().then(
                (profileData) => {
                    console.log("Parsing out profile data:");
                    this.email = profileData.email;
                    console.log(this.email);
                    this.name = profileData.name;
                    console.log(this.name);

                    this.nav.push(TabsPage);
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

    onPageDidEnter() {
        // the left menu should be disabled on the tutorial page
        this.menu.enable(false);
    }

    onPageDidLeave() {
        // enable the left menu when leaving the tutorial page
        this.menu.enable(true);
    }
}
