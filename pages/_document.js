import Document, { Html, Head, Main, NextScript } from "next/document"

export default class MyDocument extends Document {

   static async getInitialProps(ctx) {
      const isHomepage = ctx.req?.url === '/';

      const initialProps = await Document.getInitialProps(ctx);
      return { ...initialProps, isHomepage };
  }

   render() {
      const { isHomepage } = this.props;
      return (
         <Html>
            <Head>
               <link rel="icon" href="/favicon.ico" sizes="any" />
               <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800;900&family=Kalam:wght@700&display=swap" rel="stylesheet" />

               {isHomepage && (<>
                  <link rel="stylesheet" href="/assets/css/fontawesome.min.css" />
                  <link rel="stylesheet" href="/assets/css/elegant-icons.min.css" />
                  <link rel="stylesheet" href="/assets/css/animate.min.css" />
                  <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
                  <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
                  <link rel="stylesheet" href="/assets/css/slick.css" />
                  <link rel="stylesheet" href="/assets/css/slick-theme.css" />
                  <link rel="stylesheet" href="/assets/css/jquery.fancybox.min.css" />
                  <link rel="stylesheet" href="/assets/css/style.css" />
                  <link rel="stylesheet" href="/assets/css/responsive.css" />
               </>)}

            </Head>
            <body>
               <Main />

               <NextScript />

               {isHomepage && (<>
                  <script src="/assets/js/plugin/jquery-3.5.0.min.js"></script>
                  <script src="/assets/js/plugin/popper.min.js"></script>
                  <script src="/assets/js/plugin/bootstrap.min.js"></script>
                  <script src="/assets/js/plugin/TweenMax.min.js"></script>
                  <script src="/assets/js/plugin/ScrollMagic.js"></script>
                  <script src="/assets/js/plugin/animation.gsap.js"></script>
                  <script src="/assets/js/plugin/debug.addIndicators.min.js"></script>
                  <script src="/assets/js/plugin/squareCountDownClock.js"></script>
                  <script src="/assets/js/plugin/wow.min.js"></script>
                  <script src="/assets/js/plugin/jquery.nice-select.min.js"></script>
                  <script src="/assets/js/plugin/jquery.fancybox.min.js"></script>
                  <script src="/assets/js/plugin/swiper-bundle.min.js"></script>
                  <script src="/assets/js/plugin/jquery.waypoints.min.js"></script>
                  <script src="/assets/js/plugin/jquery.counterup.min.js"></script>
                  <script src="/assets/js/plugin/jquery.paroller.js"></script>
                  <script src="/assets/js/script.js"></script>
               </>)}
            </body>
         </Html>
      )
   }
}