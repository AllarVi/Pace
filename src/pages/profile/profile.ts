import {NavController} from "ionic-angular";
import {UserData} from "../../providers/user-data";
import {Component, NgZone} from "@angular/core";


@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {

    paceUserData: any;
    profileAvatar: any;

    image: any;

    constructor(private ngZone: NgZone, private nav: NavController, private userData: UserData) {
        this.paceUserData = this.userData.getPaceUserData();

        // Fetching profile avatar from Facebook
        this.userData.getPaceUserPicture().then((profileAvatar) => {
            this.profileAvatar = profileAvatar;
        });
    }

    snapImage() {
    }
}
