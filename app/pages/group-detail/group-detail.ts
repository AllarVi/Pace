import {Page, NavParams} from "ionic-angular";
import {CHART_DIRECTIVES} from "ng2-charts/ng2-charts";
import {UserData} from "../../providers/user-data";
// import {CHART_DIRECTIVES} from './charts';

@Page({
    templateUrl: 'build/pages/group-detail/group-detail.html',
    directives: [CHART_DIRECTIVES]

})
export class GroupDetailPage {

    team = null;

    teamMembers = null;

    teamName = null;

    currentDate = null;

    constructor(private navParams:NavParams, private userData:UserData) {

        this.currentDate = new Date();

        this.team = this.navParams.get('team');
        this.teamName = this.team.teamName;

        this.userData.getTeamScores(this.team.id).then((teamMembers) => {
            this.teamMembers = teamMembers;
        });

        this.lineChartColours = this.getColours(['#FF9800', '#49cd97', '#ef2e0a']);
    }

    // color stuff
    rgba(colour, alpha) {
        return 'rgba(' + colour.concat(alpha).join(',') + ')';
    }

    hexToRgb(hex) {
        var bigint = parseInt(hex.substr(1), 16),
            r = (bigint >> 16) & 255,
            g = (bigint >> 8) & 255,
            b = bigint & 255;
        console.log("Hex is " + hex, "Big int is ", bigint);

        return [r, g, b];
    }

    convertColour(colour) {
        if (typeof colour === 'object' && colour !== null) return colour;
        if (typeof colour === 'string' && colour[0] === '#') return this.getColour(this.hexToRgb(colour.substr(1)));
    }

    getColour(colour) {
        return {
            fillColor: this.rgba(colour, 0.2),
            strokeColor: this.rgba(colour, 1),
            pointColor: this.rgba(colour, 1),
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: this.rgba(colour, 0.8)
        };
    }

    getColours(colours) {
        let _clrs = [];
        colours.forEach(
            color => {
                _clrs.push(this.getColour(this.hexToRgb(color)));
            }
        );
        return _clrs;
    }

    // lineChart
    private lineChartData:Array<any> = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    private lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    private lineChartSeries:Array<any> = ['Men', 'Women'];
    private lineChartOptions:any = {
        animation: true,
        responsive: true,
        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
    };

    //'#FF9800','#49cd97','#ef2e0a'
    private lineChartColours:Array<any>;
    private lineChartLegend:boolean = true;
    private lineChartType:string = 'Line';

    private randomize() {
        let _lineChartData = [];
        for (let i = 0; i < this.lineChartData.length; i++) {
            _lineChartData[i] = [];
            for (let j = 0; j < this.lineChartData[i].length; j++) {
                _lineChartData[i].push(Math.floor((Math.random() * 100) + 1));

            }
        }
        this.lineChartData = _lineChartData;
    }

    // events
    chartClicked(e:any) {
        console.log(e);
    }

    chartHovered(e:any) {
        console.log(e);
    }

//    Attendance chart
    private attendanceChartData:Array<any> = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    private attendanceChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    private attendanceChartSeries:Array<any> = ['Men', 'Women'];

    // events
    attendanceChartClicked(e:any) {
        console.log(e);
    }

    attendancechartHovered(e:any) {
        console.log(e);
    }

}
