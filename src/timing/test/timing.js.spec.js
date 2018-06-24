/* global chai */
/*jshint expr:true*/
import * as timing from "../js/timing.js";

const expect = chai.expect;

describe("timing", () => {

  it("should create a timer with the specified duration",() => {
    const container = timing.createTimer(document.createElement('div'), 30, 'myTimer');
    expect(container).to.be.ok;
    expect(container.id).to.equal('myTimer');
    expect(container.innerText).to.equal('30');
    expect(container.dataset.duration).to.equal('30000');
  });
});