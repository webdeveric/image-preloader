function noop(){}

function clearEvents( img )
{
  img.onload = img.onabort = img.onerror = null;
}

function getImageSettings( img, defaultTimeout )
{
  const t = typeof img;

  let src = t === 'string' ? img : t === 'object' && img.src ? img.src : '';
  let srcset = img.srcset || '';
  let timeout = img.timeout || defaultTimeout;
  let crossOrigin = img.crossOrigin || 'anonymous';

  return { src, srcset, timeout, crossOrigin };
}

function loadImage( settings )
{
  return new Promise( ( resolve, reject ) => {

    const { src, srcset, crossOrigin, timeout } = settings;

    if ( ! src && ! srcset ) {

      reject( {
        settings,
        loaded: false,
        image: null,
        error: new Error( 'Image source is required' )
      } );

      return;
    }

    let timer = setTimeout( () => {

      reject( {
        settings,
        loaded: false,
        image: null,
        error: new Error( 'Image timed out' )
      } );

    }, timeout );

    const img = new Image();

    img.onload = function() {

      clearTimeout( timer );

      clearEvents( this );

      if ( this.naturalWidth && this.naturalHeight && this.complete ) {

        resolve( {
          settings,
          loaded: true,
          image: this,
          error: null
        } );

      } else {

        reject( {
          settings,
          loaded: true,
          image: this,
          error: new Error( 'Image loaded but is broken' )
        } );

      }

    };

    img.onerror = img.onabort = function() {

      clearTimeout( timer );

      clearEvents( this );

      reject( {
        settings,
        loaded: false,
        image: null,
        error: new Error( 'Image could not be loaded' )
      } );

    };

    img.crossOrigin = crossOrigin;

    if ( srcset ) {
      img.srcset = srcset;
    }

    if ( src ) {
      img.src = src;
    }

  });
}

export default class Preloader
{
  constructor( {
    images      = [],
    timeout     = 30000,
    beforeStart = noop,
    onProgress  = noop
  } = {} )
  {
    this.images      = images;
    this.timeout     = timeout;
    this.beforeStart = beforeStart;
    this.onProgress  = onProgress;

    this.numberCompleted = 0;

    if ( ! Promise ) {
      throw new Error('Promise is undefined. Please provide a polyfill.');
    }
  }

  load( img )
  {
    const p = this.progress.bind( this );

    return loadImage( getImageSettings( img, this.timeout ) ).then( p, p );
  }

  progress( tick )
  {
    ++this.numberCompleted;

    this.onProgress( tick, this );

    return tick;
  }

  start()
  {
    try {

      if ( this.beforeStart( this ) === false ) {
        throw new Error('Preloader start canceled by beforeStart');
      }

      this.numberCompleted = 0;

      if ( this.images && typeof this.images.forEach === 'function' ) {

        let promises = [];

        this.images.forEach( img => {
          promises[ promises.length ] = this.load( img );
        });

        return Promise.all( promises );

      }

      throw new Error('Unable to start. Does the images object have a forEach method?');

    } catch ( error ) {

      return Promise.reject( error );

    }
  }

  get completed()
  {
    return this.numberCompleted;
  }

  get length()
  {
    return this.images.length || this.images.size || 0;
  }

  get percentComplete()
  {
    const length = this.length;

    return length ? this.numberCompleted / length : 0;
  }
}
