import {NavController, NavParams} from "ionic-angular";
import {UserData} from "../../providers/user-data";
import {Component} from "@angular/core";
import {Chart} from "chart.js";

@Component({
    selector: 'group-detail-page',
    templateUrl: 'group-detail.html',
})
export class GroupDetailPage {

    team: any;

    teamMembers: Array<any>;
    teamScores: Array<any>;

    curDate: any;

    currentMonthAttendance: any;

    attenChartLabels: any;
    maleAttendees: any;
    femaleAttendees: any;
    attenChartData: any;

    // Default tab to open
    groupTab: string = "scores";

    // Today's attendees
    attendees: Array<any>;

    constructor(private navParams: NavParams,
                private userData: UserData,
                public navCtrl: NavController) {

        this.curDate = new Date().toISOString().slice(0, 10); // get YYYY-MM-DD part of date

        this.team = this.navParams.get('team'); // team data

        this.userData.getTeamData(this.team.id).then((teamData: any) => {
            this.teamScores = teamData['fullScoresTableList'];
            this.teamMembers = Object.assign([], this.teamScores);

            this.currentMonthAttendance = teamData['currentMonthAttendance'];
            this.attendees = this.extractAttendees(this.currentMonthAttendance, this.parseDate(this.curDate));
            this.removeAttendingFromMembers(this.attendees);

            this.extractAttendanceData();

            this.attenChartData = [this.maleAttendees, this.femaleAttendees];

        });
    }

    onCurDateChange(newValue: any) {
        let month = this.formatMonth(newValue.month);

        let date = {
            day: newValue.day.toString(),
            month: month,
            year: newValue.year.toString()
        };

        this.teamMembers = Object.assign([], this.teamScores); // Reset members
        this.attendees = this.extractAttendees(this.currentMonthAttendance, date); // Get attendees
        this.removeAttendingFromMembers(this.attendees); // Members - attendees
    }

    markPresent(member: any) {
        let date = this.parseDate(this.curDate);

        this.userData.markAttendance(member, this.team.id, "present", date).then((currentMonthAttendance: any) => {
            console.log("Marked as present on ", date);
            this.currentMonthAttendance = currentMonthAttendance;
            this.attendees = this.extractAttendees(currentMonthAttendance, date);

        });

        this.removeMemberFromList(member);
    }

    markAbsent(member: any) {
        this.removeMemberFromList(member);
    }

    private removeAttendingFromMembers(attendees: any) {
        attendees.forEach((attendee: any) => {
            this.teamMembers.forEach(member => {
                if (attendee.facebookId == member.facebookId) {
                    this.removeMemberFromList(member);
                }
            });
        });
    }

    private removeMemberFromList(member: any) {
        let index = this.teamMembers.indexOf(member);
        this.teamMembers.splice(index, 1);
    }

    private formatMonth(month: any) {
        if (month < 10)
            return "0" + month.toString();
        else
            return month.toString();
    }

    private extractAttendanceData() {
        this.attenChartLabels = this.currentMonthAttendance.map((element: any) => {
            return element._date_;
        });

        this.maleAttendees = this.currentMonthAttendance.map((element: any) => {
            return element.maleAttendees;
        });

        this.femaleAttendees = this.currentMonthAttendance.map((element: any) => {
            return element.femaleAttendees;
        });
    }

    private parseDate(date: any) {
        return { // Parse from YYYY-MM-DD
            day: date.slice(8),
            month: date.slice(5, 7),
            year: date.slice(0, 4)
        };
    }

    private extractAttendees(currentMonthAttendance: any, date: { day: any; month: any; year: any }) {
        let attendees = this.getDayOfMonthAttendees(currentMonthAttendance, date);
        if (attendees) // Attendees exist
            return attendees;
        else // Attendees don't exist
            return [];
    }

    private getDayOfMonthAttendees(currentMonthAttendance: any, date: { day: any; month: any; year: any }) {
        for (let dayOfMonth of currentMonthAttendance) {
            if ((dayOfMonth._date_.day === date.day || (dayOfMonth._date_.day === "0" + date.day)) &&
                dayOfMonth._date_.month === date.month &&
                dayOfMonth._date_.year === date.year) {
                return dayOfMonth.attendees;
            }
        }
    }

    // lineChart
    public lineChartData: Array<any> = [
        {data: [65, 59, 80, 81, 56, 55, 40], label: 'Male'},
        {data: [28, 48, 40, 19, 86, 27, 90], label: 'Female'},
    ];
    public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

}
