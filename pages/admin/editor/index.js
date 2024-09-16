import { getSession } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";

import { Spin, theme, Card, Typography, Layout } from "antd";
import Link from "next/link";
import ProjectServices from "@/lib/services/projects";

const { Title } = Typography;

export default function Editor({ info }) {
  const iframeRef = useRef(null);
  const [isOpen, setOpen] = useState(true);
  const [laoding, setLoading] = useState(true);

  const {
    token: { colorPrimary, colorBgLayout },
  } = theme.useToken();

  useEffect(() => {
    const load = async () => {
      try {
        if (info) {
          setLoading(true);
          const iframe = iframeRef.current;
          const customProtocol = "autocode-editor://open";
          const res = await ProjectServices.getCookie(info.projectId);
          const encodedInfo = encodeURIComponent(JSON.stringify(info));
          const encodedCookies = encodeURIComponent(
            JSON.stringify(res?.cookies)
          );

          const url = `${customProtocol}?info=${encodedInfo}&cookies=${encodedCookies}`;
          //iframe.src = url;
          window.open(url);
        }
      } catch (e) {
        console.log(e?.message);
      } finally {
      }
      setTimeout(() => {
        setLoading(false);
      }, 800);
    };
    load();
  }, [isOpen]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        gap: 20,
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src="/images/logo/nav-logo.png" alt="autocode-logo" />

      <Title>
        {" "}
        Opening Autocode <span style={{ color: colorPrimary }}>Editor</span>
      </Title>

      {laoding && <Spin laoding={laoding} />}
      <Card style={{ textAlign: "center" }}>
        <h3>
          Click{" "}
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setOpen(!isOpen);
            }}
          >
            Open Autocode Editor
          </a>{" "}
          to open the desktop app.
        </h3>
        <h4>Don’t have the app yet?</h4>
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          <li>
            <a href="/Autocode_Editor_Setup_1.0.0_Windows.zip" download>
              Download for Windows
            </a>
          </li>
          <li>
            <a href="/Autocode_Editor_Setup_1.0.0_Mac.dmg" download>
              Download for Mac
            </a>
          </li>
        </ul>
      </Card>
      <iframe
        style={{ display: "none" }}
        ref={iframeRef}
        title="Autocode Editor"
        width="0"
        height="0"
        frameBorder="0"
      />
    </Layout>
  );
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
    };

  info.url = process.env.URL;

  info.userName = session.user.name;

  return {
    props: {
      info,
    },
  };
}
