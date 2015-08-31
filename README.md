# node-c

Embed C functions in JavaScript comments.

### Flow

1. Extract C source from comments formatted with ```/*?c ?*/```
2. Extract a function type specification using [cdefs](https://github.com/mateogianolio/cdefs).
3. Compile the C source with ```gcc``` into a dynamic library.
4. Use [node-ffi](https://github.com/node-ffi/node-ffi) to link the dynamic library to C function bindings using the generated type specification.


### Warning
> There is non-trivial overhead associated with FFI calls. Comparing a hard-coded binding version of ```strtoul()``` to an FFI version of ```strtoul()``` shows that the native hard-coded binding is orders of magnitude faster. So don't just use the C version of a function just because it's faster. There's a significant cost in FFI calls, so make them worth it. &mdash; [node-ffi/README.md](https://github.com/node-ffi/node-ffi/blob/master/README.md)

### Install

```bash
$ npm install node-c
```

### Syntax

```javascript
// filename is the file in which to look for c functions
// (__filename for current file)
require('node-c')(<filename>);
```

```javascript
var c = require('node-c')(__filename),

/*?c
// simple addition example
int sum(int a, int b) {
  return a + b;
}
?*/

c.sum(2, 5) // => 7
```

### Contribute

Contributions are welcome.
