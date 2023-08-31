
import React from "react";

import { useSession } from "next-auth/react"
import { useState } from "react";
import { Layout, Typography, theme, Button, Image, Alert } from "antd";

const { Title } = Typography;
import { getSession } from "next-auth/react"




export default function Home({ isLoggedin, user }) {


  const { data: session } = useSession()

  const {
    token: {
      colorPrimaryBg,
      colorBgContainer,
      colorPrimaryBgHover,
      colorText,
      colorBgBase,
      colorBgLayout, colorPrimary },
  } = theme.useToken();


  const isDark = colorBgBase === '#000';



  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  const onSubmit = async (e) => {
    e.preventDefault();

    // Initialize loading and error states
    setLoading(true);
    setError(null);

    if (values.email === "" || values.name === "") {
      setError("Name or email is empty");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      // Display success message
      setMessage("Data submitted successfully");

      setValues({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      // Set error message
      setError("An error occurred while submitting data");
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };
  function adjustAlpha(colorValue, alpha) {


    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(colorValue)) {
      // Convert hex to RGB
      const r = parseInt(colorValue.substring(1, 3), 16);
      const g = parseInt(colorValue.substring(3, 5), 16);
      const b = parseInt(colorValue.substring(5, 7), 16);

      // Convert RGB to rgba with 45% alpha
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Check if the input is in rgba format
    if (/^rgba\((\d+,\s*\d+,\s*\d+,\s*[\d.]+)\)$/.test(colorValue)) {
      return colorValue.replace(/[\d.]+\)$/g, `${alpha})`);
    }

    // Return unchanged if not in supported format
    return colorValue;

  }


  return <Layout style={{ backgroundColor: colorBgBase }}>

    <header className="header-area">
      <nav className="navbar navbar-expand-lg menu_three sticky-nav" style={{ backgroundColor: colorBgContainer }}>
        <div className="container-fluid">
          <a className="navbar-brand header_logo" href="/">
            <img className="main_logo" src="/images/logo/nav-logo.png" alt="logo" />
          </a>

          <div className="collapse navbar-collapse justify-content-end" id="navbarText">

            <div className="right-nav" style={{ gap: 5 }}>

              {isLoggedin ?
                <Button type="primary" href="/admin/projects" style={{ color: colorText }} size="large">
                  Go to projects</Button> :
                <><Button type="text" href="/auth/register" style={{ color: colorText }} size="large">
                  Sign Up</Button>

                  <Button type="default" style={{ color: colorText }} href="/auth/login" size="large">
                    Sign In</Button>
                </>}
            </div>
          </div>
        </div>
      </nav>
    </header>


    <section className="banner-area-2" style={{
      overflow: 'hidden',
      backgroundImage: "url(./assets/images/banner/banner-shape-4.svg)"
    }}>
      <div className="banner-shapes">
        <div className="shape">
          <img src="/images/banner-shape-4.svg" alt="shapes" />
        </div>
        <div className="shape">
          <img data-parallax='{"x":50, "y": 70, "rotateY":300}' src="/images/banner-shape-1.svg" alt="shapes" />
        </div>
        <div className="shape">
          <img data-parallax='{"x":-50, "y": 20, "rotateZ":500}' src="/images/banner-shape-2.svg" alt="shapes" />
        </div>
        <div className="shape">
          <img data-parallax='{"x":-20, "y": 70, "rotateZ":0}' src="/images/banner-shape-3.svg" alt="shapes" />
        </div>
        <div className="shape">
          <img src="/images/banner-shape-5.svg" alt="shapes" />
        </div>
      </div>
      <div className="container">
        <div className="row align-items-center gy-lg-0 gy-4">
          <div className="col-xxl-8 col-md-7">
            <div className="banner-left pr-60 wow fadeInLeft">
              <Title level={1}> Create Your <br /> Website with, <br />
                <span style={{ color: colorPrimary }}>  GrabSense </span>
              </Title>

              <p className="banner-para" style={{ color: colorText }}>
                Whether it's for personal use or clients, Create web pages and organized collections effortlessly.
                <br /><br />NodeJS App. <br /> Static Pages. <br />Just drag, drop. <br /> It's FREE.
              </p>
              {isLoggedin ?
                <Button href="/admin/projects" type="primary"
                  style={{ height: 50, fontSize: 24, paddingLeft: 40, paddingRight: 40 }} size="large">
                  Go to projects</Button> :

                <Button href="/auth/register"
                  style={{ height: 50, fontSize: 24, paddingLeft: 40, paddingRight: 40 }}
                  type="primary"
                  size="large">
                  Get Started
                </Button>}

              <p style={{ fontSize: 14, color: colorText }}>
                <b>Note:</b> Our app is currently in testing mode to ensure a top-notch experience.
              </p>
            </div>
          </div>
          <div className="col-xxl-4 col-md-5">
            <div className="banner-right wow fadeInRight">
              <img
                src="/images/background/hero-bg-png.png"
                alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section style={{ overflow: 'hidden', zIndex: 1 }}>
      <div style={{ width: 10, height: 10, margin: 'auto', background: colorPrimary, borderRadius: 50 }}></div>
      <img src={`/images/${isDark ? 'projects-dark' : 'projects'}.png`}
        style={{ margin: 'auto', rotate: '-3deg', zIndex: 1, maxWidth: '90%' }} alt="" />

    </section>


    <section className="product-box-area" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="product-boxxes-wrapper">
              <div className="product-box-copy top" style={{ backgroundColor: colorBgContainer, boxShadow: `0px 0rem 0.5rem ${adjustAlpha(colorText, 0.1)}` }}>
                <div className="product-hero-box-left">
                  <h2 className="box-title" style={{ color: colorText }}>Everything you need to create a website</h2>
                  <p style={{ color: colorText, fontSize: 16 }}>This distinctive CMS provides a hands-on coding experience without actual coding, coupled with advanced data management features for page collections and website settings. </p>

                  <div className="product-hero-box-pointers">
                    <ul >
                      <li>
                        <div className="product-tab-checkmark">
                          <img src="/images/icons/checkmark.svg" alt="" />
                        </div>
                        <div className="product-tab-pointer-text">
                          <div className="text-block _16-px full-white" style={{ color: colorText }}>Projects</div>
                        </div>
                      </li>
                      <li>
                        <div className="product-tab-checkmark">
                          <img src="/images/icons/checkmark.svg" alt="" />
                        </div>
                        <div className="product-tab-pointer-text" style={{ color: colorText }}>Dynamic Content</div>
                      </li>
                      <li>
                        <div className="product-tab-checkmark">
                          <img src="/images/icons/checkmark.svg" alt="" />
                        </div>
                        <div className="product-tab-pointer-text" style={{ color: colorText }}>Performance</div>
                      </li>
                      <li>
                        <div className="product-tab-checkmark">
                          <img src="/images/icons/checkmark.svg" alt="" />
                        </div>
                        <div className="product-tab-pointer-text" style={{ color: colorText }}>SEO Support</div>
                      </li>
                      <li>
                        <div className="product-tab-checkmark">
                          <img src="/images/icons/checkmark.svg" alt="" />
                        </div>
                        <div className="product-tab-pointer-text" style={{ color: colorText }}>Theme</div>
                      </li>

                    </ul>
                  </div>
                </div>
                <div className="produ">
                  <img src="/images/dashboard.png" style={{ margin: 'auto', width: '70%' }} alt="" />

                </div>
              </div>
              <div className="product-box-copy copy" style={{ paddingTop: 50, backgroundColor: colorBgContainer, boxShadow: `0px 0rem 0.5rem ${adjustAlpha(colorText, 0.1)}` }}>

                <div className="product-hero-box-left">
                  <h2 className="box-title" style={{ color: colorText }}>Editor</h2>
                  <p style={{ color: colorText, fontSize: 16 }}>CMS's unique editor mimics hand-coded development. Users effortlessly construct intricate designs, harnessing the power of coding without the complexity and advanced states management.</p>
                  <div className="product-hero-box-pointers">
                    <div className="product-hero-box-pointer-item">
                      <div className="product-features-img">
                        <img src="/images/icons/icon-5.svg" alt="" />
                      </div>
                      <h5 className="product-hero-box-pointer-title" style={{ color: colorText }}>Element</h5>
                      <p style={{ color: colorText }}>Fundamental content pieces enclosed within HTML tags, like headings, images, and links.</p>
                    </div>
                    <div className="product-hero-box-pointer-item">
                      <div className="product-features-img">
                        <img src="/images/icons/icon2.svg" alt="" />
                      </div>
                      <h5 className="product-hero-box-pointer-title" style={{ color: colorText }}>Setting</h5>
                      <p style={{ color: colorText }}> Configuration choices for customizing attributes, dynamic content, and behavior.</p>
                    </div>
                    <div className="product-hero-box-pointer-item">
                      <div className="product-features-img">
                        <img src="/images/icons/icon1.svg" alt="" />
                      </div>
                      <h5 className="product-hero-box-pointer-title" style={{ color: colorText }}>Style</h5>
                      <p style={{ color: colorText }}>Visual design through CSS, enhancing appearance with colors, fonts, spacing, etc</p>
                    </div>

                  </div>
                </div>
                <div className="product-hero-box-2" >
                  <img src="./images/element-editor.png" style={{ margin: 'auto' }} alt="" />
                </div>
              </div>
              <div className="product-dotted-line down"></div>
              <div className="product-circle down"><div className="product-inside-circle" style={{ backgroundColor: colorPrimaryBg }}></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section style={{ background: isDark ? colorBgContainer : null, overflow: 'hidden', }} className="features features-area-four section-padding wow fadeInUp animate__fast">
      <div className="container">
        <div className="row align-items-center flex-column-reverse flex-lg-row">
          <div className="col-lg-6">
            <div className="features-content features-content-four">
              <h2 style={{ color: colorText }}>Total Control Over </h2>
              <h5 style={{ color: colorText }}>Hosting, <span style={{ color: colorPrimary }}>Effortless</span> Content Management</h5>
              <p style={{ color: colorText, fontSize: 18 }}>
                With our solution, you have complete control over your hosting and domain.
                <br /><br />
                Seamlessly connect to our platform for
                hassle-free editing and content uploading.
                <br /><br />
                Experience a new level of content management, all while maintaining total control over your hosting and domain.
              </p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="features-image">
              <img src="/images/domian.png" alt="Features Image" />
              <img src="/images/features-object-6.svg" alt="Features Object" className="features-object6" />
              <img
                src="/images/features-object-7.svg"
                alt="Features Object"
                className="features-object7 object-element"
                data-paroller-factor="0.05"
                data-paroller-type="foreground"
                data-paroller-direction="horizontal"
                data-paroller-transition="transform .2s linear"
              />
              <img
                src="/images/features-object-8.svg"
                alt="Features Object"
                className="features-object8 object-element"
                data-paroller-factor="0.05"
                data-paroller-type="foreground"
                data-paroller-transition="transform .2s linear"
              />
              <img
                src="/images/features-object-9.svg"
                alt="Features Object"
                className="features-object9 object-element"
                data-paroller-factor="-0.05"
                data-paroller-type="foreground"
                data-paroller-transition="transform .2s linear"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section style={{ overflow: 'hidden' }} className="features-area-13 pt-135 pb-120" >
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="section-title-center">
              <h2 className="wow fadeInUp" style={{ color: colorText }}>Transform Creativity with</h2>

            </div>
          </div>
        </div>

        <div className="row gy-4 gy-lg-0">
          <div className="col-lg-5">
            <div className="features-list nav-tabs nav automated-tab2" role="tablist">
              <a className="nav-link" aria-selected="false" role="tab" data-bs-toggle="tab" data-bs-target="#proto-track-one" data-wow-delay="0.1s">
                <span className="circle"></span> Theme
              </a>
              <a className="nav-link" aria-selected="false" role="tab" data-bs-toggle="tab" data-bs-target="#proto-track-two" data-wow-delay="0.3s">
                <span className="circle"></span> Animations
              </a>
              <a className="nav-link" aria-selected="false" role="tab" data-bs-toggle="tab" data-bs-target="#proto-track-three" data-wow-delay="0.5s">
                <span className="circle"></span> Components
              </a>
              <a className="nav-link" aria-selected="false" role="tab" data-bs-toggle="tab" data-bs-target="#proto-track-four" data-wow-delay="0.5s">
                <span className="circle"></span> States
              </a>
            </div>
          </div>
          <div className="col-lg-7 ps-lg-0">
            <div className="features-right tab-content ml-90">
              <div className="tab-pane fade" id="proto-track-one" role="tabpanel">
                <p style={{ color: colorPrimary, fontSize: 16, maxWidth: '90%' }}>The theme editor allows users to define global style attributes like fonts and colors. Easily manage variables for consistent design.</p>

                <div className="main-img" data-wow-delay="0.1s">
                  <img className="fea-img" src="/images/colorsview.png" alt="" />
                  <div className="features-shapes">
                    <div className="shape">
                      <img src="/images/fea-shape1.svg" alt="" />
                    </div>
                    <div className="shape">
                      <img src="/images/fea-shape2.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="proto-track-two" role="tabpanel">
                <p style={{ color: colorPrimary, fontSize: 16, maxWidth: '90%' }}>Create CSS animations effortlessly with the visual editor. Bring dynamic motion to your content without coding.</p>

                <div className="main-img" data-wow-delay="0.1s">
                  <img className="fea-img" src="/images/animation.png" alt="" />
                  <div className="features-shapes">
                    <div className="shape">
                      <img src="/images/fea-shape1.svg" alt="" />
                    </div>
                    <div className="shape">
                      <img src="/images/fea-shape2.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="proto-track-three" role="tabpanel">
                <p style={{ color: colorPrimary, fontSize: 16, maxWidth: '90%' }}>Reusable components optimizing development efficiency.</p>
                <div className="main-img" data-wow-delay="0.1s">
                  <img className="fea-img" src="/images/compoents.png" alt="" />
                  <div className="features-shapes">
                    <div className="shape">
                      <img src="/images/fea-shape1.svg" alt="" />
                    </div>
                    <div className="shape">
                      <img src="/images/fea-shape2.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="proto-track-four" role="tabpanel">
                <p style={{ color: colorPrimary, fontSize: 16, maxWidth: '90%' }}>Easily manage content variations. Adapt elements for different situations with simplicity.</p>

                <div className="main-img" data-wow-delay="0.1s">
                  <img className="fea-img" src="/images/states.png" alt="" />
                  <div className="features-shapes">
                    <div className="shape">
                      <img src="/images/fea-shape1.svg" alt="" />
                    </div>
                    <div className="shape">
                      <img src="/images/fea-shape2.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <section style={{ overflow: 'hidden' }} className="app-clients-area pt-120 pb-90">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2 style={{ color: colorText }} className="app-clients-title cloud-heading-2 text-center mb-35 wow fadeInUp" data-wow-delay="0.3s">
              <span>
                Built Using {" "}
                <img className="border-shape" src="/images/border.svg" alt="Border" />
              </span>
              Leading Technologies
            </h2>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="w-50 w-md-20">
            <div className="client-image wow fadeInLeft" data-wow-delay="0.1s">
              <img src="/images/logo/react.png" alt="Brand Image" style={{ width: 100 }} />
            </div>
          </div>
          <div className="w-50 w-md-20">
            <div className="client-image wow fadeInLeft" data-wow-delay="0.3s">
              <img src="/images/logo/nextjs.png" alt="Brand Image" style={{

                outline: `1px solid black`,
                borderRadius: '50%',
                outlineOffset: '-2px',
                width: 110

              }} />
            </div>
          </div>
          <div className="w-50 w-md-20">
            <div className="client-image wow fadeInLeft" data-wow-delay="0.5s">
              <img src="/images/logo/electron.png" alt="Brand Image" style={{ width: 100 }} />
            </div>
          </div>
          <div className="w-50 w-md-20">
            <div className="client-image wow fadeInLeft" data-wow-delay="0.7s">
              <img src="/images/logo/antd.png" alt="Brand Image" style={{ width: 100 }} />
            </div>
          </div>

        </div>
      </div>
    </section>

    <section className="contact-area-2" style={{ overflow: 'hidden', background: isDark ? colorBgContainer : colorPrimaryBgHover }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="section-title text-center">
              <h2 style={{ color: colorText }}>
                <span>GET IN TOUCH</span>
                How can we help you
              </h2>
              <p style={{ color: colorText }}>We’re here to help and answer any question you might have. We look forward to hearing from you.</p>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="contact-form-2">


              <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-general" role="tabpanel" aria-labelledby="nav-general-tab">
                  <div className="contact-tab-info text-center">
                    <img className="mx-auto" src="/images/icons/form-icon.svg" alt="Icon" />
                    <h4 className="tab-title">General Contact</h4>
                    <p className="tab-para">
                      Have some feedback or a general question? <br />
                      Get in touch with us below
                    </p>
                  </div>

                  <div className="tab-form">
                    <form onSubmit={onSubmit}
                    >
                      <div className="contact-form-name">
                        <label htmlFor="name" className="">Name*</label>
                        <input type="text" id="name" value={values.name} name="name" placeholder="" onChange={handleChange} />
                      </div>

                      <div className="contact-form-email">
                        <label htmlFor="email">Email*</label>
                        <input type="text" id="email" value={values.email} name="email" placeholder="" onChange={handleChange} />
                      </div>
                      <div className="contact-form-name">
                        <label htmlFor="subject" className="">Subject*</label>
                        <input type="text" id="subject" value={values.subject} name="subject" placeholder="" onChange={handleChange} />
                      </div>
                      <div className="contact-form-message">
                        <label htmlFor="textarea">Message</label>
                        <textarea id="textarea" value={values.message} name="message" placeholder="" onChange={handleChange}></textarea>
                      </div>
                      <div className="contact-form-button">
                        <Button
                          loading={loading}
                          disabled={loading}
                          style={{ height: 50, fontSize: 20, paddingLeft: 40, paddingRight: 40 }}

                          type="primary" size="large" htmlType="submit" >Send Message</Button>
                      </div>
                      <br/>

                      {message && <Alert type="success" message={message}></Alert>}
                      {error && <Alert type="error" message={error}></Alert>}

                    </form>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>




    <footer className="footer-pos footer-software  bg-aqua pt-20" style={{

      background: isDark ? colorBgContainer : colorPrimaryBgHover
    }}>


      <div className="bg-shapes">
        <div className="shape">
          <img data-parallax='{"x":100, "y": -200, "rotateY":0}' src="/images/icons/kite.svg" alt="Shape" />
        </div>
        <div className="shape">
          <img data-parallax='{"x":100, "y": 0, "rotateY":0}' src="/images/icons/women.svg" alt="Shape" />
        </div>
        <div className="shape">
          <img data-parallax='{"x":100, "y": 0, "rotateY":0}' src="/images/icons/leaf.svg" alt="Shape" />
        </div>
      </div>

      <div className="container">
        <div className="footer-bottom wow fadeInUp" data-wow-delay="0.1s">
          <div className="row align-items-center" style={{ textAlign: 'center' }}>
            <div className="col-lg-1 text-sm-center text-md-start">
              <ul>
                <li>
                  <a href="/"><img className="d-md-block d-sm-inline-block" src="/images/logo/nav-logo.png" alt="Footer Logo" /></a>
                </li>
              </ul>
            </div>
            <div className="col-lg-3" >
              <p style={{ color: colorText }}>Copyright 2021, All Rights Reserved </p>
            </div>
            <div className="col-lg-5">
              <div className="footer-bottom-menu">
                <ul className="" >
                  <li><a style={{ color: colorPrimary }} href="/terms">Terms & Conditions</a></li>
                  <li><a style={{ color: colorPrimary }} href="/privacypolicy">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3">
              <ul className="social-link-bg-2">
               
                <li>
                  <a href="https://twitter.com/dragsense" style={{ color: colorPrimaryBg }}><i className="fab fa-twitter"></i></a>
                </li>
               
            
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>


  </Layout>
  // <div style={{width: '100vw', height: '100vh'}}><Loading /></div>

}

export async function getServerSideProps(context) {

  const { req, res } = context;
  const session = await getSession({ req });

  let isLoggedin = false;
  if (session && session?.user) {
    isLoggedin = true;
  }


  return {
    props: { isLoggedin },
  }
}