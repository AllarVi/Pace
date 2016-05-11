"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("angular2/core");
var FbProvider = (function () {
    function FbProvider(events, platform, userData) {
        this.events = events;
        this.platform = platform;
        this.userData = userData;
        this.result = null;
        this.uri = null;
    }
    // This method is executed when the user starts the app
    FbProvider.prototype.getFbLoginStatus = function () {
        var _this = this;
        console.log("Fb-provider: getFbLoginStatus() reached...");
        this.result = new Promise(function (resolve, reject) {
            _this.platform.ready().then(function () {
                if (_this.platform.is('cordova')) {
                    facebookConnectPlugin.getLoginStatus(function (success) {
                        console.log("getLoginStatus connetion...");
                        if (success.status === 'connected') {
                            console.log('getLoginStatus', success.status);
                            _this.events.publish('user:login');
                            // Check if we have our user saved
                            _this.userData.getUser(success.authResponse.userID).then(function () {
                                console.log("Fb-provider: getUser(): ");
                                resolve(success);
                            });
                        }
                        else if (success.status === 'not_authorized') {
                            console.log('getLoginStatus', success.status);
                            resolve(success);
                        }
                        else if (success.status === 'unknown') {
                            console.log('getLoginStatus', success.status);
                            resolve(success);
                        }
                    }, function (err) {
                        console.log("Unsuccessful login status fetching from Facebook!");
                        reject(err);
                    });
                }
                else {
                    console.log("Please run me on a device!");
                    reject('Please run me on a device!');
                }
            });
        });
        return this.result;
    };
    FbProvider.prototype.login = function () {
        var _this = this;
        console.log("Fb-provider: login() reached...");
        return new Promise(function (resolve, reject) {
            if (_this.platform.is('cordova')) {
                _this.getFbLoginStatus().then(function (FbLoginStatus) {
                    _this.fbLoginStatusSuccess(FbLoginStatus, resolve, reject);
                });
            }
            else {
                reject('Please run me on a device');
            }
        });
    };
    FbProvider.prototype.fbLoginStatusSuccess = function (FbLoginStatus, resolve, reject) {
        var _this = this;
        console.log("PaceApp: User status:", FbLoginStatus.status);
        if (FbLoginStatus.status === 'connected') {
            console.log("We shouldn't get here...");
        }
        else {
            console.log("getFbLoginStatus", FbLoginStatus.status);
            facebookConnectPlugin.login(['email', 'public_profile'], function (success) {
                console.log("Login call successful!");
                _this.fbLoginSuccess(success).then(function () {
                    console.log("Resolving after fbLoginSuccess...");
                    resolve();
                });
            }, function (err) {
                _this.fbLoginError(err);
                reject(err);
            });
        }
    };
    ;
    FbProvider.prototype.fbLoginError = function (err) {
        console.log("Unsuccessful Facebook login!");
        console.log(JSON.stringify(err));
    };
    ;
    FbProvider.prototype.fbLoginSuccess = function (success) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (success.status === 'connected') {
                _this.getCurrentUserProfile(success.authResponse.accessToken).then(function (profileData) {
                    console.log("fbLoginSuccess: getCurrentUserProfile:");
                    console.log(JSON.stringify(profileData));
                    _this.userData.saveNewPaceUser(profileData, success.status).then(function () {
                        console.log("Publishing login...");
                        _this.events.publish('user:login');
                        resolve();
                    }, function (err) {
                        console.log(JSON.stringify(err));
                        reject();
                    });
                });
            }
        });
    };
    // This method is to get the user profile info from the facebook api
    FbProvider.prototype.getCurrentUserProfile = function (authResponse) {
        var _this = this;
        console.log("Fb-provider: getCurrentUserProfile() reached...");
        this.uri = "me?fields=email,name&access_token=" + authResponse;
        console.log(this.uri);
        return new Promise(function (resolve, reject) {
            facebookConnectPlugin.api(_this.uri, null, function (profileData) {
                console.log(JSON.stringify(profileData));
                console.log("Resolving...");
                resolve(profileData);
            }, function (err) {
                reject(err);
            });
        });
    };
    FbProvider = __decorate([
        core_1.Injectable()
    ], FbProvider);
    return FbProvider;
}());
exports.FbProvider = FbProvider;
//# sourceMappingURL=fb-provider.js.map