import {NavController, Page, ActionSheet} from 'ionic-angular';

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
        // this.speaker = this.navParams.data;
    }

}
