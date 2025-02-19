import React from "react";
import styled from "styled-components";
import homepage from "../img/homepage.jpg";
import { Col, Row } from "reactstrap";
import nexapp from "../img/loader.gif";

// Styled Components for the Header styles
const HeaderWrapper = styled.header`
max-width: 100vw;
  .intro {
    display: table;
    width: 100%;
    padding: 0;
    background: #555 center center no-repeat;
    background-color: #e5e5e5;
    background-size: cover;
  }
.row{
    align-items: center;
    width: 100%;

}
  .intro .overlay {
    background: #333a40;
  }

  .intro h1 {
    font-family: "Raleway", sans-serif;
    color: #fff;
    font-size: 50px;
    font-weight: 700;
  text-transform: capitalize;
    margin-top: 0;
    margin-bottom: 10px;

    span {
      font-weight: 800;
      color: #5ca9fb;
    }
  }

  .intro p {
    color: #fff;
    font-size: 22px;
    font-weight: 300;
    line-height: 30px;
    margin: 30px auto;
    margin-bottom: 60px;
  }

  .intro-text {
    padding-top: 240px;
    padding-bottom: 150px;
text-align: left;
    padding-left: 43px;

  }

  .btn-custom {
    font-family: "Raleway", sans-serif;
    text-transform: uppercase;
    color: #fff;
    background-color: #5ca9fb;
  background: linear-gradient(to right, #ee8d21 0%, #f9ba61 100%);
    padding: 14px 34px;
    letter-spacing: 1px;
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    border-radius: 25px;
    transition: all 0.5s linear;
    border: 0;

    &:hover,
    &:focus,
    &.focus,
    &:active,
    &.active {
      color: #fff;
      background-image: none;
      background-color: #ee8d21 ;
    }
  }

  a {
    color: #608dfd;
    font-weight: 400;
    text-decoration: none;

    &:hover,
    &:focus {
      text-decoration: none;
      color: #608dfd;
    }
  }

  p {
    font-size: 15px;

    &.intro {
      margin: 12px 0 0;
      line-height: 24px;
    }
  }

  ul,
  ol {
    list-style: none;
    padding: 0;
  }
   .container-div {
      width: 100%;
    margin: 0px 10px;
    padding: 0px 40px;
    }
    .centered-gif {
  position: absolute;
  top: 35%;
  right:80%
  transform: translate(-50%, -50%);
  width: 80px;  /* Adjust based on how large you want the GIF */
  height: 80px;
}
`;

export const Header = (props) => {
  return (
    <HeaderWrapper id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container-div">
            <div className="row">
              <Col className="col-md-7  intro-text">
                <h1>
                  Seamless Nationwide Fulfillment For Managed Service Providers
                  <span></span>
                </h1>
                <p>
                  Deliver cutting-edge technology solutions designed to meet
                  your unique business requirements.
                </p>
                <a href="/login" className="btn btn-custom btn-lg page-scroll">
                  Sign In
                </a>
              </Col>
              <Col></Col>
              <Col className="col-md-3" style={{ position: "relative" }}>
                <img
                  style={{ height: "400px" }}
                  src={homepage}
                  alt="homepage"
                />
                {/* <img src={nexapp} alt="Loading" className="centered-gif" /> */}
              </Col>
            </div>
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
};
