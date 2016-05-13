import {Page, NavParams} from 'ionic-angular';
import {AboutPage} from '../about/about';
import {DashboardPage} from '../dashboard/dashboard';
import {ProfilePage} from '../profile/profile';


@Page({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

    // set the root pages for each tab
    tab1Root:any = DashboardPage; // 1
    tab2Root:any = ProfilePage; // 2
    tab3Root:any = AboutPage; // 0

    mySelectedIndex:number;

    constructor(private navParams:NavParams) {
        console.log("TabIndex:", this.navParams.data.tabIndex);
        this.mySelectedIndex = this.navParams.data.tabIndex || 0;
    }
}
