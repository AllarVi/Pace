import {Component} from "@angular/core";

import {NavParams} from 'ionic-angular';

import {AboutPage} from '../about/about';
import {DashboardPage} from '../dashboard/dashboard';
import {ProfilePage} from '../profile/profile';


@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    // set the root pages for each tab
    tab1Root: any = DashboardPage; // 0
    tab2Root: any = ProfilePage; // 1
    tab3Root: any = AboutPage; // 2
    mySelectedIndex: number;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}
