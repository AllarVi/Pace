import {NavController, MenuController} from "ionic-angular";
import {UserData} from "../../providers/user-data";
import {FbProvider} from "../../providers/fb-provider";
import {DashboardPage} from "../dashboard/dashboard";
import {Component} from "@angular/core";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    constructor(private nav: NavController, private menu: MenuController, private userData: UserData, private fbProvider: FbProvider) {
    }

    fbLogin() {
        console.log("Facebook login initialized...");
        this.fbProvider.login().then(() => {
            this.userData.login();
            console.log("Navigating to home...");
            // this.nav.push(DashboardPage);
            this.nav.setRoot(DashboardPage).then((result) => {
                console.log("fbLogin:setRoot:Dashboard", result);
            });
        });
    }

    onPageDidEnter() {
        // the left menu should be disabled on the tutorial page
        this.menu.enable(false);
    }

    onPageDidLeave() {
        // enable the left menu when leaving the tutorial page
        this.menu.enable(true);
    }
}
