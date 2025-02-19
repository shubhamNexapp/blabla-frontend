import React, { useState, useEffect } from "react";
import {
  CardBody,
  Container,
  Form,
  NavItem,
  TabContent,
  TabPane,
  NavLink,
  UncontrolledTooltip,
  Card,
  CardHeader,
} from "reactstrap";
import { Button, FormGroup, Input, Row, Col } from "reactstrap";
import "../../../assets/scss/userSelection.css";
import { useNavigate } from "react-router-dom";

const UserSelection = () => {
  let navigate = useNavigate();
  const reDirect = () => {
    navigate("/registration-details");
  };

  const reDirectCustomer = () => {
    navigate("/customer-registration-details");
  };

  const redirectISP = () => {
    navigate("/isp-registration-details");
  };
  // customer-registration-details
  return (
    <React.Fragment>
      <div className="user-selection-wrapper">
        <div>
          <h1 className="mb-1">How do you plan to use?</h1>
          <div>Please choose from one of the options below.</div>
        </div>
        <Container fluid>
          <Row>
            <Col onClick={reDirect}>
              <div className="service-icons">
                <i className="mdi  mdi-48px mdi-remote-desktop "></i>
              </div>

              {/* mdi-remote-desktop */}
              <div className="col-heading">Service Partner</div>
              <div>
                A service partner is an external vendor or organization that
                collaborates with a nexapp to provide specific services and
                suppor{" "}
              </div>
            </Col>
            <Col onClick={reDirectCustomer}>
              <div className="service-icons">
                <i className="mdi  mdi-48px mdi-account"></i>
              </div>
              <div className="col-heading">Customer </div>
              <div>
                A customer is an individual or organization that purchases
                services from a Nexapp.{" "}
              </div>
            </Col>
            {/* <Col onClick={redirectISP}>
              <div className="service-icons">
                <i className="mdi  mdi-48px mdi-satellite-uplink"></i>
              </div>
              <div className="col-heading">ISP </div>
              <div>
                An Internet Service Provider (ISP) is a Brodband service that offers access to the internet and related services to individuals and companies.{" "}
              </div>
            </Col> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserSelection;
