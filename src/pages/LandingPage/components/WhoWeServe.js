import React, { useState } from "react";
import Container from "react-bootstrap/Container";

import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledDropdown,
} from "reactstrap";
import classnames from "classnames";

const WhoWeServe = () => {
  const [verticalActiveTab, setverticalActiveTab] = useState("1");

  const toggleVertical = (tab) => {
    if (verticalActiveTab !== tab) {
      setverticalActiveTab(tab);
    }
  };
  return (
    <Container className="serveContainer">
      <Col className="col-md-12  serve-section-title">
        <h2 className="h2" style={{ textTransform: "capitalize" }}>
          Who we serve
        </h2>
        <p>
          Flexible Field Solutions to Fit Every Business Need, From Startups to
          Enterprises.
        </p>
      </Col>
      <div className="row" style={{ alignItems: "center" }}>
        {/* <Col className="serve-row-wrapper col-xs-12 col-md-6">
                    <Row> Small and Medium Businesses (SMBs) </Row>
                    <Row> Small and Medium Businesses (SMBs) </Row>
                    <Row> Small and Medium Businesses (SMBs) </Row>
                </Col>
                <Col className="col-xs-12 col-md-6">
                    Need quick, reliable service without the overhead of managing a dedicated team? Our platform connects SMBs to trusted vendors for tasks like network setup, PC installations, and device maintenance—delivering quality service, every time

                </Col> */}

        <div className="card-wrapper">
          <Card style={{ border: "0px", marginTop: "10px" }}>
            <CardBody>
              <Row style={{ alignItems: "center" }}>
                <Col md="4">
                  <Nav
                    pills
                    className="flex-column"
                    style={{ gap: "28px", fontSize: "16px" }}
                  >
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: verticalActiveTab === "1",
                        })}
                        onClick={() => {
                          toggleVertical("1");
                        }}
                      >
                        Small and Medium Businesses
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: verticalActiveTab === "2",
                        })}
                        onClick={() => {
                          toggleVertical("2");
                        }}
                      >
                        Enterprise level organisations
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: verticalActiveTab === "3",
                        })}
                        onClick={() => {
                          toggleVertical("3");
                        }}
                      >
                        Individual professionals and vendors
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
                <Col></Col>
                <Col
                  md="6"
                  style={{
                    backgroundColor: "rgb(255, 249, 240)",
                    fontSize: "17px",
                    padding: "40px 30px",
                    color: "black",
                    borderRadius: "15px",
                    fontWeight: "700",
                    textAlign: "left",
                  }}
                >
                  <TabContent
                    activeTab={verticalActiveTab}
                    className="text-muted mt-4 mt-md-0"
                  >
                    <TabPane tabId="1">
                      <p>
                        Looking for quick and reliable service without the
                        burden of managing a dedicated team? Instaone will
                        connect SMBs with trusted vendors for essential tasks
                        like network setup, PC installations, and device
                        maintenance—ensuring quality service every time.
                      </p>
                    </TabPane>
                    <TabPane tabId="2">
                      <p>
                        We support enterprise-level organizations with
                        multi-site installations and large-scale IT support,
                        enabling seamless outsourcing of field services. Manage
                        complex service requests, track progress, and ensure
                        compliance from a unified platform.
                      </p>
                    </TabPane>
                    <TabPane tabId="3">
                      <p>
                        As a technician or vendor, our platform empowers your
                        business. Get instant alerts for new service requests,
                        easily accept jobs, and benefit from fast payments
                        through our integrated payment system.
                      </p>
                    </TabPane>
                  </TabContent>
                </Col>
                <Col></Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default WhoWeServe;
