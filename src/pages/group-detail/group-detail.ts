import {NavParams} from "ionic-angular";
import {UserData} from "../../providers/user-data";
import {Component} from "@angular/core";

@Component({
    selector: 'page-group-detail',
    templateUrl: 'group-detail.html',
})
export class GroupDetailPage {

    team: any;

    teamMembers: any;

    teamName: any;

    currentDate: any;

    currentMonthAttendance: any;

    attenChartLabels: any;
    maleAttendees: any;
    femaleAttendees: any;

    attenChartData: any;

    groupTab: string = "scores";

    constructor(private navParams: NavParams, private userData: UserData) {

        this.currentDate = new Date();

        this.team = this.navParams.get('team');
        this.teamName = this.team.teamName;

        this.userData.getTeamData(this.team.id).then((teamData: any) => {
            this.teamMembers = teamData['fullScoresTableList'];
            this.currentMonthAttendance = teamData['currentMonthAttendance'];

            this.attenChartLabels = this.currentMonthAttendance.map((element: any) => {
                return element.date;
            });

            this.maleAttendees = this.currentMonthAttendance.map((element: any) => {
                return element.maleAttendees;
            });

            this.femaleAttendees = this.currentMonthAttendance.map((element: any) => {
                return element.femaleAttendees;
            });

            this.attenChartData = [this.maleAttendees, this.femaleAttendees];

        });
    }

    markPresent(member: any) {
        this.userData.markAttendance(this.team.id, "present", this.currentDate.getDate()).then(() => {
            console.log("Marked as present!");
        });

        let index = this.teamMembers.indexOf(member);
        this.teamMembers.splice(index, 1);
    }

    markAbsent(member: any) {
        let index = this.teamMembers.indexOf(member);
        this.teamMembers.splice(index, 1);
    }

}
