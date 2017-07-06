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
        rules: [
          {
            enforce: 'pre',
            test: /\.js?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'eslint-loader',
                options: {
                  configFile: 'test/.eslintrc',
                },
              },
            ],
          },
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
          },
        ]
      },
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
