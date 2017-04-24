import {NavController} from "ionic-angular";
import {UserData} from "../../providers/user-data";
import {Component} from "@angular/core";


@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {

    paceUser: any = {};
    profileAvatar: any = {
        data: {
            url: ''
        }
    };

    constructor(private nav: NavController,
                private userData: UserData) {

        this.userData.getPaceUserFromStorage().then(paceUser => {
            this.paceUser = paceUser;
        });

        this.userData.getPaceUserPicture().then((profileAvatar) => {
            this.profileAvatar = profileAvatar;
        });
    }
}
