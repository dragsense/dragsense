
import React from "react";

import { Layout, theme, Button } from "antd";



export default function Home({ isLoggedin }) {

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

                                    <Button style={{ color: colorText }} type="default" href="/auth/login" size="large">
                                        Sign In</Button>
                                </>}
                        </div>
                    </div>
                </div>
            </nav>
        </header>


        <section className="privacy-content" style={{
            overflow: 'hidden',
            marginTop: 170,
        }}>
            <div className="container">
                <div className="row">
                    <div className="col-12"  style={{color: colorText }}>

                        <h1>Terms and Conditions</h1>

                        <p>Welcome to dragsense.com!</p>

                        <p>These terms and conditions outline the rules and regulations for the use of Drag Sense's Website, located at https://dragsense.com/.</p>

                        <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use dragsense.com if you do not agree to take all of the terms and conditions stated on this page.</p>

                        <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services, in accordance with and subject to, prevailing law of pk. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>

                        <h2>Cookies</h2>

                        <p>We employ the use of cookies. By accessing dragsense.com, you agreed to use cookies in agreement with the Drag Sense's Privacy Policy. </p>

                        <p>Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.</p>

                        <h2>License</h2>

                        <p>Unless otherwise stated, Drag Sense and/or its licensors own the intellectual property rights for all material on dragsense.com. All intellectual property rights are reserved. You may access this from dragsense.com for your own personal use subjected to restrictions set in these terms and conditions.</p>

                        <p>You must not:</p>
                        <ul>
                            <li>Republish material from dragsense.com</li>
                            <li>Sell, rent or sub-license material from dragsense.com</li>
                            <li>Reproduce, duplicate or copy material from dragsense.com</li>
                            <li>Redistribute content from dragsense.com</li>
                        </ul>

                        <p>This Agreement shall begin on the date hereof. Our Terms and Conditions were created with the help of the <a href="https://www.termsandconditionsgenerator.com/">Free Terms and Conditions Generator</a>.</p>

                        <p>Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Drag Sense does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Drag Sense,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, Drag Sense shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.</p>

                        <p>Drag Sense reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.</p>

                        <p>You warrant and represent that:</p>

                        <ul>
                            <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
                            <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</li>
                            <li>The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy</li>
                            <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
                        </ul>

                        <p>You hereby grant Drag Sense a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.</p>

                        <h2>Hyperlinking to our Content</h2>

                        <p>The following organizations may link to our Website without prior written approval:</p>

                        <ul>
                            <li>Government agencies;</li>
                            <li>Search engines;</li>
                            <li>News organizations;</li>
                            <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
                            <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
                        </ul>

                        <p>These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.</p>

                        <p>We may consider and approve other link requests from the following types of organizations:</p>

                        <ul>
                            <li>commonly-known consumer and/or business information sources;</li>
                            <li>dot.com community sites;</li>
                            <li>associations or other groups representing charities;</li>
                            <li>online directory distributors;</li>
                            <li>internet portals;</li>
                            <li>accounting, law and consulting firms; and</li>
                            <li>educational institutions and trade associations.</li>
                        </ul>

                        <p>We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of Drag Sense; and (d) the link is in the context of general resource information.</p>

                        <p>These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.</p>

                        <p>If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to Drag Sense. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.</p>

                        <p>Approved organizations may hyperlink to our Website as follows:</p>

                        <ul>
                            <li>By use of our corporate name; or</li>
                            <li>By use of the uniform resource locator being linked to; or</li>
                            <li>By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party's site.</li>
                        </ul>

                        <p>No use of Drag Sense's logo or other artwork will be allowed for linking absent a trademark license agreement.</p>

                        <h2>iFrames</h2>

                        <p>Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.</p>

                        <h2>Content Liability</h2>

                        <p>We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.</p>

                        <h2>Reservation of Rights</h2>

                        <p>We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.</p>

                        <h2>Removal of links from our website</h2>

                        <p>If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.</p>

                        <p>We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.</p>

                        <h2>Disclaimer</h2>

                        <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>

                        <ul>
                            <li>limit or exclude our or your liability for death or personal injury;</li>
                            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                            <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
                        </ul>

                        <p>The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.</p>

                        <p>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>

                    </div>
                </div>
            </div>
        </section>
        <br />
        <br />

        <footer className="footer-pos footer-software footer-hrm bg-aqua pt-50" style={{
            overflow: 'hidden',
            background: isDark ? colorBgContainer : colorPrimaryBgHover
        }}>


            <div className="bg-shapes">
                <div></div>
                <div></div>
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

}

