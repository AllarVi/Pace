import {IonicApp, Modal, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';
import {NgZone} from 'angular2/core';

@Page({
    templateUrl: 'build/pages/profile/profile.html'
})
export class ProfilePage {
    static get parameters() {
        return [[NgZone], [NavController]];
    }

    constructor(ngZone, nav, navParams) {
        this.ngZone = ngZone;
        this.nav = nav;
        this.navParams = navParams;

        this.image = null;
    }

    openModal(characterNum) {
        let modal = Modal.create(ModalsContentPage, characterNum);
        this.nav.present(modal);
    }

    snapImage() {
        // var options = {
        //     destinationType: Camera.DestinationType.DATA_URL,
        //     sourceType: Camera.PictureSourceType.CAMERA,
        //     encodingType: Camera.EncodingType.JPEG,
        //     quality: 100,
        //     allowEdit: false,
        //     saveToPhotoAlbum: true
        // };

        var options = {
            limit: 3,
            duration: 15
        };

        navigator.device.capture.captureVideo((data) => {
            // var imgData = "data:image/jpeg;base64," + data;
            this.ngZone.run(() => this.image = data);
        }, (error) => {
            console.log("Error occurred while taking an image!");
            console.log(error);
        }, options);
    }
}

@Page({
    templateUrl: './build/pages/profile-goals-modal/profile-goals-modal.html'
})
class ModalsContentPage {
    static get parameters() {
        return [[Platform], [NavParams], [ViewController]];
    }


    constructor(platform,
                params,
                viewCtrl) {

        this.platform = platform;
        this.params = params;
        this.viewCtrl = viewCtrl;

        var characters = [
            {
                name: 'Gollum',
                quote: 'Sneaky little hobbitses!',
                items: [
                    {title: 'Race', note: 'Hobbit'},
                    {title: 'Culture', note: 'River Folk'},
                    {title: 'Alter Ego', note: 'Smeagol'}
                ]
            },
            {
                name: 'Frodo',
                quote: 'Go back, Sam! I\'m going to Mordor alone!',
                items: [
                    {title: 'Race', note: 'Hobbit'},
                    {title: 'Culture', note: 'Shire Folk'},
                    {title: 'Weapon', note: 'Sting'}
                ]
            },
            {
                name: 'Samwise Gamgee',
                quote: 'What we need is a few good taters.',
                items: [
                    {title: 'Race', note: 'Hobbit'},
                    {title: 'Culture', note: 'Shire Folk'},
                    {title: 'Nickname', note: 'Sam'}
                ]
            }
        ];
        this.character = characters[this.params.get('charNum')];
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}