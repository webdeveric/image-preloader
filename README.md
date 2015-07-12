# Image Preloader

Preload images using promises.

## Prerequisites

Preloader uses [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), which are a part of ECMAScript 2015 (ES6), so you'll need a polyfill for older browsers.

## Example Usage

```javascript
var loader = new Preloader( { images: [] } );

loader.start().then( function( results ) {
  console.log( results );
}, function( error ) {
  console.log( error );
});
```

## Settings

The constructor takes one argument, which is an object of settings.

### images

The `images` setting can be any iterable that has a `forEach` method, like Array or Set.

```javascript
var myImages = [
  'eric.jpg',
  'ginger.jpg'
];

var loader = new Preloader( { images: myImages } );
```

```javascript
var myImages = new Set();
myImages.add('eric.jpg');
myImages.add('ginger.jpg');
myImages.add('ginger.jpg');

var loader = new Preloader( { images: myImages } );
```

### timeout

Number of milliseconds. The default is 30000.

```javascript
var loader = new Preloader( {
  images: myImages,
  timeout: 10000
} );
```

### beforeStart

`beforeStart` is optional and defaults to an empty function.

```javascript
var loader = new Preloader( {
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
The `tick` object contains three fields that let you know what happened.
`preloader` is the `Preloader` instance, which you can use to check the percent complete.

**tick object**

```javascript
{
  loaded: Boolean,
  image: Image object or null,
  error: Error object or null
}
```

**Example: Setting progress bar**

```javascript
var loader = new Preloader( {
  images: myImages,
  onProgress: function( tick, preloader ) {
    if ( tick.loaded ) {
      console.log( tick.image );
    } else {
      console.log( tick.error );
    }

    // You can set a progress bar value using preloader.percentComplete
    var progress = document.getElementById('preload-progress');
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
