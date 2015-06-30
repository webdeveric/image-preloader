# Image Preloader

Preload images using promises.

## Example Usage

```javascript
var loader = new Preloader( { images: [] } );

loader.start().then( function( images ) {
  console.log( images );
});
```
