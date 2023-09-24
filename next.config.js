const withPlugins = require("next-compose-plugins");
//const withAntdLess = require('next-plugin-antd-less');
const withImages = require('next-images');


module.exports = withPlugins([
  [withImages()], // Use the `next-images` plugin
  {
    async headers() {
      return [
        {
          // Matching all API routes:
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; img-src *; connect-src *; font-src https://fonts.gstatic.com;  script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'  https://fonts.googleapis.com;", 
            },
          ],
        },
      ]
    },
  },
]); 

