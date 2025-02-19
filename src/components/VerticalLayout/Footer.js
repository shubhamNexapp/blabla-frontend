import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>{new Date().getFullYear()} © InstaOne.</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                Powered By
                  <Link
                    to="https://nexapp.co.in/"
                    className="ms-1 text-decoration-underline"
                  >
                    Nexapp
                  </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
