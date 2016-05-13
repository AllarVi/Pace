"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
require('es6-shim');
var core_1 = require('angular2/core');
var ionic_angular_1 = require('ionic-angular');
var ionic_native_1 = require('ionic-native');
var user_data_1 = require('./providers/user-data');
var tabs_1 = require('./pages/tabs/tabs');
var login_1 = require('./pages/login/login');
var dashboard_1 = require('./pages/dashboard/dashboard');
var fb_provider_1 = require('./providers/fb-provider');
var PaceApp = (function () {
    function PaceApp(app, events, userData, platform, fbProvider) {
        var _this = this;
        this.app = app;
        this.events = events;
        this.userData = userData;
        this.fbProvider = fbProvider;
        this.loggedIn = false;
        this.rootPage = dashboard_1.DashboardPage;
        // create an list of pages that can be navigated to from the left menu
        // the left menu only works after login
        // the login page disables the left menu
        this.appPages = [
            { title: 'Dashboard', component: tabs_1.TabsPage, index: 0, icon: 'home' },
            { title: 'Profile', component: tabs_1.TabsPage, index: 1, icon: 'person' },
            { title: 'About', component: tabs_1.TabsPage, index: 2, icon: 'information-circle' }
        ];
        this.loggedInPages = [
            { title: 'Logout', component: tabs_1.TabsPage, icon: 'log-out' }
        ];
        this.loggedOutPages = [
            { title: 'Login', component: login_1.LoginPage, icon: 'log-in' },
            { title: 'Logout', component: tabs_1.TabsPage, icon: 'log-out' }
        ];
        // Call any initial plugins when ready
        platform.ready().then(function () {
            ionic_native_1.StatusBar.styleDefault();
            // Keyboard.setAccessoryBarVisible(false);
        });
        this.userData.hasLoggedIn().then(function (hasLoggedIn) {
            _this.loggedIn = (hasLoggedIn == 'true');
        });
        this.listenToLoginEvents();
        this.fbProvider.getFbLoginStatus().then(function (FbLoginStatus) {
            console.log("PaceApp: User status:", FbLoginStatus.status);
            if (FbLoginStatus.status === 'connected') {
                console.log("Navigating to Dashboard Page");
                _this.rootPage = dashboard_1.DashboardPage;
            }
            else {
                console.log("Navigating to Login Page...");
                _this.rootPage = login_1.LoginPage;
            }
        });
    }
    PaceApp.prototype.openPage = function (page) {
        var _this = this;
        if (page.index) {
            console.log("Setting navRoot to index:");
            this.nav.setRoot(page.component, { tabIndex: page.index });
        }
        else {
            console.log("Setting navRoot to component:");
            this.nav.setRoot(page.component);
        }
        if (page.title === 'Logout') {
            // Give the menu time to close before changing to logged out
            setTimeout(function () {
                console.log("Logging out initialized...");
                _this.initLogout(_this.nav, _this.userData);
            }, 1000);
        }
    };
    PaceApp.prototype.initLogout = function (nav, userData) {
        var actionSheet = ionic_angular_1.ActionSheet.create({
            title: 'Exit now?',
            buttons: [
                {
                    text: 'Log out',
                    role: 'destructive',
                    handler: function () {
                        var navTransition = actionSheet.dismiss();
                        console.log("Starting the async mehtod...");
                        userData.FbLogout()
                            .then(function () {
                            console.log("Finished call to Facebook about logging out");
                            navTransition.then(function () {
                                console.log("Navigating to LoginPage...");
                                nav.setRoot(login_1.LoginPage);
                            });
                        });
                        return false;
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        nav.present(actionSheet);
    };
    PaceApp.prototype.listenToLoginEvents = function () {
        var _this = this;
        this.events.subscribe('user:login', function () {
            _this.loggedIn = true;
        });
        this.events.subscribe('user:signup', function () {
            _this.loggedIn = true;
        });
        this.events.subscribe('user:logout', function () {
            _this.loggedIn = false;
        });
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Nav)
    ], PaceApp.prototype, "nav");
    PaceApp = __decorate([
        ionic_angular_1.App({
            templateUrl: 'build/app.html',
            providers: [user_data_1.UserData, fb_provider_1.FbProvider],
            config: {
                platforms: {
                    android: {
                        tabbarLayout: 'icon-hide'
                    }
                }
            }
        })
    ], PaceApp);
    return PaceApp;
}());
//# sourceMappingURL=app.js.map