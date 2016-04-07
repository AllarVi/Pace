import {Page, NavParams} from 'ionic-angular';


@Page({
    templateUrl: 'build/pages/group-detail/group-detail.html'
})
export class GroupDetailPage {
    static get parameters() {
        return [[NavParams]];
    }

    constructor(navParams) {
        this.navParams = navParams;
        this.group = navParams.data;
    }
}