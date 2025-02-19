import React from "react";

import { Container, Col, Row } from "reactstrap";

export const Gallery = (props) => {

  const galleryData = [

    {
      "title": "Project Title",
      "largeImage": "img/portfolio/02-large.jpg",
      "smallImage": "img/portfolio/02-small.jpg"
    },
    {
      "title": "Project Title",
      "largeImage": "img/portfolio/03-large.jpg",
      "smallImage": "img/portfolio/03-small.jpg"
    },
    {
      "title": "Project Title",
      "largeImage": "img/portfolio/04-large.jpg",
      "smallImage": "img/portfolio/04-small.jpg"
    },
    {
      "title": "Project Title",
      "largeImage": "img/portfolio/05-large.jpg",
      "smallImage": "img/portfolio/05-small.jpg"
    },
    {
      "title": "Project Title",
      "largeImage": "img/portfolio/06-large.jpg",
      "smallImage": "img/portfolio/06-small.jpg"
    },
    {
      "title": "Project Title",
      "largeImage": "img/portfolio/07-large.jpg",
      "smallImage": "img/portfolio/07-small.jpg"
    },
    {
      "title": "Project Title",
      "largeImage": "img/portfolio/08-large.jpg",
      "smallImage": "img/portfolio/08-small.jpg"
    },
    {
      "title": "Project Title",
      "largeImage": "img/portfolio/09-large.jpg",
      "smallImage": "img/portfolio/09-small.jpg"
    }
  ]

  return (
    <div id="portfolio" className="text-center">
      <Container className="container">
        <div className="section-title">
          <h2 className="h2">Gallery</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
            dapibus leonec.
          </p>
        </div>
        <Row className="row">
          <div className="portfolio-items" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {galleryData
              ? galleryData.map((d, i) => (
                <Col
                  key={`${d.title}-${i}`}
                  className="col-sm-6 col-md-4 col-lg-4"
                >
                  {/* <Image
                    title={d.title}
                    largeImage={d.largeImage}
                    smallImage={d.smallImage}
                  /> */}
                  <div className="portfolio-item">
                    <div className="hover-bg">
                      {" "}
                      <a href={d.largeImage} title={d.title} data-lightbox-gallery="gallery1">
                        <div className="hover-text">
                          <h4 className="h4">{d.title}</h4>
                        </div>
                        <img src={small1} className="img-responsive" alt={d.title} />{" "}
                      </a>{" "}
                    </div>
                  </div>
                </Col>
              ))
              : "Loading..."}
          </div>
        </Row>
      </Container>
    </div>
  );
};
