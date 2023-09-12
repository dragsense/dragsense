const withPlugins = require("next-compose-plugins");
//const withAntdLess = require('next-plugin-antd-less');
const withImages = require('next-images');


module.exports = withPlugins([
  [withImages()], // Use the `next-images` plugin
  {
    async headers() {
      return []
    },
  },
]);