import {NavParams, Platform, ViewController} from "ionic-angular";
import {UserData} from "../../providers/user-data";
import {Component} from "@angular/core";

@Component({
    selector: 'page-dashboard-group-add',
    templateUrl: 'dashboard-group-add.html'
})
export class DashboardGroupAddPage {

    groups: any;

    constructor(public platform: Platform,
                public viewCtrl: ViewController,
                private userData: UserData,
                public params: NavParams,
    ) {

        this.initializeItems();

    }

    initializeItems() {
        this.userData.getGroups().then((groups) => {
            this.groups = groups;
        });
    }

    getItems(ev: any) {
        // Reset items back to all of the items
        this.initializeItems();

        // set val to the value of the ev target
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.groups = this.groups.filter((item: any) => {
                return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }

    joinTeam(teamId: any) {
        this.userData.joinGroup(teamId).then(() => {
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
