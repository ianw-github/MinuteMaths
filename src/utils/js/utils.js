/**
 * Utilities
 *
 * @module
 */


function interpolate(start, end, steps, count) {
  // let s = start,
  //   e = end,
  //   final = s + (((e - s) / steps) * count);
  // return Math.floor(final);
  return Math.floor(start + (((end - start) / steps) * count));
}

function Color(_r, _g, _b) {
  let r, g, b;
  const setColors = function(_r, _g, _b) {
    r = _r;
    g = _g;
    b = _b;
  };

  setColors(_r, _g, _b);
  this.getColors = function() {
    let colors = {
      r: r,
      g: g,
      b: b
    };
    return colors;
  };
}

function ColourGradient(_startColour, _endColour, _steps){
  let startColour, endColour, steps;
  const setValues = function(_startColour, _endColour, _steps){
    startColour = _startColour;
    endColour = _endColour;
    steps = _steps;
  };
  setValues(_startColour, _endColour, _steps);

  this.getValues = function() {
    let values = {
      startColour: startColour,
      endColour: endColour,
      steps: steps
    };
    return values;
  };

  this.getStepColour = function(val) {

    const startColors = startColour.getColors(),
      endColors = endColour.getColors();
    const r = interpolate(startColors.r, endColors.r, steps, val);
    const g = interpolate(startColors.g, endColors.g, steps, val);
    const b = interpolate(startColors.b, endColors.b, steps, val);

    //console.log("steps, val", steps, val);
    return new Color(r,g,b);
  };
}


export function RedGreenGradient(_steps){

  const red = new Color(232, 9, 26),
    green = new Color(6, 170, 60),
    steps = _steps;

  let gradient = new ColourGradient(red, green, steps);

  this.getStepColour = function(val) {
    return gradient.getStepColour(val);
  };
}

// function RedGreenGradient2(_steps){
//
//   let red = new Color(232, 9, 26),
//     white = new Color(255, 255, 255),
//     green = new Color(6, 170, 60),
//     start = green,
//     end = red,
//     steps = _steps;
//
//   this.getStepColour = function(val) {
//
//     const startColors = start.getColors(),
//       endColors = end.getColors();
//     const r = interpolate(startColors.r, endColors.r, steps, val);
//     const g = interpolate(startColors.g, endColors.g, steps, val);
//     const b = interpolate(startColors.b, endColors.b, steps, val);
//
//     return new Color(r,g,b);
//   };
// }
