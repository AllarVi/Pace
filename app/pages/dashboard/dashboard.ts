import {NavController, Page, NavParams, Modal, ViewController} from "ionic-angular";
import {GroupDetailPage} from "../group-detail/group-detail";
import {UserData} from "../../providers/user-data";


@Page({
    templateUrl: 'build/pages/dashboard/dashboard.html'
})
export class DashboardPage {

    shortTeamView: any;

    constructor(private nav: NavController, private userData: UserData, private navParams: NavParams) {
        this.shortTeamView = navParams.get('param1');
        this.initDashboard();
    }

    private initDashboard() {
        this.userData.getUserShortTeamView().then((shortTeamView) => {
            console.log("Done loading shortTeamView!", shortTeamView);
            this.shortTeamView = shortTeamView;
        });
    }

    goToGroupDetail(team) {
        console.log("Team ID: " + team.id);
        this.nav.push(GroupDetailPage, {
            team: team
        }).then((result) => {
            if (!result)
                console.log("nav.push.GroupDetailPage failed");
        });
    }

    openModal(characterNum) {
        let modal = Modal.create(ModalsContentPage, characterNum);
        this.nav.present(modal);
    }

}

@Page({
    templateUrl: './build/pages/dashboard-group-add/dashboard-group-add.html'
})
class ModalsContentPage {

    searchQuery: string = '';
    teams: any;

    constructor(public viewCtrl: ViewController, private userData: UserData) {

        this.initializeItems();

    }

    initializeItems() {
        this.userData.getGroups().then((teams) => {
            this.teams = teams;
        });
    }

    getItems(searchbar) {
        // Reset items back to all of the items
        this.initializeItems();

        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }

        this.teams = this.teams.filter((v) => {
            return v.toLowerCase().indexOf(q.toLowerCase()) > -1;

        })
    }

    joinTeam(teamId) {
        this.userData.joinTeam(teamId).then((success) => {
            console.log(JSON.stringify(success));
            console.log("Joined team!");
            this.viewCtrl.dismiss();
        }, () => {
            console.log("Joining team failed!")
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
