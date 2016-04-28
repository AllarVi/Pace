import 'es6-shim';
import {App, IonicApp, Events, Platform, ActionSheet} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {UserData} from './providers/user-data';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {DashboardPage} from './pages/dashboard/dashboard';
import {SignupPage} from './pages/signup/signup';
import {FbProvider} from './providers/fb-provider';
// import {TutorialPage} from './pages/tutorial/tutorial';


@App({
    templateUrl: 'build/app.html',
    providers: [UserData, FbProvider],
    config: {
        platforms: {
            android: {
                tabbarLayout: 'icon-hide'
            }
        }
    }
})
class PaceApp {
    static get parameters() {
        return [
            [IonicApp], [Events], [UserData], [Platform], [FbProvider]
        ]
    }

    constructor(app, events, userData, platform, fbProvider) {
        this.app = app;
        this.userData = userData;
        this.events = events;
        this.loggedIn = false;

        this.fbProvider = fbProvider;
        this.fbLoginStatus = null;

        // Call any initial plugins when ready
        platform.ready().then(() => {
            StatusBar.styleDefault();
        });

        // this.root = TutorialPage; // Uncomment if tutorial page is needed when the app loads
        this.fbProvider.getFbLoginStatus().then((FbLoginStatus) => {
            this.fbLoginStatus = FbLoginStatus;
            console.log("PaceApp: User status:", FbLoginStatus.status);
            if (FbLoginStatus.status === 'connected') {
                this.root = DashboardPage;
            } else {
                this.root = LoginPage;
            }
        });

        // create an list of pages that can be navigated to from the left menu
        // the left menu only works after login
        // the login page disables the left menu
        this.appPages = [
            {title: 'Dashboard', component: TabsPage, index: 0, icon: 'home'},
            {title: 'Profile', component: TabsPage, index: 1, icon: 'person'},
            {title: 'About', component: TabsPage, index: 2, icon: 'information-circle'}
        ];

        this.loggedInPages = [
            {title: 'Logout', component: TabsPage, icon: 'log-out'}
        ];

        this.loggedOutPages = [
            {title: 'Login', component: LoginPage, icon: 'log-in'},
            {title: 'Signup', component: SignupPage, icon: 'person-add'}
        ];

        // Decide which menu items should be hidden by current login status stored in local storage
        this.userData.hasLoggedIn().then((hasLoggedIn) => {
            this.loggedIn = (hasLoggedIn == 'true');
        });

        this.listenToLoginEvents();
    }

    openPage(page) {
        // find the nav component and set what the root page should be
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        let nav = this.app.getComponent('nav');

        if (page.index) {
            console.log("Setting navRoot to index:");
            nav.setRoot(page.component, {tabIndex: page.index});
        } else {
            console.log("Setting navRoot to component:");
            nav.setRoot(page.component);
        }

        if (page.title === 'Logout') {
            // Give the menu time to close before changing to logged out
            setTimeout(() => {
                console.log("Logging out initialized...");
                this.initLogout(nav, this.userData);
            }, 1000);
        }
    }

    initLogout(nav, userData) {
        let actionSheet = ActionSheet.create({
            title: 'Are you sure?',
            buttons: [
                {
                    text: 'Log out',
                    role: 'destructive',
                    handler: () => {
                        let navTransition = actionSheet.dismiss();

                        console.log("Starting the async mehtod...");
                        userData.FbLogout()
                            .then(() => {
                                console.log("Finished call to Facebook about logging out");

                                navTransition.then(() => {
                                    console.log("Navigating to LoginPage...");
                                    nav.setRoot(LoginPage);
                                });
                            });
                        return false;
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        nav.present(actionSheet);
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            this.loggedIn = true;
        });

        this.events.subscribe('user:signup', () => {
            this.loggedIn = true;
        });

        this.events.subscribe('user:logout', () => {
            this.loggedIn = false;
        });
    }
}
