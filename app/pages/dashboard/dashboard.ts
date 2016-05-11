import {NavController, Page, ActionSheet} from 'ionic-angular';
import {GroupDetailPage} from '../group-detail/group-detail';


@Page({
    templateUrl: 'build/pages/dashboard/dashboard.html'
})
export class DashboardPage {

    constructor(private nav: NavController) {
    }

    goToGroupDetail(group) {
        this.nav.push(GroupDetailPage, group);
    }

}
