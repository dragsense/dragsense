


import { getSession } from "next-auth/react";
import React, { useState, useRef, useEffect } from 'react';

import { Spin, theme, Card, Typography } from 'antd';
import Link from "next/link";

const { Title } = Typography;

export default function Editor({ info, cookies }) {


  const iframeRef = useRef(null);
  const [isOpen, setOpen] = useState(true);
  const [laoding, setLoading] = useState(true);


  const {
    token: { colorPrimary },
  } = theme.useToken();


  useEffect(() => {

    if (info) {
      setLoading(true)
      const iframe = iframeRef.current;

      const customProtocol = 'autocode-editor://open';
      const encodedInfo = encodeURIComponent(JSON.stringify(info));
      const encodedCookies = encodeURIComponent(JSON.stringify(cookies));

      const url = `${customProtocol}?info=${encodedInfo}&cookies=${encodedCookies}`;
      iframe.src = url;

      setTimeout(() => {
        setLoading(false);
      }, 800)

    }
  }, [isOpen]);



  return (
    <div style={{
      minHeight: '100vh',
      gap: 20,
      flexDirection: 'column',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>

      <img src="/images/logo/nav-logo.png" alt="autocode-logo"  />

      <Title> Opening Autocode {" "}
        <span style={{ color: colorPrimary }}>Editor</span>
      </Title>


      {laoding && <Spin laoding={laoding} />}
      <Card style={{ textAlign: 'center' }}>
        <h3>Click <a href="#" onClick={(event) => {
          event.preventDefault();
          setOpen(!isOpen);
        }}>Open Autocode Editor</a> to open the desktop app.</h3>
        <h4>Don’t have the app yet? <a href="#">Download it here</a>.</h4>

      </Card>
      <iframe style={{ display: 'none' }} ref={iframeRef} title="Autocode Editor" width="0" height="0" frameBorder="0" />

    </div>
  )

}

export async function getServerSideProps(context) {

  const { req, res, query } = context;
  const session = await getSession({ req });

  if (!session && !session?.user) {
    res.writeHead(302, {
      Location: "/auth/login",
    });
    return res.end();

  }



  const info = JSON.parse(decodeURIComponent(query.info));

  if (!info.projectId)
    return {
      notFound: true,
    }

  info.userName = session.user.name;
  const cookies = req.cookies;

  return {
    props: {
      info,
      cookies,
    },
  };

}