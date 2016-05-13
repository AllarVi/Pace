"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ionic_angular_1 = require("ionic-angular");
var tabs_1 = require("../tabs/tabs");
var dashboard_1 = require("../dashboard/dashboard");
var LoginPage = (function () {
    function LoginPage(nav, menu, userData, platform, fb) {
        this.nav = nav;
        this.menu = menu;
        this.userData = userData;
        this.fb = fb;
        this.email = '';
        this.name = '';
        this.login = {};
        this.submitted = false;
        this.slides = [
            {
                title: "Welcome to <b>Pace</b>",
                description: "This is a practical preview of the Ionic 2 in action by Allar Viinamäe.",
                image: "img/discus-thrower.png"
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
    LoginPage.prototype.fbLogin = function () {
        var _this = this;
        console.log("Facebook login initialized...");
        this.fb.login().then(function () {
            _this.userData.login();
            console.log("Navigating to home...");
            // this.nav.push(TabsPage);
            _this.nav.setRoot(dashboard_1.DashboardPage);
        });
    };
    LoginPage.prototype.onLogin = function (form) {
        this.submitted = true;
        if (form.valid) {
            this.userData.login();
            console.log("Pushing to TabsPage...");
            // this.nav.push(TabsPage);
            this.nav.push(tabs_1.TabsPage);
        }
    };
    LoginPage.prototype.onPageDidEnter = function () {
        // the left menu should be disabled on the tutorial page
        this.menu.enable(false);
    };
    LoginPage.prototype.onPageDidLeave = function () {
        // enable the left menu when leaving the tutorial page
        this.menu.enable(true);
    };
    LoginPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/login/login.html'
        })
    ], LoginPage);
    return LoginPage;
}());
exports.LoginPage = LoginPage;
//# sourceMappingURL=login.js.map