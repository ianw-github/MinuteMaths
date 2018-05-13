/* global chai */
/*jshint expr:true*/
import * as timing from "../js/timing.js";

const expect = chai.expect;

describe("timing", () => {

  it("should create a timer",() => {
    expect(timing.createTimer(undefined, 30)).to.be.true;
  });
});