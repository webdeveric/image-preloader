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
  return new Promise( function( resolve, reject ) {

    const img = new Image(),
          timer = setTimeout( () => {

            reject( {
              loaded: false,
              image: null,
              error: new Error( `${url} timed out` )
            } );

          }, timeout );

    img.onload = function() {

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
          error: new Error( this.src + ' loaded but is broken' )
        } );

      }

      clearTimeout( timer );
    };

    img.onerror = function() {

      reject( {
        loaded: false,
        image: null,
        error: new Error( this.src + ' could not be loaded' )
      } );

      clearTimeout( timer );
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
    try {

      if ( this.beforeStart( this ) === false ) {
        return Promise.reject( new Error('Preloader start canceled by beforeStart') );
      }

      this.numberCompleted = 0;

      let promises = [];

      this.images.forEach( ( url ) => {
        promises[ promises.length ] = this.load( url );
      });

      return Promise.all( promises );

    } catch ( error ) {

      return Promise.reject( error );

    }
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
    return this.images.length === 0 ? 0 : this.numberCompleted / this.images.length;
  }
}

export default Preloader;
