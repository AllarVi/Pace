import {Page, NavParams} from 'ionic-angular';
import {AboutPage} from '../about/about';
import {DashboardPage} from '../dashboard/dashboard';
import {ProfilePage} from '../profile/profile';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  constructor(private navParams:NavParams) {
  }

  mySelectedIndex = this.navParams.data.tabIndex || 0;

  // set the root pages for each tab
  tab1Root = DashboardPage; // 1
  tab2Root = ProfilePage; // 2
  tab3Root = AboutPage; // 0
}
