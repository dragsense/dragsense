const withPlugins = require("next-compose-plugins");
//const withAntdLess = require('next-plugin-antd-less');
const withImages = require('next-images');


module.exports = withPlugins([
  [withImages()], // Use the `next-images` plugin
  {
    async headers() {
      return [
        {
          // Define custom headers here
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self' 'unsafe-eval'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; font-src  'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; frame-src 'self' autocode-editor:; img-src 'self' https: data:;connect-src 'self' *;",
            },
            // Add more custom headers as needed
          ],
        },
      ];
    },
  },
]);