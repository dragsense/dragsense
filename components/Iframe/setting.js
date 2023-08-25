
import React, { useState, useEffect, useRef } from 'react';
import { message, theme } from 'antd';
import ReactDOM from 'react-dom';

import ThemeServices from '@/lib/services/theme';
import SettingServices from '@/lib/services/setting'

const InnerComponent = ({ children, document, onLoad }) => {


  useEffect(() => {

    loadCSSStyles().then((status) => {
      onLoad('default');
    }).catch((e) => {
      message.error(e?.message || 'Something went wrong!');
    });



  }, []);

  const loadCSSStyles = async () => {
    return new Promise(async (resolve, reject) => {

      try {

        const settingRes = await SettingServices.get();
        if (settingRes?.setting)
          document.head.insertAdjacentHTML("beforeend", settingRes.setting.scripts?.head);



        let res = await ThemeServices.getFonts();
        res.fonts.forEach(async (font) => {
          const { _uid, fontFamily, fontSrc, src, isGoogleFont } = font;

          if (isGoogleFont && src) {
            const linkElement = document.createElement('div');
            linkElement.id = 'google-font-' + _uid;
            linkElement.innerHTML = src;
            document.head.appendChild(linkElement);
          }
          else
            if (Array.isArray(fontSrc)) {
              try {

                for (const src of fontSrc) {

                  const fontFace = new FontFace(fontFamily, `url(${src.src}) format('${src.format}')`);
                  await fontFace.load();
                  document.fonts.add(fontFace);


                }
              } catch (error) {
                message.error(`Failed to load ${fontFamily} font: ${error}`);
              }
            }
        });


        document.fonts.onloadingerror = () => {
        };



        document.fonts.ready.then(async function () {

        });
        const root = document.documentElement;

        for await (let font of res.fonts) {
          root.style.setProperty(font.value, font.fontFamily);
        }
        res = await ThemeServices.getColors()
        for await (let color of res.colors) {
          root.style.setProperty(color.value, color.color);
        }


        res = await ThemeServices.getStyle();

        let style = document.createElement('style');
        style.textContent = res.css;
        style.id = 'ac-stylesheet-global'
        document.head.appendChild(style);


        resolve(true);


      } catch (e) {
        reject(e?.message);
      }
    })
  }


  return children;


};

const ShadowRootComponent = ({ children }) => {
  const rootRef = useRef();

  return children;
};


export default function IFrame({ children, onLoad }) {

  const iframeRef = useRef();

  const {
    token: { colorPrimary, colorPrimaryBg, },
  } = theme.useToken();




  const [container, setConainer] = useState(null);

  useEffect(() => {
    if (!iframeRef.current)
      return;

    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    setConainer({ mountTarget: iframeDocument.body, document: iframeDocument });

    iframeDocument.addEventListener('contextmenu', event => {
      event.preventDefault();
    });

    return () => {

      if (!iframeRef.current) return;
      iframeDocument.removeEventListener('contextmenu', event => { });
    }


  }, [iframeRef.current])



  return <ShadowRootComponent>

    <iframe frameBorder={0} id="ac-editor-iframe-doc"
      width="100%"
      height="95%" ref={iframeRef}>
      {container && ReactDOM.createPortal(<InnerComponent onLoad={onLoad} document={container.document}>
        {children}
      </InnerComponent>, container.mountTarget)}
    </iframe>



  </ShadowRootComponent>
}

const FontsInnerComponent = ({ children, document, onLoad }) => {


  useEffect(() => {

    loadallFonts(document).then((res) => {
      onLoad(res.fonts);
    }).catch((e) => {
      message.error(e?.message || 'Something went wrong!');
    });



  }, [document]);



  const loadallFonts = async (document) => {
    return new Promise(async (resolve, reject) => {

      const settingRes = await SettingServices.get();
      if (settingRes?.setting)
        document.head.insertAdjacentHTML("beforeend", settingRes.setting.scripts?.head);



      const res = await ThemeServices.getFonts();

      if (res.fonts)
        res.fonts?.data.forEach(async (font) => {
          const { _uid, fontFamily, fontSrc, src, isGoogleFont } = font;

          if (isGoogleFont && src) {
            const linkElement = document.createElement('div');
            linkElement.id = 'google-font-' + _uid;
            linkElement.innerHTML = src;
            document.head.appendChild(linkElement);
          }
          else
            if (Array.isArray(fontSrc)) {
              try {

                for (const src of fontSrc) {

                  const fontFace = new FontFace(fontFamily, `url(${src.src}) format('${src.format}')`);
                  await fontFace.load();
                  document.fonts.add(fontFace);


                }
              } catch (error) {
                message.error(`Failed to load ${fontFamily} font: ${error}`);
              }
            }
        });


      document.fonts.onloadingerror = () => {
      };



      document.fonts.ready.then(async function () {

      });

      resolve({ fonts: res.fonts?.data || [], total: res.fonts?.total });


    })
  }


  return children;


};



