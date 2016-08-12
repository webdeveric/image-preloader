import 'babel-polyfill';
import Preloader from '../../src/ImagePreloader';

describe('ImagePreloader', () => {

  const images = [
    '/images/Ginger.jpg',
    '/images/flowers.jpg',
    '/images/mountains.jpg',
  ];

  const notImages = [
    '/images/not-an-image.jpg',
  ];

  const looksLikeTickObject = {
    asymmetricMatch: tick => {
      const props = [ 'url', 'loaded', 'image', 'error' ];

      for ( let i = 0, l = props.length ; i < l ; ++i ) {
        if ( ! tick.hasOwnProperty( props[ i ] ) ) {
          return false;
        }
      }

      return true;
    }
  };

  describe('constructor', () => {

    it('should use default constructor arguments', () => {
      let preloader = new Preloader();

      expect( Array.isArray( preloader.images ) ).toBe( true );
      expect( preloader.timeout ).toEqual( jasmine.any( Number ) );
      expect( preloader.beforeStart ).toEqual( jasmine.any( Function ) );
      expect( preloader.onProgress ).toEqual( jasmine.any( Function ) );
    });

    it('should accept an Array of images', () => {
      let preloader = new Preloader( { images } );

      expect( Array.isArray( preloader.images ) ).toBe( true );
    });

    it('should accept a Set of images', () => {
      let preloader = new Preloader( {
        images: new Set( images )
      });

      expect( preloader.images ).toEqual( jasmine.any( Set ) );
    });

  });

  it('should load an image', done => {
    let preloader = new Preloader();

    preloader.load( images[0] ).then( tick => {
      expect(tick).toEqual( jasmine.objectContaining({
        url: images[0],
        loaded: true,
        image: jasmine.any( Image ),
        error: null
      }));

      done();
    }, done.fail );
  });

  it('should fail when not loading an image', done => {
    let preloader = new Preloader();

    preloader.load( notImages[0] ).then( tick => {
      expect( tick.url ).toBe( notImages[0] );
      expect( tick.loaded ).toBe( false );
      expect( tick.image ).toBeNull();
      expect( tick.error ).toEqual( jasmine.any( Error ) );

      done();
    }, done.fail );
  });

  it('should load multiple images', done => {
    let preloader = new Preloader( { images } );

    preloader.start().then( ticks => {
      ticks.forEach( tick => {
        expect(tick).toEqual(jasmine.objectContaining({
          loaded: true,
          image: jasmine.any( Image ),
          error: null
        }));
      });

      done();
    }, done.fail );
  });

  describe('beforeStart callback', () => {

    it('should be able to prevent loading with beforeStart', done => {
      let beforeStart = jasmine.createSpy('beforeStart').and.returnValue(false);

      let preloader = new Preloader( { beforeStart } );

      preloader.start().then( done.fail, error => {
        expect(error).toEqual( jasmine.any( Error ) );

        done();
      });

      expect(beforeStart).toHaveBeenCalled();
    });

  });

  describe('onProgress callback', () => {

    it('should call onProgress', done => {
      let onProgress = jasmine.createSpy('onProgress');

      let preloader = new Preloader( { images, onProgress } );

      preloader.start().then( () => {
        expect(onProgress.calls.count()).toEqual(images.length);

        done();
      }, done.fail );
    });

    it('should pass a tick and preloader objects to onProgress', done => {
      let onProgress = jasmine.createSpy('onProgress');

      let preloader = new Preloader( { images, onProgress } );

      preloader.start().then( () => {
        expect(onProgress).toHaveBeenCalledWith( looksLikeTickObject, preloader );

        done();
      }, done.fail );
    });

  });

  describe('.length', () => {

    it('should return the size of the images property', () => {
      let imagesArray = new Preloader( { images } );

      let imagesSet = new Preloader( {
        images: new Set( images )
      });

      expect( imagesArray.length ).toBe( images.length );
      expect( imagesSet.length ).toBe( images.length );
    });

  });

  describe('.completed', () => {

    it('should return the number of completed ticks', done => {
      let preloader = new Preloader( { images } );

      preloader.start().then( () => {
        expect(preloader.completed).toBe( images.length );

        done();
      }, done.fail );

    });

  });

  describe('.percentComplete', () => {

    it('should return a float between 0 and 1', done => {
      let preloader = new Preloader( {
        images,
        onProgress: ( tick, loader ) => {
          expect( loader.percentComplete >= 0 && loader.percentComplete <= 1 ).toBe( true );
        }
      });

      preloader.start().then( done, done.fail );
    });

  });

});
