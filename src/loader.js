export function prefetch( url )
{
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.setAttribute('rel', 'prefetch');
  link.setAttribute('href', url );
  head.appendChild( link );
}

export function loadImage( url )
{
  return new Promise( function( resolve, reject ) {
    var img = new Image();

    var timer = setTimeout( function() {
      reject( new Error( url + ' timed out') );
    }, 30000 );

    img.onload = function() {

      if ( this.naturalWidth > 0 && this.naturalHeight > 0 && this.complete ) {

        resolve( this );
        console.log( this.src + ' loaded' );

      } else {

        reject( new Error( this.src + ' loaded but is broken' ) );

      }

      clearTimeout( timer );
    };

    img.onerror = function() {
      reject( new Error( this.src + ' could not be loaded' ) );
    };

    img.src = url;
  });
}

function noop(){}

export default class Preloader
{
  constructor( {
    images =   [],
    timeout =  30000,
    start =    noop,
    progress = noop
  } )
  {
    this.images = images;
    this.timeout = timeout;
    this.beforeStart = start;
    this.onProgress = progress;

    this.counter = 0;
  }

  load( url )
  {
    this.images[ this.images.length ] = loadImage( url ).then( ( img ) => {
      this.progress( img );
      return img;
    }, ( error ) => {
      this.progress( error );
      return error;
    });
  }

  get numImages()
  {
    return this.images.length;
  }

  get percentComplete()
  {
    return 100/this.numImages * this.counter * this.numImages/100;
  }

  progress( img )
  {
    ++this.counter;
    this.onProgress( img, this );
  }

  start()
  {
    this.beforeStart( this );

    let promises = [];

    this.images.forEach( ( url ) => {
      promises[ promises.length ] = this.load( url );
    });

    return Promise.all( promises );
  }
}
