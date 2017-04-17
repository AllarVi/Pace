import {ViewController} from "ionic-angular";
import {UserData} from "../../providers/user-data";
import {Component} from "@angular/core";

@Component({
    selector: 'page-dashboard-group-add',
    templateUrl: 'dashboard-group-add.html'
})
export class DashboardGroupAddPage {

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

    getItems(searchbar: any) {
        // Reset items back to all of the items
        this.initializeItems();

        // set q to the value of the searchbar
        let q = searchbar.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }

        this.teams = this.teams.filter((v: any) => {
            return v.toLowerCase().indexOf(q.toLowerCase()) > -1;

        })
    }

    joinTeam(teamId: any) {
        this.userData.joinTeam(teamId).then((success) => {
            console.log(JSON.stringify(success));
            console.log("Joined team!");
            this.viewCtrl.dismiss();
        }, () => {
            console.log("Joining team failed!")
        });
    }

    dismiss() {
        this.viewCtrl.dismiss().then();
    }
}
