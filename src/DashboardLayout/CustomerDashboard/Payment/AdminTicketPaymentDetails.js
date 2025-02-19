import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Row, Card, CardBody, CardHeader } from "reactstrap";

import {
  LoaderHide,
  LoaderShow,
  statusBadge,
  ticketNameStyle,
} from "../../../helpers/common_constants";
import { getAPI } from "../../../Services/Apis";
import loader from "../../../assets/images/instaone-loader.svg";

const AdminTicketPaymentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ticket, setTicket] = useState(location?.state?.ticketData);
  const [paymentDetails, setPaymentDetails] = useState();

  useEffect(() => {
    getTicketDetails();
  }, []);

  const getTicketDetails = async () => {
    try {
      LoaderShow();
      const response = await getAPI("payment/all");
      if (response.statusCode === 200) {
        const matchingPayment = response?.data?.items?.find(
          (item) => item?.id === ticket?.paymentId
        );
        setPaymentDetails(matchingPayment);
      }
      LoaderHide();
    } catch (error) {
      LoaderHide();
    }
  };

  const back = () => {
    const basePath = location.pathname.split("/").slice(0, 3).join("/");
    if (basePath === "/customer/ticket-payment-details") {
      navigate(`/customer/payment`);
    } else if (basePath === "/admin/ticket-payment-details") {
      navigate(`/admin/payment`);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "created":
        return { backgroundColor: "rgb(234 165 49)", color: "white" };
      case "accepted":
        return { backgroundColor: "#4ba6ef", color: "white" };
      case "rejected":
        return { backgroundColor: "red", color: "white" };
      case "done":
        return { backgroundColor: "green", color: "white" };
      default:
        return { backgroundColor: "#4ba6ef", color: "white" };
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div
          id="hideloding"
          className="loding-display"
          style={{ display: "none" }}
        >
          <img src={loader} alt="loader-img" />
        </div>
        <Container style={{ marginTop: "10px" }}>
          <Row>
            <div className="col-12">
              <Card>
                <CardHeader>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={ticketNameStyle}>{ticket.ticketName}</h2>
                    <h2
                      style={{
                        ...statusBadge,
                        ...getStatusClass(ticket?.status),
                      }}
                    >
                      {`${ticket?.status[0]?.toUpperCase()}${ticket?.status?.slice(
                        1
                      )}`}
                    </h2>
                  </div>
                </CardHeader>
                <CardBody>
                  <dl className="row mb-0">
                    <dt className="col-sm-3">Ticket ID</dt>
                    <dd className="col-sm-9">
                      <b>{ticket?.ticketID}</b>{" "}
                    </dd>

                    <dt className="col-sm-3">Customer Name</dt>
                    <dd className="col-sm-9">{ticket?.customerName}</dd>

                    <dt className="col-sm-3">Vendor Name</dt>
                    <dd className="col-sm-9">{ticket?.vendorName}</dd>

                    <dt className="col-sm-3">Total Payment</dt>
                    <dd className="col-sm-9">₹ {ticket?.totalPayment}</dd>

                    <dt className="col-sm-3">Transaction ID</dt>
                    <dd className="col-sm-9">{ticket?.transactionId}</dd>

                    {paymentDetails && (
                      <>
                        <dt className="col-sm-3">Order ID</dt>
                        <dd className="col-sm-9">{paymentDetails?.order_id}</dd>

                        <dt className="col-sm-3">Method</dt>
                        <dd className="col-sm-9">{paymentDetails?.method}</dd>

                        <dt className="col-sm-3">Email</dt>
                        <dd className="col-sm-9">{paymentDetails?.email}</dd>

                        <dt className="col-sm-3">Status</dt>
                        <dd className="col-sm-9">{paymentDetails?.status}</dd>

                        <dt className="col-sm-3">VPA</dt>
                        <dd className="col-sm-9">{paymentDetails?.vpa}</dd>

                        <dt className="col-sm-3">Payment Time</dt>
                        <dd className="col-sm-9">
                          {new Date(
                            paymentDetails?.created_at * 1000
                          )?.toLocaleString() || ""}
                        </dd>
                      </>
                    )}

                    <dt className="col-sm-3">
                      <button onClick={back} className="btn btn-info">
                        Back
                      </button>
                    </dt>
                  </dl>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AdminTicketPaymentDetails;
