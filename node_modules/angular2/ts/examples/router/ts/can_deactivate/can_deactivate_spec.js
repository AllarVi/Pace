"use strict";
var e2e_util_1 = require('angular2/src/testing/e2e_util');
var testing_1 = require('angular2/testing');
function waitForElement(selector) {
    var EC = protractor.ExpectedConditions;
    // Waits for the element with id 'abc' to be present on the dom.
    e2e_util_1.browser.wait(EC.presenceOf($(selector)), 20000);
}
function waitForAlert() {
    var EC = protractor.ExpectedConditions;
    e2e_util_1.browser.wait(EC.alertIsPresent(), 1000);
}
describe('can deactivate example app', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    var URL = 'angular2/examples/router/ts/can_deactivate/';
    it('should not navigate away when prompt is cancelled', function () {
        e2e_util_1.browser.get(URL);
        waitForElement('note-index-cmp');
        element(by.css('#note-1-link')).click();
        waitForElement('note-cmp');
        e2e_util_1.browser.navigate().back();
        waitForAlert();
        e2e_util_1.browser.switchTo().alert().dismiss(); // Use to simulate cancel button
        testing_1.expect(element(by.css('note-cmp')).getText()).toContain('id: 1');
    });
    it('should navigate away when prompt is confirmed', function () {
        e2e_util_1.browser.get(URL);
        waitForElement('note-index-cmp');
        element(by.css('#note-1-link')).click();
        waitForElement('note-cmp');
        e2e_util_1.browser.navigate().back();
        waitForAlert();
        e2e_util_1.browser.switchTo().alert().accept();
        waitForElement('note-index-cmp');
        testing_1.expect(element(by.css('note-index-cmp')).getText()).toContain('Your Notes');
    });
});
//# sourceMappingURL=can_deactivate_spec.js.map