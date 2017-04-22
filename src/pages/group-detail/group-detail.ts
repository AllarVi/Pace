import {NavParams} from "ionic-angular";
import {UserData} from "../../providers/user-data";
import {Component} from "@angular/core";

@Component({
    selector: 'page-group-detail',
    templateUrl: 'group-detail.html',
})
export class GroupDetailPage {

    team: any;

    teamMembers: Array<Object>;
    teamScores: Array<Object>;

    teamName: any;

    currentDate: any;

    currentMonthAttendance: any;

    attenChartLabels: any;
    maleAttendees: any;
    femaleAttendees: any;
    attenChartData: any;

    // Default tab to open
    groupTab: string = "scores";

    // Today's attendees
    attendees: any;

    constructor(private navParams: NavParams, private userData: UserData) {

        this.currentDate = new Date();

        this.team = this.navParams.get('team');
        this.teamName = this.team.teamName;

        this.userData.getTeamData(this.team.id).then((teamData: any) => {
            this.teamMembers = teamData['fullScoresTableList'];
            this.teamScores = Object.assign([], this.teamMembers);

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
        let date = {
            day: this.currentDate.getUTCDay(),
            month: this.currentDate.getUTCMonth(),
            year: this.currentDate.getUTCFullYear()
        };

        this.userData.markAttendance(member, this.team.id, "present", date).then((currentMonthAttendance: any) => {
            console.log("Marked as present!");
            this.currentMonthAttendance = currentMonthAttendance;
            this.extractAttendees(currentMonthAttendance, date);

        });

        let index = this.teamMembers.indexOf(member);
        this.teamMembers.splice(index, 1);
    }

    markAbsent(member: any) {
        let index = this.teamMembers.indexOf(member);
        this.teamMembers.splice(index, 1);
    }

    private extractAttendees(currentMonthAttendance: any, date: { day: number; month: number; year: number }) {
        for (let dayOfMonth of currentMonthAttendance) {
            if (dayOfMonth._date_.day == date.day) {
                this.attendees = dayOfMonth.attendees;
            }
        }
    }

}
