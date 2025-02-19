import React from "react";
import styled from "styled-components";
import { Col, Row } from "reactstrap";

import img1 from "../img/client/img1.png";
import img2 from "../img/client/img2.png";
import img3 from "../img/client/img3.png";
import img4 from "../img/client/img4.png";
import img5 from "../img/client/img5.png";
import img6 from "../img/client/img6.png";
import img7 from "../img/client/img7.png";
import img8 from "../img/client/img8.png";
import img9 from "../img/client/img9.png";
import img10 from "../img/client/img10.png";
import img11 from "../img/client/img11.png";
import img12 from "../img/client/img12.jpg";
import img13 from "../img/client/img13.png";
import img14 from "../img/client/img14.png";
import img15 from "../img/client/img15.png";
import img16 from "../img/client/img16.png";
import img17 from "../img/client/img17.png";
import img18 from "../img/client/img18.png";
import img19 from "../img/client/img19.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Styled Components
const FeaturesSection = styled.div`
  background: #f6f6f6;
  text-align: center;
`;

const Container = styled.div`
  .section-title {
    margin-bottom: 70px;
    .h2 {
      position: relative;

      padding-top: 52px;
      margin-bottom: 15px;
      padding-bottom: 15px;
      &::after {
        position: absolute;
        content: "";

        background: linear-gradient(to right, #f7bb78 0%, #fdfcfb 100%);

        height: 3px;
        width: 400px;
        bottom: 0;
        margin-left: -32px;
        left: 35%;
      }
    }
  }
`;

// const FeatureIcon = styled.i`
//   font-size: 38px;
//   margin-bottom: 20px;
//   transition: all 0.5s;
//   color: #fff;
//   width: 100px;
//   height: 100px;
//   padding: 30px 0;
//   border-radius: 50%;
//   background: linear-gradient(to right, #ee8d21 0%, #f9ba61 100%);
//   box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.05);
// `;

// const Heading3 = styled.h3`
//   font-size: 18px;
// `;

// const Description = styled.p`
//   font-size: 15px;
// `;

export const Features = (props) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
      slidesToSlide: 1, // optional, default to 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
      slidesToSlide: 1, // optional, default to 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1
    },
  };
  return (
    <FeaturesSection id="features">
      <Container
        className="container"
        style={{ paddingBottom: "90px", maxWidth: "90%" }}
      >
        <Col className="col-md-12  section-title">
          <h2 className="h2" style={{ textTransform: "capitalize" }}>
            Trusted by Clients{" "}
          </h2>
        </Col>
        <Row className="row" style={{ alignItems: "center" }}>
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={false}
            responsive={responsive}
            // ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlay={true}
            keyBoardControl={false}
            transitionDuration={1000}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            arrows={false} // Disable the arrows here
            autoPlaySpeed={1000} // Slower auto-play speed for smooth effect
            customTransition="transform 1000ms ease-in-out" // Smooth transition
            // dotListClass="custom-dot-list-style"
          >
            <div className="col-xs-6 col-md-3">
              <img className="client-img" src={img1} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3">
              <img className="client-img" src={img2} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img3} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img4} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img5} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img6} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img7} alt="client" />
            </div>

            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img8} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img9} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img10} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img11} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img12} alt="client" />
            </div>

            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img13} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img14} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img15} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img16} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img17} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img18} alt="client" />
            </div>
            <div className="col-xs-6 col-md-3 ">
              <img className="client-img" src={img19} alt="client" />
            </div>
          </Carousel>
        </Row>
      </Container>
    </FeaturesSection>
  );
};
