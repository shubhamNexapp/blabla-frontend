import React from "react";
import styled from "styled-components";
import { Col, Row } from "reactstrap";

const Container = styled.div`
  .row {
    padding: 0px 50px;
  }
  .section-title {
    margin-bottom: 70px;
    .h2 {
      position: relative;
      margin-top: 10px;
      margin-bottom: 15px;
      padding-bottom: 15px;
      &::after {
        position: absolute;
        content: "";
        background: linear-gradient(to right, #ee8d21 0%, #f9ba61 100%);
        height: 0px;
        width: 60px;
        bottom: 0;
        margin-left: -30px;
        left: 50%;
      }
    }
  }
`;

export const Services = (props) => {
  return (
    <div id="services" className="text-center">
      <Container>
        <div className="section-title">
          <h2 className="h2">Our Services</h2>
          {/* <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
            dapibus leonec.
          </p> */}
        </div>
        <Row className="row">
          <Col className="col-md-4">
            {" "}
            <i className="fa mdi-48px mdi mdi-router-wireless"></i>
            <div className="service-desc">
              <h3 className="h3">Router Installation</h3>
              <p>
                Our Router Installation Service provides a swift and secure
                network setup, including hardware installation and configuration
                by an expert support.
              </p>
            </div>
          </Col>
          <Col className="col-md-4">
            {" "}
            <i className="fa mdi  mdi-48px mdi-desktop-tower-monitor"></i>
            <div className="service-desc">
              <h3 className="h3">PC Installation </h3>
              <p>
                From unboxing to software installation, we manage every aspect
                of the process for you. Our PC Installation Service provides a
                hassle-free setup for your computer, ensuring it is fully
                optimized for use.
              </p>
            </div>
          </Col>
          <Col className="col-md-4">
            {" "}
            <i className="fa mdi  mdi-48px mdi-sitemap-outline"></i>
            <div className="service-desc">
              <h3 className="h3">Branch Networking Rollout</h3>
              <p>
                Delivering scalable and secure network infrastructure across
                multiple locations. We ensure seamless connectivity, enabling
                smooth business operations at all branches.
              </p>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col className="col-md-4">
            {" "}
            <i className="fa dripicons-wifi"></i>
            <div className="service-desc">
              <h3 className="h3">Wifi Audit</h3>
              <p>
                The Wi-Fi Audit Service provides a comprehensive evaluation of
                your network to ensure optimal performance, security, and
                coverage
              </p>
            </div>
          </Col>
          <Col className="col-md-4">
            {" "}
            <i className="fa mdi  mdi-48px mdi-cctv"></i>
            <div className="service-desc">
              <h3 className="h3">CCTV Installation</h3>
              <p>
                Setup and configure your surveillance system professionally
                ensuring reliable monitoring and enhanced security for your
                property.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
