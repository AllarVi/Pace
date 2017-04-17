import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {NgModule, ErrorHandler} from '@angular/core';

import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';

import {PaceApp} from './app.component';

import {AboutPage} from '../pages/about/about';
import {DashboardPage} from '../pages/dashboard/dashboard';

import {SplashScreen} from '@ionic-native/splash-screen';

import {UserData} from '../providers/user-data';
import {LoginPage} from "../pages/login/login";
import {TabsPage} from "../pages/tabs/tabs";
import {GroupDetailPage} from "../pages/group-detail/group-detail";
import {ProfilePage} from "../pages/profile/profile";
import {IonicStorageModule} from "@ionic/storage";
import {DashboardGroupAddPage} from "../pages/dashboard-group-add/dashboard-group-add";
import {FbProvider} from "../providers/fb-provider";


@NgModule({
    declarations: [
        PaceApp,
        DashboardPage,
        DashboardGroupAddPage,
        AboutPage,
        LoginPage,
        TabsPage,
        GroupDetailPage,
        ProfilePage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(PaceApp, {}, {
            links: [
                {component: TabsPage, name: 'Tabs', segment: 'tabs'},
                {component: AboutPage, name: 'About', segment: 'about'},
                {component: LoginPage, name: 'LoginPage', segment: 'login'},
                {component: GroupDetailPage, name: 'GroupDetailPage', segment: 'group-detail'},
                {component: DashboardPage, name: 'DashboardPage', segment: 'dashboard'},
                {component: DashboardGroupAddPage, name: 'DashboardGroupAddPage', segment: 'dashboard-group-add'},
                {component: ProfilePage, name: 'ProfilePage', segment: 'profile'},
            ]
        }),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        PaceApp,
        AboutPage,
        LoginPage,
        TabsPage,
        GroupDetailPage,
        ProfilePage,
        DashboardPage,
        DashboardGroupAddPage
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        PaceApp,
        UserData,
        FbProvider,
        SplashScreen
    ]
})
export class AppModule {
}
