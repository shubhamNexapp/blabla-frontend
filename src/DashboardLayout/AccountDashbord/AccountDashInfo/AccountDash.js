import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import CountUp from "react-countup";

const AccountDashbord = () => {
  //meta title
  document.title = "Instaone";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xl={3} md={6}>
              <Card className="card-h-100">
                <CardBody>
                  <Row className="align-items-center">
                    <Col xs={12}>
                      <span className="text-muted mb-3 lh-2 d-block text-truncate">
                        <b>All Services</b>
                      </span>
                      <h4 className="mb-3">
                        <span className="counter-value">
                          <CountUp
                            start={0}
                            end={10}
                            duration={2}
                            separator=""
                          />
                        </span>
                      </h4>
                    </Col>
                  </Row>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      flexWrap: "wrap",
                      marginBottom: "15px",
                    }}
                  >
                    <div>
                      <span
                        className={"badge bg-success-subtle text-success"}
                        style={{ fontSize: "12px" }}
                      >
                        software : {5}
                      </span>
                    </div>
                    <div>
                      <span
                        className={"badge bg-info-subtle text-info"}
                        style={{ fontSize: "12px" }}
                      >
                        hardware : {5}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AccountDashbord;
