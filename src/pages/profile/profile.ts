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

    constructor(private userData: UserData) {

        this.userData.getPaceUserFromStorage().then((paceUser: any) => {
            this.paceUser = paceUser;

            this.userData.getPaceUserPicture(paceUser.facebookId).then((profileAvatar) => {
                this.profileAvatar = profileAvatar;
            });
        });
    }
}
