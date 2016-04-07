import {NavController, Page, ActionSheet} from 'ionic-angular';
import {ConferenceData} from '../../providers/conference-data';
import {GroupDetailPage} from '../group-detail/group-detail';


@Page({
    templateUrl: 'build/pages/dashboard/dashboard.html'
})
export class DashboardPage {
    static get parameters() {
        return [[NavController], [ConferenceData]];
    }

    constructor(nav, confData) {
        this.nav = nav;
        this.confData = confData;
        this.speakers = [];

        confData.getSpeakers().then(speakers => {
            this.speakers = speakers;
        });
    }

    goToGroupDetail(group) {
        this.nav.push(GroupDetailPage, group);
    }

}
