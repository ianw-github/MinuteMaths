/*global console */
import * as timing from '../../timing/js/timing.js';
import * as tables from '../../sums/js/tables.js';

let template = require('../../../target/tmp/minuteMaths/pug/controls.pug.js');

/**
 * Fires when timer countdown finishes
 *
 * @param el
 * @param table
 */
function timerComplete(el, table, operator){
  tables.display(el, table, operator);
}

/**
 * Deep clone of object
 *
 * @param o
 * @returns {*}
 */
function deepCopy(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
    if (o.hasOwnProperty(key)) {
      v = o[key];
      output[key] = (typeof v === "object") ? deepCopy(v) : v;
    }
  }
  return output;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 *
 * @param min
 * @param max
 * @returns {int}
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Display the test controls
 *
 * @param el - parent container element
 */
export function displayControls(el){

  try {
    el.innerHTML = template({data: {startFn: start}});
  } catch (e) {
    console.log(e);
  }
}

/**
 * Get values from input elements
 *
 * @param el - parent container element
 * @returns {{}} - map of input values
 */
function getInputValues(el){

  let values = {};
  let inputs = el.querySelectorAll('input');

  for (let i = 0; i < inputs.length; i++){
    if (inputs[i].type === 'text') {
      values[inputs[i].name] = inputs[i].value;
    } else {
      if (inputs[i].checked){
        values[inputs[i].name] = inputs[i].value;
      }
    }
  }
  console.log("Input values", values);
  return values;
}

/**
 * Reset test and results
 */
function reset(){

  document.getElementById('timer').innerHTML = '';
  document.getElementById('minuteMaths').innerHTML = '';
  document.getElementById('results').innerHTML = '';
}

/**
 * Randomly shuffle an array (in place)
 *
 * @param arr - array to shuffle
 */
function shuffle(arr){

  for (let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


/**
 * Creates a set of questions from a table
 *
 * @param table
 * @param colsToHide
 * @returns {*}
 */
function generateQuestions(table, colsToHide) {
  let questions = deepCopy(table);

  let cols = colsToHide.map((n) => Number(n)-1);

  questions.forEach((row) => {
    let rnd = getRandomInt(0, cols.length - 1);
    console.log('rnd', rnd);
    row[cols[rnd]] = '';
  });
  return questions;
}

/**
 *
 */
function start(){

  let table;
  reset();
  let values = getInputValues(document.querySelector('#controls'));
  const timer = timing.createTimer(document.querySelector('#timer'), Number(values['countdown-time']) || 30);

  let numbers = values.tables.split(',').map((num => Number(num)));

  table = tables.generateTable(values.operator, numbers, 12);
  if (values.randomize.toUpperCase() === 'Y') {
    shuffle(table);
  }
  table.splice(values['total-questions'] || 12);

  let questions = generateQuestions(table, values['cols-to-hide'].split(','));

  tables.displayForm(document.querySelector('#minuteMaths'), questions, values.operator);

  timing.startTimer(timer, () => {
    timerComplete(document.querySelector('#results'), table, values.operator);
  });
}

/**
 * Module entry point
 */
function init(){

  displayControls(document.querySelector('#controls'));

  window.mm = {start: start};
}

init();