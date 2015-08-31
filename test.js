(function() {
  'use strict';

  var c = require('./'),
      int_c = c(__filename),
      ext_c = c('external.js.c');

  /*?c
  // re-declare built-in functions
  double pow(double x, double y);
  double sin(double angle);
  ?*/

  console.log('2^5 =', int_c.pow(2, 5));
  console.log('sin(pi/2) =', int_c.sin(Math.PI / 2));
  console.log('10! =', ext_c.factorial(10));
}());
