"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ionic_angular_1 = require('ionic-angular');
var about_1 = require('../about/about');
var dashboard_1 = require('../dashboard/dashboard');
var profile_1 = require('../profile/profile');
var TabsPage = (function () {
    function TabsPage(navParams) {
        this.navParams = navParams;
        // set the root pages for each tab
        this.tab1Root = dashboard_1.DashboardPage; // 1
        this.tab2Root = profile_1.ProfilePage; // 2
        this.tab3Root = about_1.AboutPage; // 0
        console.log("TabIndex:", this.navParams.data.tabIndex);
        this.mySelectedIndex = this.navParams.data.tabIndex || 0;
    }
    TabsPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/tabs/tabs.html'
        })
    ], TabsPage);
    return TabsPage;
}());
exports.TabsPage = TabsPage;
//# sourceMappingURL=tabs.js.map