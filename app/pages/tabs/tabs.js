import {Page, NavParams} from 'ionic-angular';
import {AboutPage} from '../about/about';
import {DashboardPage} from '../dashboard/dashboard';
import {ProfilePage} from '../profile/profile';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  static get parameters() {
    return [[NavParams]];
  }

  constructor(navParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;

    // set the root pages for each tab
    this.tab1Root = DashboardPage; // 1
    this.tab2Root = ProfilePage; // 2
    this.tab3Root = AboutPage; // 0
  }
}
