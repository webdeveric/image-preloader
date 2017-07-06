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
      const props = [ 'settings', 'loaded', 'image', 'error' ];

      for ( const prop of props ) {
        if ( ! tick.hasOwnProperty( prop ) ) {
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

  describe('.load()', () => {

    it('should load an image', done => {
      let preloader = new Preloader();

      preloader.load( images[0] ).then( tick => {
        expect(tick).toEqual( jasmine.objectContaining({
          settings: jasmine.any( Object ),
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
        expect( tick.settings.src ).toBe( notImages[0] );
        expect( tick.loaded ).toBe( false );
        expect( tick.image ).toBeNull();
        expect( tick.error ).toEqual( jasmine.any( Error ) );

        done();
      }, done.fail );
    });

  });

  describe('.start()', () => {

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

    it('should throw an error', done => {
      let preloader = new Preloader( { images: false });

      preloader.start().then( done.fail, error => {
        expect(error).toEqual( jasmine.any( Error ) );

        done();
      });
    });

  });

  describe('images setting', () => {

    it('should accept objects and strings', done => {

      let preloader = new Preloader( {
        images: [
          images[ 0 ],
          { src: images[ 0 ] },
          { srcset: `${images[ 0 ]} 1x, ${images[ 1 ]} 2x` },
        ],
        timeout: jasmine.DEFAULT_TIMEOUT_INTERVAL / 2
      } );

      preloader.start().then( ticks => {
        ticks.forEach( tick => {
          expect(tick).toEqual( looksLikeTickObject );
        });

        done();
      }, done.fail );

    });

    describe('crossOrigin', () => {

      it('should default to empty string', done => {
        let preloader = new Preloader( { images } );

        preloader.start().then( ticks => {
          ticks.forEach( tick => {
            expect(tick.settings.crossOrigin).toEqual('');
          });

          done();
        }, done.fail );

      });

      it('should use credentials', done => {

        let preloader = new Preloader( {
          images: [
            {
              src: images[ 0 ],
              crossOrigin: 'use-credentials'
            }
          ]
        } );

        preloader.start().then( ticks => {
          ticks.forEach( tick => {
            expect(tick.settings.crossOrigin).toEqual( 'use-credentials' );

            expect(tick.settings.crossOrigin).toEqual( tick.image.crossOrigin );
          });

          done();
        }, done.fail );

      });

    });
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
