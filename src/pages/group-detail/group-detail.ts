import {NavParams} from "ionic-angular";
import {UserData} from "../../providers/user-data";
import {Component} from "@angular/core";

@Component({
    selector: 'page-group-detail',
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

    constructor(private navParams: NavParams, private userData: UserData) {

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
        let month = this.parseMonth(newValue.month.value);

        let date = {
            day: newValue.day.text,
            month: month,
            year: newValue.year.text
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

    private parseMonth(newValue: any) {
        if (newValue < 10)
            return "0" + newValue.toString();
        else
            return newValue.toString();
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

    private extractAttendees(currentMonthAttendance: any, date: { day: number; month: number; year: number }) {
        let attendees = this.getDayOfMonthAttendees(currentMonthAttendance, date);
        if (attendees) // Attendees exist
            return attendees;
        else // Attendees don't exist
            return [];
    }

    private getDayOfMonthAttendees(currentMonthAttendance: any, date: { day: number; month: number; year: number }) {
        for (let dayOfMonth of currentMonthAttendance) {
            if (dayOfMonth._date_.day === date.day &&
                dayOfMonth._date_.month === date.month &&
                dayOfMonth._date_.year === date.year) {
                return dayOfMonth.attendees;
            }
        }
    }

}
