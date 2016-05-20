import {Modal, NavController, NavParams, Page, ViewController} from "ionic-angular";
import {NgZone} from "angular2/core";
import {Camera} from "ionic-native";
import {UserData} from "../../providers/user-data";


@Page({
    templateUrl: 'build/pages/profile/profile.html'
})
export class ProfilePage {

    paceUserData = null;
    profileAvatar = null;

    image = null;

    constructor(private ngZone:NgZone, private nav:NavController, private userData:UserData) {
        this.paceUserData = this.userData.getPaceUserData();

        // Fetching profile avatar from Facebook
        this.userData.getPaceUserPicture().then((profileAvatar) => {
            this.profileAvatar = profileAvatar;
        });
    }

    openModal(characterNum) {
        let modal = Modal.create(ProfileGoalsModal, characterNum);
        this.nav.present(modal);
    }

    openProfileAchievementsModal(characterNum) {
        let modal = Modal.create(ProfileAchievementsModal, characterNum);
        this.nav.present(modal);
    }

    snapImage() {
        var options = {
            destinationType: 0,
            sourceType: 1,
            encodingType: 0,
            quality: 100,
            allowEdit: false,
            saveToPhotoAlbum: false
        };

        Camera.getPicture(options).then((data) => {
            var imgData = "data:image/jpeg;base64," + data;
            this.userData.uploadAchievement("test", this.image).then(function (success) {
                console.log(JSON.stringify(success));
                console.log("File upload finished...");
            }, function () {
                console.log("File upload failed...");
            });
            this.ngZone.run(() => this.image = imgData);
        }, (error) => {
            alert(error);
        });
    }
}

@Page({
    templateUrl: './build/pages/profile-goals-modal/profile-goals-modal.html'
})
class ProfileGoalsModal {

    constructor(private params:NavParams,
                private viewCtrl:ViewController) {
    }

    characters = [
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

    character = this.characters[this.params.get('charNum')];

    dismiss() {
        this.viewCtrl.dismiss();
    }
}

@Page({
    templateUrl: './build/pages/profile-achievements-modal/profile-achievements-modal.html'
})
class ProfileAchievementsModal {

    arrayOfKeys = null;
    arrayOfValues = null;

    constructor(private userData:UserData,
                private viewCtrl:ViewController) {

        this.initAchievements();
    }

    initAchievements() {
        this.userData.getAllAchievements().then((achievements) => {
            this.arrayOfKeys = Object.keys(achievements);
            this.arrayOfValues = Object.keys(achievements).map(key => achievements[key]);
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
