"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ionic_angular_1 = require('ionic-angular');
// import {CHART_DIRECTIVES} from './charts';
var ng2_charts_1 = require("ng2-charts/ng2-charts");
var GroupDetailPage = (function () {
    function GroupDetailPage(navParams) {
        this.navParams = navParams;
        // lineChart
        this.lineChartData = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        this.lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        this.lineChartSeries = ['Men', 'Women'];
        this.lineChartOptions = {
            animation: true,
            responsive: true,
            multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
        };
        this.lineChartLegend = true;
        this.lineChartType = 'Line';
        this.group = this.navParams.data;
        this.lineChartColours = this.getColours(['#FF9800', '#49cd97', '#ef2e0a']);
        console.log(this.getColours(['#FF9800', '#49cd97', '#ef2e0a']));
    }
    GroupDetailPage.prototype.rgba = function (colour, alpha) {
        return 'rgba(' + colour.concat(alpha).join(',') + ')';
    };
    GroupDetailPage.prototype.hexToRgb = function (hex) {
        var bigint = parseInt(hex.substr(1), 16), r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
        console.log("Hex is " + hex, "Big int is ", bigint);
        return [r, g, b];
    };
    GroupDetailPage.prototype.convertColour = function (colour) {
        if (typeof colour === 'object' && colour !== null)
            return colour;
        if (typeof colour === 'string' && colour[0] === '#')
            return this.getColour(this.hexToRgb(colour.substr(1)));
    };
    GroupDetailPage.prototype.getColour = function (colour) {
        return {
            fillColor: this.rgba(colour, 0.2),
            strokeColor: this.rgba(colour, 1),
            pointColor: this.rgba(colour, 1),
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: this.rgba(colour, 0.8)
        };
    };
    GroupDetailPage.prototype.getColours = function (colours) {
        var _this = this;
        var _clrs = [];
        colours.forEach(function (color) {
            _clrs.push(_this.getColour(_this.hexToRgb(color)));
        });
        return _clrs;
    };
    GroupDetailPage.prototype.randomize = function () {
        var _lineChartData = [];
        for (var i = 0; i < this.lineChartData.length; i++) {
            _lineChartData[i] = [];
            for (var j = 0; j < this.lineChartData[i].length; j++) {
                _lineChartData[i].push(Math.floor((Math.random() * 100) + 1));
            }
        }
        this.lineChartData = _lineChartData;
    };
    // events
    GroupDetailPage.prototype.chartClicked = function (e) {
        console.log(e);
    };
    GroupDetailPage.prototype.chartHovered = function (e) {
        console.log(e);
    };
    GroupDetailPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/group-detail/group-detail.html',
            directives: [ng2_charts_1.CHART_DIRECTIVES]
        })
    ], GroupDetailPage);
    return GroupDetailPage;
}());
exports.GroupDetailPage = GroupDetailPage;
//# sourceMappingURL=group-detail.js.map