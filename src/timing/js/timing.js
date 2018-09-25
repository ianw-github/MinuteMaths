/* global console */
import * as utils from '../../utils/js/utils.js';

/**
 * Returns a Number representing the amount of milliseconds elapsed since a reference instant.
 *
 * @function getPerformanceTime
 * @private
 * @returns {Number} A TimeStamp, measured in milliseconds
 */
function getPerformanceTime(){
  return window.performance ? window.performance.now() : Date.now();
}

function updateTimer(el, remainingTime, totalTime){

  const remaining = remainingTime.toFixed(0),
    total = totalTime.toFixed(0).toLowerCase(),
    used = (total - remaining).toFixed(0);

  //console.log("remaining, total ",remaining, total);
  el.innerText = remaining + ' left of ' + total + ' seconds. ' + used + ' used.' ;
}

/**
 *
 * Creates a countdown timer
 *
 * @param el where to display timer
 * @param duration  countdown in seconds
 * @returns {HTMLSpanElement}
 */
export function createTimer(el, duration=30, name='countDown'){

  let counter = document.createElement('span');
  counter.id = name;
  counter.dataset.duration = duration * 1000;
  el.appendChild(counter);
  updateTimer(counter, 0, duration);
  console.log("createTimer", name, el, duration);
  return counter;
}

export function stopTimer(el){
  const timerId= Number(el.dataset.timerid);
  console.log("timerId", timerId, el);
  clearInterval(timerId);
}




/**
 *
 * Starts the countdown timer
 *
 * @param el
 * @param complete
 * @returns {number}
 */
export function startTimer(el, complete){

  const startTime = getPerformanceTime(),
    duration = el.dataset.duration,
    timerGradient = new utils.RedGreenGradient(duration/1000);

  el.dataset.startTime = '' + startTime;

  const timerId = setInterval(() => {
    const elapsedTime = getPerformanceTime() - startTime;
    let count = (duration - elapsedTime)/1000,
      timerColour;

    //console.log(`timer: elapsedTime ${elapsedTime} , count ${count}`);
    if (count < 0){
      count = 0;
    }
    timerColour = timerGradient.getStepColour(Math.floor(count)).getColors();
    //console.log("Colour", timerColour);

    updateTimer(el, count, duration/1000);
    //el.innerText = count.toFixed(2);
    el.style.background =  `rgb(${timerColour.r},${timerColour.g},${timerColour.b})`;
    if (count === 0 ) {
      clearInterval(timerId);
      complete(el);
    }
  }, 500);
  el.dataset.timerid = timerId;
  //console.log("timerId", timerId);
  return timerId;
}


export function resetTimer(el, duration=30){

  console.log(this.toString(), "createTimer", el, duration);
  return true;
}
