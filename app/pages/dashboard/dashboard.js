import {NavController, Page, ActionSheet} from 'ionic-angular';
import {GroupDetailPage} from '../group-detail/group-detail';


@Page({
    templateUrl: 'build/pages/dashboard/dashboard.html'
})
export class DashboardPage {
    static get parameters() {
        return [[NavController]];
    }

    constructor(nav) {
        this.nav = nav;
    }

    goToGroupDetail(group) {
        this.nav.push(GroupDetailPage, group);
    }

}
