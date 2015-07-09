# Image Preloader

Preload images using promises.

## Prerequisites

Preloader uses [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), which are a part of ECMAScript 2015 (ES6), so you'll need a polyfill for older browsers.

## Example Usage

```javascript
var loader = new Preloader( { images: [] } );

loader.start().then( function( images ) {
  console.log( images );
});
```

## Settings

The constructor takes one argument, which is an object of settings.

- **images** Array of URLs
- **timeout** Number of milliseconds. Default: 30000
- **beforeStart** Callback function. Default: empty function
- **onProgress** Callback function. Default: empty function
