"use strict";
// #docregion Observable
var Rx_1 = require('rxjs/Rx');
var obs = new Rx_1.Observable(function (obs) {
    var i = 0;
    setInterval(function () { obs.next(++i); }, 1000);
});
obs.subscribe(function (i) { return console.log(i + " seconds elapsed"); });
// #enddocregion
//# sourceMappingURL=observable.js.map