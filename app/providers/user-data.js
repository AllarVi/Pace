"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("angular2/core");
var ionic_angular_1 = require("ionic-angular");
require("rxjs/add/operator/map");
// import {FbProvider} from '../providers/fb-provider';
var UserData = (function () {
    function UserData(events, http) {
        this.events = events;
        this.http = http;
        this._favorites = [];
        this.storage = new ionic_angular_1.Storage(ionic_angular_1.LocalStorage);
        this.HAS_LOGGED_IN = 'hasLoggedIn';
        this.url = null;
        this.paceUser = null;
    }
    UserData.prototype.getUser = function (userID) {
        var _this = this;
        console.log("UserData: getUser() reached...", "UserID:", userID);
        return new Promise(function (resolve) {
            _this.getPaceUser(userID).then(function (paceUser) {
                console.log("Got PaceUser...");
                resolve(paceUser);
            });
        });
    };
    UserData.prototype.getPaceUser = function (userID) {
        var _this = this;
        console.log("UserData: getPaceUser() reached...");
        // Don't have the data yet
        return new Promise(function (resolve) {
            _this.url = 'http://localhost:8080/api/user?facebookId=' + userID;
            console.log("Making request to: " + _this.url);
            console.log("Fetching user data from BackPace...");
            _this.http.get(_this.url).subscribe(function (paceUser) {
                console.log("User data from BackPace...");
                console.log(JSON.stringify(paceUser.json()));
                resolve(paceUser);
            }, function (error) {
                console.log("Error occurred while fetching user data... probably need to enable correct cors mapping");
                console.log(JSON.stringify(error.json()));
            }, function () { return console.log('User data fetching complete!'); });
        });
    };
    UserData.prototype.saveNewPaceUser = function (userProfile, status) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.url = 'http://localhost:8080/api/user';
            console.log("Making request to: " + _this.url);
            _this.paceUser = JSON.stringify({
                facebookId: userProfile.id,
                name: userProfile.name,
                authResponse: status,
                picture: "http://graph.facebook.com/" + userProfile.id + "/picture?type=large"
            });
            _this.http.post(_this.url, _this.paceUser).subscribe(function (paceUser) {
                console.log("Created user from BackPace...");
                console.log(JSON.stringify(paceUser.json()));
                resolve(paceUser);
            }, function (error) {
                console.log("Error... is backend running? probably need to enable cors mapping?");
                console.log(JSON.stringify(error.json()));
                reject();
            }, function () { return console.log('User data fetching complete!'); });
        });
    };
    UserData.prototype.hasFavorite = function (sessionName) {
        return (this._favorites.indexOf(sessionName) > -1);
    };
    UserData.prototype.addFavorite = function (sessionName) {
        this._favorites.push(sessionName);
    };
    UserData.prototype.removeFavorite = function (sessionName) {
        var index = this._favorites.indexOf(sessionName);
        if (index > -1) {
            this._favorites.splice(index, 1);
        }
    };
    UserData.prototype.login = function () {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.events.publish('user:login');
    };
    UserData.prototype.FbLogout = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.storage.remove(_this.HAS_LOGGED_IN);
            console.log("UserData: logout() reached...");
            facebookConnectPlugin.logout(function () {
                console.log("Logging out...");
                _this.events.publish('user:logout');
                resolve();
            }, function (err) {
                console.log("Unsuccessful logout from Facebook!");
                console.error(JSON.stringify(err.json()));
                reject();
            });
        });
    };
    // Return a promise
    UserData.prototype.hasLoggedIn = function () {
        return this.storage.get(this.HAS_LOGGED_IN).then(function (value) {
            return value;
        });
    };
    UserData = __decorate([
        core_1.Injectable()
    ], UserData);
    return UserData;
}());
exports.UserData = UserData;
//# sourceMappingURL=user-data.js.map