export function FontsIFrame({ children, onLoad }) {


  const iframeRef = useRef();

  const {
    token: { colorPrimary, colorPrimaryBg, },
  } = theme.useToken();




  const [container, setConainer] = useState(null);

  useEffect(() => {
    if (!iframeRef.current)
      return;

    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    setConainer({ mountTarget: iframeDocument.body, document: iframeDocument });

    iframeDocument.addEventListener('contextmenu', event => {
      event.preventDefault();
    });

    return () => {

      if (!iframeRef.current) return;
      iframeDocument.removeEventListener('contextmenu', event => { });
    }


  }, [iframeRef.current])



  return <ShadowRootComponent>

    <iframe frameBorder={0} id="ac-editor-iframe-doc"
      width="100%"
      height="95%" ref={iframeRef}>
      {container && ReactDOM.createPortal(<FontsInnerComponent onLoad={onLoad} document={container.document}>
        {children}
      </FontsInnerComponent>, container.mountTarget)}
    </iframe>



  </ShadowRootComponent>
}


const IconsInnerComponent = ({ children, document, onLoad }) => {


  useEffect(() => {

    loadHead().then((status) => {
    }).catch((e) => {
      message.error(e?.message || 'Something went wrong!');
    });



  }, []);



  const loadHead = async () => {
    return new Promise(async (resolve, reject) => {


      const res = await SettingServices.get();
      if (res?.setting)
        document.head.insertAdjacentHTML("beforeend", res.setting.scripts?.head);



      resolve();
    })


  }


  return children;


};



export function IconsIFrame({ children, onLoad }) {


  const iframeRef = useRef();

  const {
    token: { colorPrimary, colorPrimaryBg, },
  } = theme.useToken();




  const [container, setConainer] = useState(null);

  useEffect(() => {
    if (!iframeRef.current)
      return;

    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    setConainer({ mountTarget: iframeDocument.body, document: iframeDocument });

    iframeDocument.addEventListener('contextmenu', event => {
      event.preventDefault();
    });

    return () => {

      if (!iframeRef.current) return;
      iframeDocument.removeEventListener('contextmenu', event => { });
    }


  }, [iframeRef.current])



  return <ShadowRootComponent>

    <iframe frameBorder={0} id="ac-editor-iframe-doc"
      width="100%"
      height="95%" ref={iframeRef}>
      {container && ReactDOM.createPortal(<IconsInnerComponent onLoad={onLoad} document={container.document}>
        {children}
      </IconsInnerComponent>, container.mountTarget)}
    </iframe>



  </ShadowRootComponent>
}


const AnimationsInnerComponent = ({ children, document, onLoad }) => {


  useEffect(() => {

    loadallAnimations().then((status) => {
      // onLoad(true);
    }).catch((e) => {
      message.error(e?.message || 'Something went wrong!');
    });



  }, []);


  const loadallAnimations = async () => {

    return new Promise(async (resolve, reject) => {

      try {


        let style = document.createElement('style');

        const res = await ThemeServices.getAnimations();

        style.textContent = res.css;
        document.head.appendChild(style);
        resolve(true)

      } catch (e) {
        reject(e?.message, "Sdsd");
      }

    })


  }


  return children;


};



export function AnimationsIFrame({ children, onLoad }) {

  const iframeRef = useRef();

  const {
    token: { colorPrimary, colorPrimaryBg, },
  } = theme.useToken();




  const [container, setConainer] = useState(null);

  useEffect(() => {
    if (!iframeRef.current)
      return;

    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    setConainer({ mountTarget: iframeDocument.body, document: iframeDocument });

    iframeDocument.addEventListener('contextmenu', event => {
      event.preventDefault();
    });

    return () => {

      if (!iframeRef.current) return;
      iframeDocument.removeEventListener('contextmenu', event => { });
    }


  }, [iframeRef.current])



  return <ShadowRootComponent>

    <iframe frameBorder={0} id="ac-editor-iframe-doc"
      width="100%"
      height="95%" ref={iframeRef}>
      {container && ReactDOM.createPortal(<AnimationsInnerComponent onLoad={onLoad} document={container.document}>
        {children}
      </AnimationsInnerComponent>, container.mountTarget)}
    </iframe>



  </ShadowRootComponent>

}