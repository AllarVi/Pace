import {Component, ViewChild} from "@angular/core";

import {Events, MenuController, Platform, Nav} from "ionic-angular";
import {SplashScreen} from '@ionic-native/splash-screen';

import {Storage} from '@ionic/storage';

import {TabsPage} from "../pages/tabs/tabs";
import {LoginPage} from "../pages/login/login";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {ProfilePage} from "../pages/profile/profile";
import {AboutPage} from "../pages/about/about";

import {FbProvider} from "../providers/fb-provider";
import {UserData} from "../providers/user-data";

export interface PageInterface {
    title: string;
    name: string;
    component: any;
    icon: string;
    logsOut?: boolean;
    index?: number;
    tabName?: string;
    tabComponent?: any;
}

@Component({
    templateUrl: 'app.template.html',
})
export class PaceApp {

    @ViewChild(Nav) nav: Nav;

    // create an list of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    appPages: PageInterface[] = [
        {
            title: 'Dashboard',
            name: 'TabsPage',
            component: TabsPage,
            tabComponent: DashboardPage,
            index: 0,
            icon: 'home'
        },
        {title: 'Profile', name: 'TabsPage', component: TabsPage, tabComponent: ProfilePage, index: 1, icon: 'person'},
        {
            title: 'About',
            name: 'TabsPage',
            component: TabsPage,
            tabComponent: AboutPage,
            index: 2,
            icon: 'information-circle'
        }
    ];

    loggedInPages: PageInterface[] = [
        {title: 'Logout', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true}
    ];

    loggedOutPages: PageInterface[] = [
        {title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in'},
    ];

    rootPage: any;

    constructor(public events: Events,
                public userData: UserData,
                public platform: Platform,
                public fbProvider: FbProvider,
                public menu: MenuController,
                public storage: Storage,
                public splashScreen: SplashScreen) {

        this.storage.get('hasLoggedIn')
            .then((hasLoggedIn) => {
                console.log("hasLoggedIn", hasLoggedIn);
                if (hasLoggedIn) {
                    this.rootPage = TabsPage;
                } else {
                    this.rootPage = LoginPage;
                }
                this.platformReady()
            });

        this.fbProvider.getFbLoginStatus().then((FbLoginStatus: any) => {
            if (FbLoginStatus.status === 'connected') {
                // this.initLeftMenuAccount();
                // this.initDashboardPage();
            } else {
                // this.initLoginPage();
            }
        });
        this.enableMenu(true);

        this.listenToLoginEvents();

    }

    openPage(page: PageInterface) {
        let params = {};

        // the nav component was found using @ViewChild(Nav)
        // setRoot on the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            params = {tabIndex: page.index};
        }

        // If we are already on tabs just change the selected tab
        // don't setRoot again, this maintains the history stack of the
        // tabs even if changing them from the menu
        if (this.nav.getActiveChildNav() && page.index != undefined) {
            this.nav.getActiveChildNav().select(page.index);
            // Set the root of the nav with params if it's a tab index
        } else {
            this.nav.setRoot(page.name, params).catch((err: any) => {
                console.log(`Didn't set nav root: ${err}`);
            });
        }

        if (page.logsOut === true) {
            // Give the menu time to close before changing to logged out
            this.initLogout();
        }
    }

    initLogout() {
        // TODO:
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            this.enableMenu(true);
        });

        this.events.subscribe('user:logout', () => {
            this.enableMenu(false);
        });
    }

    platformReady() {
        // Call any initial plugins when ready
        this.platform.ready().then(() => {
            this.splashScreen.hide();
        });
    }

    enableMenu(loggedIn: boolean) {
        this.menu.enable(loggedIn, 'loggedInMenu');
        this.menu.enable(!loggedIn, 'loggedOutMenu');
    }

    isActive(page: PageInterface) {
        let childNav = this.nav.getActiveChildNav();

        // Tabs are a special case because they have their own navigation
        if (childNav) {
            if (childNav.getSelected() && childNav.getSelected().root === page.tabName) {
                return 'primary';
            }
            return;
        }

        if (this.nav.getActive() && this.nav.getActive().name === page.name) {
            return 'primary';
        }
        return;
    }

    private initLoginPage() {
        console.log("Navigating to Login Page...");
        this.nav.setRoot('LoginPage').catch((err: any) => {
            console.log(`Didn't set nav root: ${err}`);
        });
    }

    private initDashboardPage() {
        this.userData.getUserShortTeamView().then((shortTeamView) => {
            console.log("Navigating to Dashboard Page...");
            this.nav.setRoot(DashboardPage, {
                param1: shortTeamView
            });
        });
    }

    private initLeftMenuAccount() {
        this.userData.hasLoggedIn().then((hasLoggedIn) => {
            this.enableMenu(hasLoggedIn === true);
        });
    }

}
