/**
 * Helper functions.
 *
 * @link       https://mickeyuk.github.io
 * @since      1.0.0
 */
function gHelper() { }

/** 
 * Draws a rounded rectangle using the current state of the canvas.  
 * If you omit the last three params, it will draw a rectangle  
 * outline with a 5 pixel border radius  
 * @param {Number} x The top left x coordinate 
 * @param {Number} y The top left y coordinate  
 * @param {Number} width The width of the rectangle  
 * @param {Number} height The height of the rectangle 
 * @param {Object} radius All corner radii. Defaults to 0,0,0,0; 
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false. 
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true. 
 */
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
}

/**
 * Random Range
 * 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
gHelper.RandomRange = function(min, max) {
    return game.random() * (max - min) + min;
}

/**
 * MurmurHash3's mixing function
 * 
 * @param {*} str 
 * @returns 
 */
 gHelper.xmur3 = function(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

/**
 * sfc32 is part of the PractRand random number testing suite.
 * 
 * @param {*} a 
 * @param {*} b 
 * @param {*} c 
 * @param {*} d 
 * @returns 
 */
gHelper.sfc32 = function(a, b, c, d) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}

/**
 * Mulberry32 is a simple generator with a 32-bit state, but is 
 * extremely fast and has good quality
 * 
 * @param {*} a 
 * @returns 
 */
gHelper.mulberry32 = function(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

/**
 * Pascal's Triangle.
 * 
 * @param {number} numRows  Number of rows in the triangle.
 * @returns 
 */
gHelper.Pascals = function(numRows) {
    if (numRows === 0) return [];
    if (numRows === 1) return [[1]];
    let result = [];
    for (let row = 1; row <= numRows; row++) {
        let arr = [];
        for (let col = 0; col < row; col++) {
            if (col === 0 || col === row - 1) {
                arr.push(1);
            } else {
                arr.push((result[row-2][col-1] + result[row-2][col]));
            }
        }
        result.push(arr);
    }
    return result;
}

/**
 * Random string generator.
 * 
 * @param {number} length   Length of the string.
 * 
 * @returns {string}
 */
gHelper.RandomString = function(length) {
    const availableChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = '';
    for(let i = 0; i < length; i++) {
        randomString += availableChars[Math.floor(Math.random() * availableChars.length)];
    }
    return randomString;
}

/**
 * Clamps a value between a min and max.
 * 
 * @param {number} num  The number to clamp.
 * @param {number} min  The minimum value. 
 * @param {number} max  The maximum value. 
 * 
 * @returns {number}
 */
gHelper.Clamp = function(num, min, max) {
    return Math.min(Math.max(num, min), max);
}