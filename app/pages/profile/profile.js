import {IonicApp, Modal, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';


@Page({
    templateUrl: 'build/pages/profile/profile.html'
})
export class ProfilePage {
    static get parameters() {
        return [[NavController]];
    }

    constructor(nav, navParams) {
        this.nav = nav;
        this.navParams = navParams;
    }

    openModal(characterNum) {
        let modal = Modal.create(ModalsContentPage, characterNum);
        this.nav.present(modal);
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