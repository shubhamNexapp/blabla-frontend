import React, { useEffect, useState } from "react";

import ReactApexChart from "react-apexcharts";

//import Breadcrumbs
import Breadcrumbs from "../../components/Common/Breadcrumb";

import { Card, CardBody, Col, Container, Row } from "reactstrap";

import CountUp from "react-countup";

/** import Mini Widget data */
// import { WidgetsData } from "../../common/data/dashboard";
import WalletBalance from "../../pages/Dashboard/WalletBalance";
import InvestedOverview from "../../pages/Dashboard/InvestedOverview";
import MarketOverview from "../../pages/Dashboard/MarketOverview";
import Locations from "../../pages/Dashboard/Locations";
import Trading from "../../pages/Dashboard/Trading";
import Transactions from "../../pages/Dashboard/Transactions";
import RecentActivity from "../../pages/Dashboard/RecentActivity";
import { getUserDetails } from "../../common/utility";
import { toast } from "react-toastify";
import { getAPI } from "../../Services/Apis";
import loader from "../../assets/images/instaone-loader.svg";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";

const DashboardCompo = () => {
  document.title = "Instaone";

  useEffect(() => {
    getTicketDetails();
  });
  const [ticketCount, setTicketCount] = useState();
  const [accepted, setAccepted] = useState();
  const [created, setCreated] = useState();
  const [done, setDone] = useState();
  const [progress, setProgress] = useState();
  const [reject, setReject] = useState();

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

        // const acceptedTickets = response?.data?.filter(
        //   (ticket) =>
        //     ticket.assign.includes(loginUser.userId) &&
        //     ticket.status == "accepted"
        // );
        // const doneTickets = response?.data?.filter(
        //   (ticket) =>
        //     ticket.assign.includes(loginUser.userId) && ticket.status == "done"
        // );
        // const createdTickets = response?.data?.filter(
        //   (ticket) =>
        //     ticket.assign.includes(loginUser.userId) &&
        //     ticket.status == "created"
        // );
        // const RejectTickets = response?.data?.filter(
        //   (ticket) =>
        //     ticket.assign.includes(loginUser.userId) &&
        //     ticket.status == "rejected"
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
      LoaderHide();
      toast.error(error.message);
    }
  };

  const WidgetsData = [
    {
      id: 1,
      title: "All Tickets",
      price: ticketCount,
      status: [
        {
          rank: done,
          stat: "Resolved",
          statusColor: "success",
        },
        {
          rank: reject,
          stat: "Cancel",
          statusColor: "danger",
        },
        {
          rank: progress,
          stat: "In Progress",
          statusColor: "warning",
        },
      ],

      rank: "+$20.9k",

      statusColor: "success",
      series: [2, 10, 18, 22, 36, 15, 47, 75, 65, 19, 14, 2, 47, 42, 15],
    },
    {
      id: 2,
      title: "Number of Customer",
      price: 58,
      rank: "-29 Trades",
      // isDoller: false,
      // statusColor: "danger",
      series: [15, 42, 47, 2, 14, 19, 65, 75, 47, 15, 42, 47, 2, 14, 12],
    },
    {
      id: 3,
      title: "Number of Vendor",
      price: 432,
      rank: "+$2.8k",
      // isDoller: true,
      // postFix: "M",
      // statusColor: "success",
      series: [47, 15, 2, 67, 22, 20, 36, 60, 60, 30, 50, 11, 12, 3, 8],
    },
    {
      id: 5,
      title: "Total Engineer",
      price: 157,
      rank: "+$2.75%",
      // isDoller: true,
      // postFix: "%",
      // statusColor: "success",
      series: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14, 2, 47, 42, 15],
    },
  ];

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
          {/* <Row>
            {(WidgetsData || []).map((widget, key) => (
              <Col xl={3} md={6} key={key}>
                <Card className="card-h-100">
                  <CardBody>
                    <Row className="align-items-center">
                      <Col xs={12}>
                        <span className="text-muted mb-3 lh-2 d-block text-truncate">
                          {widget.title}
                        </span>
                        <h4 className="mb-3">
                          <span className="counter-value">
                            <CountUp
                              start={0}
                              end={widget.price}
                              duration={2}
                              // decimals={2}
                              separator=""
                            />
                          </span>
                        </h4>
                      </Col>
                    </Row>
                    <div className="text-nowrap mb-2">
                      {widget.status && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            flexWrap: "wrap",
                          }}
                        >
                          {widget.status.map((item, index) => (
                            <span
                              key={index}
                              className={
                                "badge bg-" +
                                item?.statusColor +
                                "-subtle text-" +
                                item?.statusColor
                              }
                              style={{ fontSize: "12px" }}
                            >
                              {item.stat}: {item.rank}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row> */}
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


          {/* <Row>
            <WalletBalance />
            <Col>
              <Row> */}
          {/* <InvestedOverview /> */}
          {/* <NewSlider /> */}
          {/* </Row>
            </Col>
          </Row>
          Vendor 2nd form
          <Row>
            <MarketOverview />
            <Locations />
          </Row>
          <Row>
            <Trading />
            <Transactions />
            <RecentActivity />
          </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardCompo;
