/* global console */
//import {template as form} from '../pug/displayForm.pug.js';
//import template from '../pug/displayForm.pug.js';
//import {template as template2} from '../pug/displayTable.pug.js';
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
        if (this[i] != array[i]){
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
 * @param number
 * @param count
 * @returns {Array}
 */
export function generateTimesTable(number, count=12){

  let table = [];

  for(let i = 1; i <= count; i++){
    table.push([i, count, i * count]);
  }

  return table;
}


function getAnswer(questionIndex){

  const el = document.getElementById(`question-${questionIndex}`);

  console.log(el.getElementsByTagName('input'));
}


export function checkResult(userSum, generatedSum){

  return userSum.isEqualTo(generatedSum);
}

/**
 *
 * @param el
 * @param table
 */
export function display(el, table){

  console.log(template);
  el.innerHTML = template({data: {table: table}, results:[1,1,1,1,1,1,0,0,0,0,0,0]});
}

/**
 *
 * @param el
 * @param table
 */
export function displayForm(el, table){

  //console.log(df);
  try {
    el.innerHTML = formTemplate({data: {table: table}});
  } catch (e) {
    console.log(e);
  }
}

createArrayIsEqualTo();