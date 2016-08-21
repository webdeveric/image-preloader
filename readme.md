# Image Preloader

[![dependencies Status](https://david-dm.org/webdeveric/image-preloader/status.svg)](https://david-dm.org/webdeveric/image-preloader)
[![devDependencies Status](https://david-dm.org/webdeveric/image-preloader/dev-status.svg)](https://david-dm.org/webdeveric/image-preloader?type=dev)

Preload images using promises.

## Installation

```shell
npm install @webdeveric/image-preloader --save
```

## Prerequisites

Preloader uses [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), which are a part of ECMAScript 2015 (ES6), so you'll need a polyfill for older browsers.

## Example Usage (es2015)

```javascript
import Preloader from '@webdeveric/image-preloader';

let loader = new Preloader( { images: [
  'http://placekitten.com/200/200',
  'http://placekitten.com/400/400',
] } );

loader.start().then( results => {
  console.log( results );
}, error => {
  console.error( error );
});
```

## Settings

The constructor takes one argument, which is an object of settings.

### images

The `images` setting can be any iterable that has a `forEach` method, like Array or Set.

```javascript
let myImages = [
  'eric.jpg',
  'ginger.jpg'
];

let loader = new Preloader( { images: myImages } );
```

```javascript
let myImages = new Set();
myImages.add('eric.jpg');
myImages.add('ginger.jpg');
myImages.add('ginger.jpg');

let loader = new Preloader( { images: myImages } );
```

### timeout

Number of milliseconds. The default is 30000.

```javascript
let loader = new Preloader( {
  images: myImages,
  timeout: 10000
} );
```

### beforeStart

`beforeStart` is optional and defaults to an empty function.

```javascript
let loader = new Preloader( {
  images: myImages,
  beforeStart: function() {
    // Do some stuff here, like resetting a progress bar to zero.
    // You can abort the preloader by returning false or by throwing an error.
    return false;
  }
} );
```

### onProgress

`onProgress` is optional and defaults to an empty function.

This function is called every time an image completes or fails.

`onProgress` receives two arguments, `tick` and `preloader`.
The `tick` object contains four fields that let you know what happened.
`preloader` is the `Preloader` instance, which you can use to check the percent complete.

**tick object**

```javascript
{
  settings: Object,
  loaded: Boolean,
  image: Image object or null,
  error: Error object or null
}
```

**Example: Setting progress bar**

```javascript
let loader = new Preloader( {
  images: myImages,
  onProgress: function( tick, preloader ) {
    if ( tick.loaded ) {
      console.log( tick.image );
    } else {
      console.log( tick.error );
    }

    // You can set a progress bar value using preloader.percentComplete
    let progress = document.getElementById('preload-progress');
    progress.setAttribute('value', preloader.percentComplete );
  }
} );
```

## Properties

### length

The number of items in the `images` object.

### completed

The number of images that have loaded.

### percentComplete

This is a float between 0 and 1 that represents the percent completed.
It may be used to set the value of a progress bar.
