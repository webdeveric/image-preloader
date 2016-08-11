module.exports = function(config) {
  config.set({
    frameworks: [
      'jasmine',
    ],

    browsers: [
      'PhantomJS',
      // 'Chrome',
      // 'Firefox',
      // 'Safari',
    ],

    files: [
      {
        pattern: './images/*.jpg',
        watched: false,
        included: false,
        served: true,
        nocache: false
      },
      'test-context.js',
    ],

    proxies: {
      '/images/': '/base/images/'
    },

    preprocessors: {
      'test-context.js': [ 'webpack' ]
    },

    webpack: {
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            loader: 'eslint-loader',
            exclude: /node_modules/
          }
        ],
        loaders: [
          {
            test: /\.js/,
            loader: 'babel-loader',
            exclude: /node_modules/
          }
        ]
      },
      eslint: {
        configFile: 'test/.eslintrc'
      },
      watch: true
    },

    webpackServer: {
      noInfo: true
    },

    reporters: [
      'progress',
    ],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    singleRun: false
  });
};
