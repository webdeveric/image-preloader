const DEFAULT_TIMEOUT = 30000;

function noop(){}

export function prefetch( url )
{
  let head = document.getElementsByTagName('head')[0];

  if ( head ) {
    let link = document.createElement('link');

    link.setAttribute('rel', 'prefetch');
    link.setAttribute('href', url );
    head.appendChild( link );

    return link;
  }

  return false;
}

export function loadImage( url, timeout = DEFAULT_TIMEOUT )
{
  return new Promise( function( resolve, reject ) {

    var img = new Image(),
        timer = setTimeout( function() {
          reject( new Error( url + ' timed out' ) );
        }, timeout );

    img.onload = function() {

      if ( this.naturalWidth > 0 && this.naturalHeight > 0 && this.complete ) {

        resolve( this );

      } else {

        reject( new Error( this.src + ' loaded but is broken' ) );

      }

      clearTimeout( timer );
    };

    img.onerror = function() {

      reject( new Error( this.src + ' could not be loaded' ) );

      clearTimeout( timer );

    };

    img.src = url;
  });
}

export class Preloader
{
  constructor( {
    images   = [],
    timeout  = DEFAULT_TIMEOUT,
    start    = noop,
    progress = noop
  } )
  {
    this.images      = images;
    this.timeout     = timeout;
    this.beforeStart = start;
    this.onProgress  = progress;

    this.numberCompleted = 0;
  }

  load( url )
  {
    return loadImage( url, this.timeout ).then( ( img ) => {
      this.progress( img );
      return img;
    }, ( error ) => {
      this.progress( error );
      return error;
    });
  }

  get completed()
  {
    return this.numberCompleted;
  }

  get total()
  {
    return this.images.length;
  }

  get percentComplete()
  {
    return this.completed === 0 ? 0 : this.numberCompleted / this.images.length;
  }

  progress( img )
  {
    ++this.numberCompleted;
    this.onProgress( img, this );
  }

  start()
  {
    try {

      if ( this.beforeStart( this ) === false ) {
        return Promise.reject( new Error('Preloader start canceled by beforeStart') );
      }

      let promises = [];

      this.images.forEach( ( url ) => {
        promises[ promises.length ] = this.load( url );
      });

      return Promise.all( promises );

    } catch ( error ) {

      return Promise.reject( error );

    }
  }
}

export default Preloader;
