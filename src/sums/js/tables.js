/* global console */
//import template from '../../../target/tmp/sums/pug/displayForm.pug.js';
//import {template as formTemplate} from '../../../target/tmp/sums/pug/displayForm.pug.js';
import pug from 'pug-runtime';
let template = require('../../../target/tmp/sums/pug/displayTable.pug.js');
let formTemplate = require('../../../target/tmp/sums/pug/displayForm.pug.js');
window.pug = pug;


/**
 * Adds equality method to Array prototype
 */
function createArrayIsEqualTo(){

  Array.prototype.isEqualTo = function(array){
    if (!array) {
      return false;
    }

    if (this.length !== array.length) {
      return false;
    }

    for (let i = 0; i < this.length; i++){
      if (this[i] instanceof Array && array[i] instanceof Array){
        if (!this[i].isEqualTo(array[i])) {
          return false;
        }
      } else {
        if (this[i] !== array[i]){
          return false;
        }
      }
    }
    return true;
  };
  Object.defineProperty(Array.prototype, "isEqualTo", {enumerable: false});
}


/**
 *
 * @param {Array} numbers
 * @param count
 * @returns {Array}
 */
function generateTimesTable(numbers, count=12){

  let table = [];

  numbers.forEach((number) => {
    for(let i = 1; i <= count; i++){
      table.push([i, number, i * number]);
    }
  });


  return table;
}

/**
 *
 * @param numbers
 * @param count
 * @returns {Array}
 */
function generateAdditionTable(numbers, count=12){

  let table = [];

  numbers.forEach((number) => {
    for(let i = 1; i <= count; i++){
      table.push([i, number, i + number]);
    }
  });

  return table;
}

/**
 *
 * @param numbers
 * @returns {Array}
 */
function generateNumberBondsTable(numbers){

  let table = [];

  numbers.forEach((number) => {
    for(let i = 0; i <= number; i++){
      table.push([i, number-i, number]);
    }
  });

  return table;
}

/**
 * Generates  table of the requested type from the numbers passed
 *
 * @param operator - type of table (multiplication, addition, number bonds)
 * @param numbers
 * @param count
 * @returns {Array}
 */
export function generateTable(operator = 'x', numbers, count=12){

  if (operator === '+'){
    return generateAdditionTable(numbers, count);
  } else if (operator.toLowerCase() === 'n'){
    return generateNumberBondsTable(numbers);
  }

  return generateTimesTable(numbers, count);
}

/**
 *
 * @param el
 * @returns {*}
 */
function getNumberFromInput(el){
  let num;

  if (el) {
    num = Number(el.value);
  }
  return num;
}

/**
 *
 * @param questionIndex
 * @returns {Array}
 */
function getAnswer(questionIndex){

  const el = document.getElementById(`question-${questionIndex}`);
  let answers = [];
  let inputs = el.getElementsByTagName('input');

  for (let i = 0; i < inputs.length; i++){
    answers.push(getNumberFromInput(inputs[i]));
  }
  return answers; //inputs.map((el) => el.value);
}

/**
 *
 * @param userSum
 * @param generatedSum
 * @returns {boolean}
 */
export function checkResult(userSum, generatedSum){

  return userSum.isEqualTo(generatedSum);
}

/**
 *
 * @returns {Array}
 */
function getAnswers(table){
  let answers = [];

  for (let i = 0; i < table.length; i++){
    answers.push(getAnswer(i));
  }

  return answers;
}

/**
 *
 * @param el
 * @param table
 */
export function display(el, table, operator){

  let answers = getAnswers(table);
  let results = answers.map((ans, idx) => {
    return ans.isEqualTo(table[idx]);
  });
  el.innerHTML = template(
    {data: {
      table: table,
        results: results,
        operator: (operator === 'n') ? '+' : operator}
    });
}

/**
 *
 * @param el
 * @param table
 */
export function displayForm(el, table, operator){

  //console.log(df);
  try {
    el.innerHTML = formTemplate(
      {data: {
        table: table,
        operator: (operator === 'n') ? '+' : operator}
      });
  } catch (e) {
    console.log(e);
  }
}

createArrayIsEqualTo();