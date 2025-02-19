import React, { useEffect, useState } from "react";

import ReactApexChart from "react-apexcharts";

//import Breadcrumbs
import Breadcrumbs from "../../components/Common/Breadcrumb";

import { Card, CardBody, Col, Container, Row } from "reactstrap";

import CountUp from "react-countup";
import { getUserDetails } from "../../common/utility";
import { toast } from "react-toastify";
import { getAPI } from "../../Services/Apis";
/** import Mini Widget data */
import { WidgetsData } from "../../common/data/dashboard";
import WalletBalance from "../../pages/Dashboard/WalletBalance";
import InvestedOverview from "../../pages/Dashboard/InvestedOverview";
import MarketOverview from "../../pages/Dashboard/MarketOverview";
import Locations from "../../pages/Dashboard/Locations";
import Trading from "../../pages/Dashboard/Trading";
import Transactions from "../../pages/Dashboard/Transactions";
import RecentActivity from "../../pages/Dashboard/RecentActivity";
import loader from "../../assets/images/instaone-loader.svg";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";

// import NewSlider from './NewSlider';

const options = {
  chart: {
    height: 50,
    type: "line",
    toolbar: { show: false },
    sparkline: {
      enabled: true,
    },
  },
  colors: ["#5156be"],
  stroke: {
    curve: "smooth",
    width: 2,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  tooltip: {
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function (seriesName) {
          return "";
        },
      },
    },
    marker: {
      show: false,
    },
  },
};

const CompanyDashboard = () => {
  //meta title
  document.title = "Instaone";

  const [ticketCount, setTicketCount] = useState();
  const [accepted, setAccepted] = useState();
  const [done, setDone] = useState();
  const [progress, setProgress] = useState();
  const [reject, setReject] = useState();
  const [created, setCreated] = useState();

  useEffect(() => {
    getTicketDetails();
  });

  const loginUser = getUserDetails();
  const getTicketDetails = async () => {
    try {
      LoaderShow();
      const response = await getAPI("ticket/get-ticket");
      if (response.statusCode === 200) {
        const filteredTickets = response?.data?.filter((item) =>
          item.assign.some((assignee) => assignee.userId === loginUser?.userId)
        );

        const acceptedTickets = filteredTickets?.filter(
          (ticket) => ticket.status == "accepted"
        );

        const doneTickets = filteredTickets?.filter(
          (ticket) => ticket.status == "done"
        );

        const RejectTickets = filteredTickets?.filter(
          (ticket) => ticket.status == "rejected"
        );

        const createdTickets = filteredTickets?.filter(
          (ticket) => ticket.status == "created"
        );

        const progressTickets = filteredTickets?.filter(
          (ticket) => ticket.status == "in-progress"
        );

        // const filteredTickets = response?.data?.filter((ticket) =>
        //   ticket?.assign?.includes(loginUser?.userId)
        // );
        // const doneTickets = response?.data?.filter(
        //   (ticket) =>
        //     ticket.assign.includes(loginUser.userId) && ticket.status == "done"
        // );
        // const RejectTickets = response?.data?.filter(
        //   (ticket) =>
        //     ticket.assign.includes(loginUser.userId) &&
        //     ticket.status == "rejected"
        // );
        // const createdTickets = response?.data?.filter(
        //   (ticket) =>
        //     ticket.assign.includes(loginUser.userId) &&
        //     ticket.status == "created"
        // );
        // const progressTickets = response?.data?.filter(
        //   (ticket) =>
        //     ticket.assign.includes(loginUser.userId) &&
        //     ticket.status == "in-progress"
        // );
        setAccepted(acceptedTickets?.length);
        setDone(doneTickets?.length);
        setReject(RejectTickets?.length);
        setProgress(progressTickets?.length);
        setTicketCount(filteredTickets?.length);
        setCreated(createdTickets.length);
        LoaderHide();
      }
    } catch (error) {
      toast.error(error.message);
      LoaderHide();
    }
  };



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
                        <b>All Tickets</b>
                      </span>
                      <h4 className="mb-3">
                        <span className="counter-value">
                          <CountUp
                            start={0}
                            end={ticketCount}
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
                        created : {created}
                      </span>
                    </div>
                    <div>
                      <span
                        className={"badge bg-secondary-subtle text-secondary"}
                        style={{ fontSize: "12px" }}
                      >
                        accepted : {accepted}
                      </span>
                    </div>
                    <div>
                      <span
                        className={"badge bg-success-subtle text-success"}
                        style={{ fontSize: "12px" }}
                      >
                        done : {done}
                      </span>
                    </div>
                    <div>
                      <span
                        className={"badge bg-danger-subtle text-danger"}
                        style={{ fontSize: "12px" }}
                      >
                        cancel : {reject}
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

export default CompanyDashboard;
