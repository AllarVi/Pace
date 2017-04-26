import {ModalController, NavController, NavParams} from "ionic-angular";
import {GroupDetailPage} from "../group-detail/group-detail";
import {UserData} from "../../providers/user-data";
import {Component} from "@angular/core";
import {DashboardGroupAddPage} from "../dashboard-group-add/dashboard-group-add";


@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html'
})
export class DashboardPage {

    teamView: any;

    constructor(private nav: NavController,
                private userData: UserData,
                private navParams: NavParams,
                private modalCtrl: ModalController) {
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

    openModal(characterNum: any) {
        let modal = this.modalCtrl.create(DashboardGroupAddPage, characterNum);
        modal.onDidDismiss(() => {
            this.initDashboard();
        });
        modal.present();
    }

}
