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
// function createArrayIsEqualTo(){
//
//   Array.prototype.isEqualTo = function(array){
//     if (!array) {
//       return false;
//     }
//
//     if (this.length !== array.length) {
//       return false;
//     }
//
//     for (let i = 0; i < this.length; i++){
//       if (this[i] instanceof Array && array[i] instanceof Array){
//         if (!this[i].isEqualTo(array[i])) {
//           return false;
//         }
//       } else {
//         if (this[i] !== array[i]){
//           return false;
//         }
//       }
//     }
//     return true;
//   };
//   Object.defineProperty(Array.prototype, "isEqualTo", {enumerable: false});
// }

function arrayIsEqualTo(array1, array2){

  if (!array1 || !array2) {
    return false;
  }

  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++){
    if (array1[i] instanceof Array && array2[i] instanceof Array){
      if (!arrayIsEqualTo(array1[i], array2[i])) {
        return false;
      }
    } else {
      if (array1[i] !== array2[i]){
        return false;
      }
    }
  }
    return true;
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
export function generateTable(operator = 'x', numbers = [2,3,4,5,6,7,8,9,10,11,12], count=12){

  if (operator === '+'){
    return generateAdditionTable(numbers, count);
  } else if (operator.toLowerCase() === 'n'){
    return generateNumberBondsTable(numbers);
  }

  return generateTimesTable(numbers, count);
}


/**
 * Gets a value from HTML element - eithe value of input element or data-value attribute for other elements
 * @param el
 * @returns {number}
 */
function getNumberFromElement(el){
  if (el.tagName.toLowerCase() === 'input'){
    return Number(el.value);
  } else {
    return Number(el.dataset.value);
  }
}

/**
 *
 * @param questionIndex
 * @returns {Array}
 */
function getAnswer(questionIndex){

  const el = document.getElementById(`question-${questionIndex}`);
  let answers = [];

  ['num1', 'num2','res'].forEach(colName => {
    let col = el.querySelector('[name=' + colName+']');
    if (col) {
      answers.push(getNumberFromElement(col));
    }
  });

  return answers;
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

  console.log("answers", answers);
  return answers;
}


/**
 * Gets an array of true/false results for question answers
 *
 * @param table - table for which answers given
 * @returns {boolean[]} true(correct)/false(incorrect) for ech answer
 */
export function getResults(table){
  return getAnswers(table)
    .map((ans, idx) => {
      return arrayIsEqualTo(ans, table[idx]);
    });
}


/**
 *
 * @param el
 * @param table
 */
export function display(el, table, operator){

  // let answers = getAnswers(table);
  // let results = answers.map((ans, idx) => {
  //   return arrayIsEqualTo(ans, table[idx]);
  // });
  el.innerHTML = template(
    {data: {
      table: table,
        results: getResults(table),
        operator: (operator === 'n') ? '+' : operator}
    });
}

/**
 *
 * @param el
 * @param table
 */
export function displayForm(el, questions, operator, table){

  const data = {data: {
      table: table,
      operator: (operator === 'n') ? '+' : operator,
    questions: questions}
  };

  console.log("data", data);
  try {
    el.innerHTML = formTemplate(data);
  } catch (e) {
    console.log(e);
  }
}

//createArrayIsEqualTo();