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

    this._completed = 0;
  }

  load( url )
  {
    return loadImage( url ).then( ( img ) => {
      this.progress( img );
      return img;
    }, ( error ) => {
      this.progress( error );
      return error;
    });
  }

  get completed()
  {
    return this._completed;
  }

  get total()
  {
    return this.images.length;
  }

  get percentComplete()
  {
    return this.completed === 0 ? 0 : this._completed / this.images.length;
  }

  progress( img )
  {
    ++this._completed;
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
