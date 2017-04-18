import {NavController} from "ionic-angular";
import {FbProvider} from "../../providers/fb-provider";
import {Component} from "@angular/core";
import {TabsPage} from "../tabs/tabs";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    constructor(private nav: NavController,
                private fbProvider: FbProvider) {
    }

    fbLogin() {
        console.log("Facebook login initialized...");
        this.fbProvider.login().then(() => {
            console.log("Navigating to home...");
            this.nav.push(TabsPage);
        });
    }

}
