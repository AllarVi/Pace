"use strict";
// #docregion Observable
var Rx_1 = require('rxjs/Rx');
require('rxjs/add/operator/map');
var obs = new Rx_1.Observable(function (obs) {
    var i = 0;
    setInterval(function () { return obs.next(++i); }, 1000);
});
obs.map(function (i) { return (i + " seconds elapsed"); }).subscribe(function (msg) { return console.log(msg); });
// #enddocregion
//# sourceMappingURL=observable_patched.js.map