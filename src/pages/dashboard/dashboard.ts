import {NavController, NavParams} from "ionic-angular";
import {GroupDetailPage} from "../group-detail/group-detail";
import {UserData} from "../../providers/user-data";
import {Component} from "@angular/core";


@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html'
})
export class DashboardPage {

    teamView: any;

    constructor(private nav: NavController, private userData: UserData, private navParams: NavParams) {
        this.teamView = navParams.get('param1');
        this.initDashboard();
    }

    private initDashboard() {
        this.userData.getUserShortTeamView().then((teamView) => {
            this.teamView = teamView;
        });
    }

    goToGroupDetail(team: any) {
        this.nav.push(GroupDetailPage, {
            team: team
        }).then((result) => {
            if (!result)
                console.log("nav.push.GroupDetailPage failed");
        });
    }

}
