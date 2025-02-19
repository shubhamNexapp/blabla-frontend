import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Collapse,
  Container,
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
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useParams, useLocation } from "react-router-dom";
import SingleCustomerAllTickets from "./SingleCustomerAllTickets";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop, DndProvider } from "react-dnd";

const SingleCustomer = () => {
  const location = useLocation(); // Access the location object to get state
  const [customerID, setCustomerID] = useState(location?.state);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [activeTab1, setactiveTab1] = useState("5");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const toggle1 = (tab) => {
    if (activeTab1 !== tab) {
      setactiveTab1(tab);
    }
  };
  return (
    <React.Fragment>
      <DndProvider backend={HTML5Backend}>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Customer" breadcrumbItem="Customer" />

            <Col lg={12}>
              <Card>
                <CardBody>
                  <Nav pills className="navtab-bg nav-justified">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab1 === "5",
                        })}
                        onClick={() => {
                          toggle1("5");
                        }}
                      >
                        Sites
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab1 === "6",
                        })}
                        onClick={() => {
                          toggle1("6");
                        }}
                      >
                        Tickets
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab1 === "7",
                        })}
                        onClick={() => {
                          toggle1("7");
                        }}
                      >
                        Invoices
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={activeTab1} className="p-3 text-muted">
                    <TabPane tabId="5">
                      <Row>
                        <Col sm="12">
                          <CustomerSite customerID={customerID} />
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="6">
                      <Row>
                        <Col sm="12">
                          <SingleCustomerAllTickets customerID={customerID} />
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="7">
                      <Row>
                        <Col sm="12">
                          <AdminParticularCustomerInvoice customerID={customerID} />
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                  <DndProvider />
                </CardBody>
              </Card>
            </Col>
          </Container>
        </div>
      </DndProvider>
    </React.Fragment>
  );
};

export default SingleCustomer;

//Import Breadcrumb
// import Breadcrumbs from "../../components/Common/Breadcrumb";

import classnames from "classnames";
import CustomerSite from "./CustomerSite";
import AdminParticularCustomerInvoice from "./AdminParticularCustomerInvoice";
