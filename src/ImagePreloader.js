const DEFAULT_TIMEOUT = 30000;

function noop(){}

export function prefetch( url )
{
  const head = document.getElementsByTagName('head')[0];

  if ( head ) {
    const link = document.createElement('link');

    link.setAttribute('rel', 'prefetch');
    link.setAttribute('href', url );

    head.appendChild( link );

    return link;
  }

  return false;
}

export function loadImage( url, timeout = DEFAULT_TIMEOUT )
{
  function clearEvents( img ) {
    img.onload = img.onabort = img.onerror = null;
  }

  return new Promise( function( resolve, reject ) {

    if ( ! url ) {
      reject( {
        loaded: false,
        image: null,
        error: new Error( 'URL is required' )
      } );

      return;
    }

    const img = new Image(),
          timer = setTimeout( () => {

            reject( {
              loaded: false,
              image: null,
              error: new Error( `${url} timed out` )
            } );

          }, timeout );

    img.onload = function() {

      clearTimeout( timer );

      clearEvents( this );

      if ( this.naturalWidth > 0 && this.naturalHeight > 0 && this.complete ) {

        resolve( {
          loaded: true,
          image: this,
          error: null
        } );

      } else {

        reject( {
          loaded: true,
          image: this,
          error: new Error( `${this.src} loaded but is broken` )
        } );

      }

    };

    img.onerror = img.onabort = function() {

      clearTimeout( timer );

      clearEvents( this );

      reject( {
        loaded: false,
        image: null,
        error: new Error( `${this.src} could not be loaded` )
      } );

    };

    img.src = url;
  });
}

export class Preloader
{
  constructor( {
    images      = [],
    timeout     = DEFAULT_TIMEOUT,
    beforeStart = noop,
    onProgress  = noop
  } )
  {
    this.images      = images;
    this.timeout     = timeout;
    this.beforeStart = beforeStart;
    this.onProgress  = onProgress;

    this.numberCompleted = 0;

    if ( typeof Promise === 'undefined' ) {
      console.error('Promise is undefined. Please provide a polyfill.');
    }
  }

  load( url )
  {
    const p = this.progress.bind( this );

    return loadImage( url, this.timeout ).then( p, p );
  }

  progress( tick )
  {
    ++this.numberCompleted;
    this.onProgress( tick, this );
    return tick;
  }

  start()
  {
    if ( typeof Promise !== 'undefined' ) {

      try {

        if ( this.beforeStart( this ) === false ) {
          throw new Error('Preloader start canceled by beforeStart');
        }

        this.numberCompleted = 0;

        if ( this.images && typeof this.images.forEach === 'function' ) {

          let promises = [];

          this.images.forEach( ( url ) => {
            promises[ promises.length ] = this.load( url );
          });

          return Promise.all( promises );

        }

        throw new Error('Unable to start. Does the images object have a forEach method?');

      } catch ( error ) {

        return Promise.reject( error );

      }

    }

    return {
      then: noop,
      catch: noop
    };
  }

  get completed()
  {
    return this.numberCompleted;
  }

  get length()
  {
    if ( this.images ) {
      let images = this.images;

      if ( images.length !== void 0 ) {
        return images.length;
      } else if ( images.size !== void 0 ) {
        // size is a property on Set objects.
        return images.size;
      }
    }

    return 0;
  }

  get total()
  {
    return this.length;
  }

  get percentComplete()
  {
    return this.length === 0 ? 0 : this.numberCompleted / this.length;
  }
}

export default Preloader;
