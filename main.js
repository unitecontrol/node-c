(function() {
  'use strict';

  var os = require('os'),
      fs = require('fs'),
      ffi = require('ffi'),
      cdefs = require('cdefs'),
      exec = require('exec-sync');

  /**
   * node-c
   * Embed C functions in JavaScript comments.
   * @param {String} path
   * @param {Boolean} cache
   **/
  module.exports = function(path, cache) {
    // extract c code
    var file = fs.readFileSync(path, 'utf8'),
        src = (file.match(/\/\*\?c([\s\S]*?)\?\*\//g) || []),
        spec = {},
        out = [];

    src.forEach(function(snippet) {
      var lines = snippet.split(/\n/g);
      lines.forEach(function(line) {
        line = line.replace(/\/\*\?c|\?\*\//g, '');
        out.push(line.trim());
      });
    });

    out = out.join('\n');
    var defs = cdefs(out),
        def,
        args,
        arg;
    for(var name in defs) {
      args = [];
      def = defs[name];
      for(var i in def.arguments) {
        arg = def.arguments[i];
        if((arg.type.match(/\*/g) || []).length > 1)
          args.push('pointer');
        else if(arg.type.indexOf('char*') !== -1)
          args.push('string');
        else
          args.push(arg.type);
      }

      spec[name] = [def.returns, args];
    }

    var f = path.split(/\//g);
    f = f.pop(); // last path element is filename
    f = f.split('.').shift(); // remove extension from filename

    if(!fs.existsSync('bindings'))
      exec('mkdir bindings');

    // compile
    switch(os.platform()) {
      case 'darwin':
        if(cache === true && fs.existsSync('bindings/' + f + '.dylib'))
          break;

        exec('echo "' + out + '" | gcc -dynamiclib -undefined suppress -flat_namespace -o bindings/' + f + '.dylib -xc -');
        break;
      case 'linux':
        if(cache === true && fs.existsSync('bindings/' + f + '.so'))
          break;
        exec('echo "' + out + '" | gcc -shared -fpic -o bindings/' + f + '.so -xc -');
        break;
    }

    return ffi.Library('bindings/' + f, spec);
  };
}());
