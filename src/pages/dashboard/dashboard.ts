import {NavController, NavParams} from "ionic-angular";
import {GroupDetailPage} from "../group-detail/group-detail";
import {UserData} from "../../providers/user-data";
import {Component} from "@angular/core";


@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html'
})
export class DashboardPage {

    shortTeamView: any;

    constructor(private nav: NavController, private userData: UserData, private navParams: NavParams) {
        this.shortTeamView = navParams.get('param1');
        this.initDashboard();
    }

    private initDashboard() {
        this.userData.getUserShortTeamView().then((shortTeamView) => {
            this.shortTeamView = shortTeamView;
        });
    }

    goToGroupDetail(team: any) {
        console.log("Team ID: " + team.id);
        this.nav.push(GroupDetailPage, {
            team: team
        }).then((result) => {
            if (!result)
                console.log("nav.push.GroupDetailPage failed");
        });
    }

    openModal(characterNum: any) {
        // let modal = Modal.create(ModalsContentPage, characterNum);
        // this.nav.present(modal);
    }

}
