"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ionic_angular_1 = require('ionic-angular');
var ProfilePage = (function () {
    function ProfilePage(ngZone, nav, navParams) {
        this.ngZone = ngZone;
        this.nav = nav;
        this.navParams = navParams;
        this.image = null;
    }
    ProfilePage.prototype.openModal = function (characterNum) {
        var modal = ionic_angular_1.Modal.create(ModalsContentPage, characterNum);
        this.nav.present(modal);
    };
    ProfilePage.prototype.snapImage = function () {
        // var options = {
        //     destinationType: Camera.DestinationType.DATA_URL,
        //     sourceType: Camera.PictureSourceType.CAMERA,
        //     encodingType: Camera.EncodingType.JPEG,
        //     quality: 100,
        //     allowEdit: false,
        //     saveToPhotoAlbum: true
        // };
        var _this = this;
        var options = {
            limit: 3,
            duration: 15
        };
        navigator.device.capture.captureVideo(function (mediaFiles) {
            // var imgData = "data:image/jpeg;base64," + data;
            _this.ngZone.run(function () {
                var i, path, len;
                for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    path = mediaFiles[i].fullPath;
                }
                _this.image = path;
            });
        }, function (error) {
            console.log("Error occurred while taking an image!");
            console.log(error);
        }, options);
    };
    ProfilePage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/profile/profile.html'
        })
    ], ProfilePage);
    return ProfilePage;
}());
exports.ProfilePage = ProfilePage;
var ModalsContentPage = (function () {
    function ModalsContentPage(platform, params, viewCtrl) {
        this.platform = platform;
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.characters = [
            {
                name: 'Gollum',
                quote: 'Sneaky little hobbitses!',
                items: [
                    { title: 'Race', note: 'Hobbit' },
                    { title: 'Culture', note: 'River Folk' },
                    { title: 'Alter Ego', note: 'Smeagol' }
                ]
            },
            {
                name: 'Frodo',
                quote: 'Go back, Sam! I\'m going to Mordor alone!',
                items: [
                    { title: 'Race', note: 'Hobbit' },
                    { title: 'Culture', note: 'Shire Folk' },
                    { title: 'Weapon', note: 'Sting' }
                ]
            },
            {
                name: 'Samwise Gamgee',
                quote: 'What we need is a few good taters.',
                items: [
                    { title: 'Race', note: 'Hobbit' },
                    { title: 'Culture', note: 'Shire Folk' },
                    { title: 'Nickname', note: 'Sam' }
                ]
            }
        ];
        this.character = this.characters[this.params.get('charNum')];
    }
    ModalsContentPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ModalsContentPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: './build/pages/profile-goals-modal/profile-goals-modal.html'
        })
    ], ModalsContentPage);
    return ModalsContentPage;
}());
//# sourceMappingURL=profile.js.map