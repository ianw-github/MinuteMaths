/* global console */

/**
 * Returns a Number representing the amount of milliseconds elapsed since a reference instant.
 * @function getPerformanceTime
 * @private
 * @returns {Number} A TimeStamp, measured in milliseconds
 */
function getPerformanceTime(){
  return window.performance ? window.performance.now() : Date.now();
}

/**
 *
 * @param el
 * @param duration
 * @returns {HTMLSpanElement}
 */
export function createTimer(el, duration=30){

  let counter = document.createElement('span');
  counter.id = 'countDown';
  counter.innerText = duration;
  counter.dataset.duration = duration * 1000;
  el.appendChild(counter);
  console.log("createTimer", el, duration);
  return counter;
}


/**
 *
 * @param el
 * @param complete
 * @returns {number}
 */
export function startTimer(el, complete){

  let startTime = getPerformanceTime();
  let duration = el.dataset.duration;
  el.dataset.startTime = '' + startTime;
  console.log("startTimer", el);

  let timerId = setInterval(() => {
    let elapsedTime = getPerformanceTime() - startTime;
    let count = (duration - elapsedTime)/1000;
    console.log(`timer: elapsedTime ${elapsedTime} , count ${count}`);

    if (count < 0){
      count = 0;
    }
    el.innerText = count.toFixed(2);
    if (count === 0 ) {
      clearInterval(timerId);
      complete(el);
    }
  }, 250);
  return timerId;
}

export function resetTimer(el, duration=30){

  console.log(this.toString(), "createTimer", el, duration);
  return true;
}
