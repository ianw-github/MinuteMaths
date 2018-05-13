/*global console */
import * as timing from '../../timing/js/timing.js';
import * as timesTables from '../../sums/js/timesTables.js';


const times12 = timesTables.generateTimesTable(12);
//timesTables.display(document.querySelector('#results'), times12);

/**
 * Fires when timer countdown finishes
 *
 * @param el
 */
function timerComplete(el){
  console.log(this, "Countdown complete", el);
  timesTables.display(document.querySelector('#results'), times12);
}

/**
 * Module entry point
 */
function init(){

  const timer = timing.createTimer(document.querySelector('#timer'), 5);

  timesTables.displayForm(document.querySelector('#minuteMaths'), times12);

  timing.startTimer(timer, timerComplete);
}


init();