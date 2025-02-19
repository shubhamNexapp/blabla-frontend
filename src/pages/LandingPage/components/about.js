import React from "react";
import styled from "styled-components";
import { Col, Row } from "reactstrap";
import commit from "../img/about/commit.jpg";
import map from "../img/about/map.jpg";
import about from "../img/about/11.avif";
import available from "../img/about/availiability.png";
import price from "../img/about/price.jpg";

// Styled Components
const AboutSection = styled.div`
  padding: 100px 0;
`;

const AboutContainer = styled.div`
  .about-text {
    li {
      margin-bottom: 6px;
      margin-left: 6px;
      padding: 0;
      &:before {
        color: #5ca9fb;
        font-size: 11px;
        font-weight: 300;
        padding-right: 8px;
      }
      &::marker {
        color: rgb(255, 145, 0);
      }
    }
  }

  h3 {
    font-size: 22px;
    margin: 0 0 20px;
  }

  p {
    line-height: 24px;
    margin: 30px 0;
    font-size: 16px;
    font-weight: 500;
  }
`;

export const About = (props) => {
  return (
    <AboutSection id="about">
      <AboutContainer className="container">
        <div className="row" style={{ alignItems: "center" }}>
          <div className="col-xs-12 col-md-6">
            <img src={about} className="about-img-responsive" alt="" />
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="about-text">
              <h2 className="h2" style={{ textTransform: "capitalize" }}>
                What sets us apart
              </h2>
              <p style={{ fontSize: "16px", fontWeight: "500" }}>
                A service-oriented digital platform designed to enhance user
                interaction within the service sector. With Instaone, we
                simplifie the process of finding service providers, by
                prioritizing efficiency and accessibility. Our focus is on
                creating a user-centric experience where customers, vendors,
                engineers, and administrators can connect seamlessly
              </p>
              {/* <h3 className="h3">Why Choose Us?</h3> */}

              {/* <div className="col-lg-6 col-sm-6 col-xs-12"> */}
            </div>
          </div>
        </div>
        <Row
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
            paddingTop: "50px",
          }}
        >
          <Col className="choose-div-wrapper">
            <div class="aboutcard">
              <img src={map} />
            </div>
            <h4 className="head4">Pan India Coverage</h4>
            <p>Providing seamless service across every corner of India.</p>
          </Col>
          <Col className="choose-div-wrapper">
            <div class="aboutcard">
              <img src={available} />
            </div>
            <h4 className="head4">24/7 Availability</h4>
            <p>
              Always here for you, 24/7, ready to assist whenever you need us.
            </p>
          </Col>
          <Col className="choose-div-wrapper">
            <div class="aboutcard">
              <img src={commit} />
            </div>
            <h4 className="head4">Commitment </h4>
            <p>Built on trust, we deliver unwavering solutions every time.</p>
          </Col>
          <Col className="choose-div-wrapper">
            <div class="aboutcard">
              <img src={price} />
            </div>
            <h4 className="head4">Affordable</h4>
            <p>Affordable services without compromising on quality.</p>
          </Col>

          {/* </div> */}
          {/* <ul className="aboutUl">

                    <li> User-Centric Design</li>
                    <li>Efficiency</li>
                    <li>Accessibility</li>
                    <li>Comprehensive Solution</li>
                    <li>Trust and Transparency</li>

                  </ul> */}
        </Row>
      </AboutContainer>
    </AboutSection>
  );
};
