import React, { useEffect, useState } from "react";

import ReactApexChart from "react-apexcharts";

//import Breadcrumbs
import Breadcrumbs from "../../components/Common/Breadcrumb";

import { Card, CardBody, Col, Container, Row } from "reactstrap";

import CountUp from "react-countup";


import { getAPI, postAPI } from "../../Services/Apis";
import { toast } from "react-toastify";
import { getUserDetails } from "../../common/utility";
import loader from "../../assets/images/instaone-loader.svg";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";

const CustomerDashboard = () => {
  document.title = "Instaone";

  const [ticket, setTicket] = useState([]);
  const [services, setServices] = useState([]);
  const [user, setUser] = useState([]);
  const [allSites, setAllSites] = useState();
  const [allVendors, setAllVendors] = useState();
  const loginUser = getUserDetails();

  function getRole() {
    const authUser = localStorage.getItem("authUser");

    if (authUser) {
      const user = JSON.parse(authUser);
      return user.role;
    }

    return null;
  }
  const role = getRole();

  useEffect(() => {
    getTicketDetails();
    getServicesDetails();
    getUsers();
    getSiteDetails();
  }, []);

  const getUsers = async () => {
    try {
      LoaderShow();
      const response = await getAPI("auth/all-user");
      if (response.statusCode === 200) {
        const allVendors = response?.users?.filter(
          (user) => user.role != "customer" && user.role != "admin"
        );
        setUser(response.users);
        setAllVendors(allVendors);
        LoaderHide();
      }
    } catch (error) {
      toast.error(error.message);
      LoaderHide();
    }
  };

  const getServicesDetails = async () => {
    try {
      const response = await getAPI("service/get-service");
      if (response.statusCode === 200) {
        setServices(response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getTicketDetails = async () => {
    try {
      const response = await getAPI("ticket/get-ticket");
      if (response.statusCode === 200) {
        const filteredTickets = response?.data?.filter(
          (ticket) => ticket.userId === loginUser.userId
        );
        {
          role == "customer" && setTicket(filteredTickets);
        }
        {
          role == "admin" && setTicket(output);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSiteDetails = async () => {
    const logindata = {
      userId: loginUser.userId,
    };
    try {
      const response = await postAPI("site/get-site", logindata);
      if (response.statusCode === 200) {
        setAllSites(response.data);
        console.log(response.data);
      }
    } catch (error) {
      // toast.error(error.message);
      console.log(error);
    }
  };

  const individualUsers = user?.filter((e) => e.role === "individual").length;
  const companyUsers = user?.filter((e) => e.role === "company").length;
  const customerUsers = user?.filter((e) => e.role === "customer").length;

  const acceptedTickets = ticket?.filter((e) => e.status === "accepted").length;
  const inProgressTickets = ticket?.filter(
    (e) => e.status === "in-progress"
  ).length;
  const doneTickets = ticket?.filter((e) => e.status === "done").length;
  const cancelTickets = ticket?.filter((e) => e.status === "rejected").length;
  const createdTickets = ticket?.filter((e) => e.status === "created").length;

  const categoryCount = services?.reduce(
    (acc, { category }) => ((acc[category] = (acc[category] || 0) + 1), acc),
    { software: 0, hardware: 0 }
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Dashboard" breadcrumbItem="Dashboard" />
          <div
            id="hideloding"
            className="loding-display"
            style={{ display: "none" }}
          >
            <img src={loader} alt="loader-img" />
          </div>
          <Row>
            <Col xl={3} md={6}>
              <Card className="card-h-100">
                <CardBody>
                  <Row className="align-items-center">
                    <Col xs={12}>
                      <span className="text-muted mb-3 lh-2 d-block text-truncate">
                        <b> All Sites</b>
                      </span>
                      <h4 className="mb-3">
                        <span className="counter-value">
                          <CountUp
                            start={0}
                            end={allSites?.length}
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
                        sites : {allSites?.length}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card className="card-h-100">
                <CardBody>
                  <Row className="align-items-center">
                    <Col xs={12}>
                      <span className="text-muted mb-3 lh-2 d-block text-truncate">
                        <b>All Tickets</b>
                      </span>
                      <h4 className="mb-3">
                        <span className="counter-value">
                          <CountUp
                            start={0}
                            end={ticket?.length}
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
                        className={"badge bg-warning"}
                        style={{ fontSize: "12px" }}
                      >
                        created : {createdTickets}
                      </span>
                    </div>
                    <div>
                      <span
                        className={"badge bg-secondary-subtle text-secondary"}
                        style={{ fontSize: "12px" }}
                      >
                        accepted : {acceptedTickets}
                      </span>
                    </div>
                    {/* <div>
                      <span
                        className={"badge bg-info-subtle text-info"}
                        style={{ fontSize: "12px" }}
                      >
                        Inprogress : {inProgressTickets}
                      </span>
                    </div> */}
                    <div>
                      <span
                        className={"badge bg-success-subtle text-success"}
                        style={{ fontSize: "12px" }}
                      >
                        done : {doneTickets}
                      </span>
                    </div>
                    <div>
                      <span
                        className={"badge bg-danger-subtle text-danger"}
                        style={{ fontSize: "12px" }}
                      >
                        cancel : {cancelTickets}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
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
                            end={services?.length}
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
                        software : {categoryCount?.software}
                      </span>
                    </div>
                    <div>
                      <span
                        className={"badge bg-info-subtle text-info"}
                        style={{ fontSize: "12px" }}
                      >
                        hardware : {categoryCount?.hardware}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card className="card-h-100">
                <CardBody>
                  <Row className="align-items-center">
                    <Col xs={12}>
                      <span className="text-muted mb-3 lh-2 d-block text-truncate">
                        <b>No. of Vendors</b>
                      </span>
                      <h4 className="mb-3">
                        <span className="counter-value">
                          <CountUp
                            start={0}
                            end={allVendors?.length}
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
                        company : {companyUsers}
                      </span>
                    </div>
                    <div>
                      <span
                        className={"badge bg-info-subtle text-info"}
                        style={{ fontSize: "12px" }}
                      >
                        individual : {individualUsers}
                      </span>
                    </div>
                    {/* <div>
                      <span
                        className={"badge bg-danger-subtle text-danger"}
                        style={{ fontSize: "12px" }}
                      >
                        Customers : {customerUsers}
                      </span>
                    </div> */}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            {/* <WalletBalance /> */}
            <Col>
              <Row>
                {/* <InvestedOverview /> */}
                {/* <NewSlider /> */}
              </Row>
            </Col>
          </Row>
          {/* Vendor 2nd form */}
          <Row>
            {/* <MarketOverview />
            <Locations /> */}
          </Row>
          <Row>
            {/* <Trading />
            <Transactions />
            <RecentActivity /> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CustomerDashboard;
