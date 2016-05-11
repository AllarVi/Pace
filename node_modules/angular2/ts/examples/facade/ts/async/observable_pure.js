"use strict";
// #docregion Observable
var Rx_1 = require('rxjs/Rx');
var map_1 = require('rxjs/operator/map');
var obs = new Rx_1.Observable(function (sub) {
    var i = 0;
    setInterval(function () { return sub.next(++i); }, 1000);
});
map_1.map.call(obs, function (i) { return (i + " seconds elapsed"); }).subscribe(function (msg) { return console.log(msg); });
// #enddocregion
//# sourceMappingURL=observable_pure.js.map