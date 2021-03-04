const path = require('path');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      'pages': path.resolve(__dirname, 'src/pages'),
      'routes': path.resolve(__dirname, 'src/routes'),
      'store': path.resolve(__dirname, 'src/store'),
      'services': path.resolve(__dirname, 'src/shared/services'),
      'components': path.resolve(__dirname, 'src/shared/components'),
      'queries': path.resolve(__dirname, 'src/shared/queries')
    },
  };
  return config;
}
