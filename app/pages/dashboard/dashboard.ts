import {NavController, Page, NavParams} from "ionic-angular";
import {GroupDetailPage} from "../group-detail/group-detail";
import {UserData} from "../../providers/user-data";


@Page({
    templateUrl: 'build/pages/dashboard/dashboard.html'
})
export class DashboardPage {

    shortTeamView:any;

    constructor(private nav:NavController, private userData:UserData, private navParams:NavParams) {
        this.shortTeamView = navParams.get('param1');
        this.initDashboard();
    }

    private initDashboard() {
        this.userData.getUserShortTeamView().then((shortTeamView) => {
            console.log(JSON.stringify(shortTeamView));
            console.log("Done loading shortTeamView!");

            this.shortTeamView = shortTeamView;
        });
    }

    goToGroupDetail(group) {
        this.nav.push(GroupDetailPage, group);
    }

}
