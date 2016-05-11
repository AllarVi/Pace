import 'es6-shim';
import {ViewChild} from 'angular2/core';
import {App, IonicApp, Events, Platform, ActionSheet, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {UserData} from './providers/user-data';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {DashboardPage} from './pages/dashboard/dashboard';
import {FbProvider} from './providers/fb-provider';

interface PageObj {
  title:string;
  component:any;
  icon:string;
  index?:number;
}

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

  @ViewChild(Nav) nav:Nav;

  loggedIn = false;

  rootPage:any = DashboardPage;

  constructor(private app:IonicApp, private events:Events, private userData:UserData, platform:Platform, private fbProvider:FbProvider) {

    // Call any initial plugins when ready
    platform.ready().then(() => {
      StatusBar.styleDefault();

      // Keyboard.setAccessoryBarVisible(false);

    });

    // this.userData.hasLoggedIn().then((hasLoggedIn) => {
    //   this.loggedIn = (hasLoggedIn == 'true');
    // });
    //
    // this.listenToLoginEvents();
    //

    // this.fbProvider.getFbLoginStatus().then((FbLoginStatus) => {
    //   console.log("PaceApp: User status:", FbLoginStatus.status);
    //   if (FbLoginStatus.status === 'connected') {
    //     console.log("Navigating to Dashboard Page");
    //     this.rootPage = DashboardPage;
    //   } else {
    //     console.log("Navigating to Login Page...");
    //     this.rootPage = LoginPage;
    //   }
    // });

  }

  // create an list of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages:PageObj[] = [
    {title: 'Dashboard', component: TabsPage, index: 0, icon: 'home'},
    {title: 'Profile', component: TabsPage, index: 1, icon: 'person'},
    {title: 'About', component: TabsPage, index: 2, icon: 'information-circle'}
  ];

  loggedInPages:PageObj[] = [
    {title: 'Logout', component: TabsPage, icon: 'log-out'}
  ];

  loggedOutPages:PageObj[] = [
    {title: 'Login', component: LoginPage, icon: 'log-in'}
  ];

  openPage(page:PageObj) {

    if (page.index) {
      console.log("Setting navRoot to index:");
      this.nav.setRoot(page.component, {tabIndex: page.index});
    } else {
      console.log("Setting navRoot to component:");
      this.nav.setRoot(page.component);
    }

    if (page.title === 'Logout') {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        console.log("Logging out initialized...");
        this.initLogout(this.nav, this.userData);
      }, 1000);
    }
  }

  initLogout(nav, userData) {
    let actionSheet = ActionSheet.create({
      title: 'Exit now?',
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
