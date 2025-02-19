import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { toast } from "react-toastify";
import { getAPI, postAPI } from "../../Services/Apis";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getUserDetails } from "../../common/utility";
import { Row, Col } from "reactstrap";
import loader from "../../assets/images/instaone-loader.svg";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";

const InProgressTickets = () => {
  const navigate = useNavigate();

  const [allTickets, setAllTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);

  const loginUser = getUserDetails();

  useEffect(() => {
    getAllTicket();
  }, []);

  const getAllTicket = async () => {
    try {
      LoaderShow();
      const response = await getAPI("ticket/get-ticket");
      if (response.statusCode == 200) {
        // const filteredTickets = response?.data?.filter(
        //   (ticket) =>
        //     ticket.status === "accepted" &&
        //     ticket.assign.includes(loginUser.userId)
        // );
        const acceptedTickets = response?.data?.filter((ticket) =>
          ticket.assign.some(
            (assignUser) =>
              assignUser.userId === loginUser.userId &&
              ticket.status === "accepted"
          )
        );
        setAllTickets(acceptedTickets); // Store the original list
        setFilteredTickets(acceptedTickets); // Initialize filtered list
        LoaderHide();
      }
    } catch (error) {
      toast.error(error.message);
      LoaderHide();
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredTickets(allTickets); // Reset if empty
      return;
    }

    const filtered = allTickets.filter((ticket) =>
      (ticket.ticketID || "").toLowerCase().includes(query)
    );
    setFilteredTickets(filtered);
  };

  function getRole() {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.role;
    }
    return null;
  }

  const role = getRole();

  const viewTicket = async (ticket) => {
    if (role == "company") {
      navigate(`/company/particular-ticket/${ticket._id}`, {
        state: {
          row: ticket,
        },
      });
    } else {
      navigate(`/individual/particular-ticket/${ticket._id}`, {
        state: {
          row: ticket,
        },
      });
    }
  };

  const cancelTicket = async (id) => {
    try {
      LoaderShow();
      const data = {
        _id: id,
      };
      const response = await postAPI("ticket/cancel-ticket", data);
      if (response.statusCode == 200) {
        toast.success(response.message);
        if (role == "company") {
          navigate(`/company/tickets`);
        } else {
          navigate("/individual/tickets");
        }
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
        <Container style={{ marginTop: "10px" }}>
          <Row className="justify-content-center">
            <div
              id="hideloding"
              className="loding-display"
              style={{ display: "none" }}
            >
              <img src={loader} alt="loader-img" />
            </div>
            <input
              type="text"
              placeholder="Search by ticket ID..."
              value={searchQuery}
              onChange={handleSearch}
              style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
            />
            {filteredTickets && filteredTickets.length > 0 ? (
              filteredTickets
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((ticket, index) => (
                  <Col md={6} lg={4} key={index} className="mb-4">
                    <div className="card shadow-lg h-100">
                      <div className="card-header bg-primary text-white text-center">
                        <h5 className="card-title mb-0">Ticket Details</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3 d-flex">
                          <h6 className="text-muted">
                            <strong className="mr-2">Reward:</strong>
                          </h6>
                          <p
                            className="text-dark mb-0"
                            style={{ marginLeft: "15px" }}
                          >
                            {ticket?.servicePrice}
                          </p>
                        </div>
                        <div className="mb-3 d-flex">
                          <h6 className="text-muted">
                            <strong className="mr-2">Ticket ID:</strong>
                          </h6>
                          <p
                            className="text-dark mb-0"
                            style={{ marginLeft: "15px" }}
                          >
                            <b>{ticket?.ticketID}</b>
                          </p>
                        </div>
                        <div className="mb-3 d-flex">
                          <h6 className="text-muted">
                            <strong>Ticket Name:</strong>
                          </h6>
                          <p
                            className="text-dark mb-0"
                            style={{ marginLeft: "15px" }}
                          >
                            <b> {ticket?.ticketName}</b>
                          </p>
                        </div>
                        <div className="mb-3 d-flex">
                          <h6 className="text-muted">
                            <strong>Service Name:</strong>
                          </h6>
                          <p
                            className="text-dark mb-0"
                            style={{ marginLeft: "15px" }}
                          >
                            {ticket?.services}
                          </p>
                        </div>
                        <div className="mb-3 d-flex">
                          <h6 className="text-muted">
                            <strong>Service Price:</strong>
                          </h6>
                          <p
                            className="text-dark mb-0"
                            style={{ marginLeft: "15px" }}
                          >
                            {ticket?.servicePrice}
                          </p>
                        </div>
                        <div className="mb-3 d-flex">
                          <h6 className="text-muted">
                            <strong>Site Address:</strong>
                          </h6>
                          <p
                            className="text-dark mb-0"
                            style={{ marginLeft: "15px" }}
                          >
                            {ticket?.siteAddress}
                          </p>
                        </div>
                        <div className="mb-3 d-flex">
                          <h6 className="text-muted">
                            <strong>Date Range:</strong>
                          </h6>
                          <p
                            className="text-dark mb-0"
                            style={{ marginLeft: "15px" }}
                          >
                            {moment(ticket?.dateRange[0]).format(
                              "DD-MM-YYYY hh:mm A"
                            )}{" "}
                            to{" "}
                            {moment(ticket?.dateRange[1]).format(
                              "DD-MM-YYYY hh:mm A"
                            )}
                          </p>
                        </div>
                        <div className="mb-3 d-flex">
                          <h6 className="text-muted">
                            <strong>Description:</strong>
                          </h6>
                          <p
                            className="text-dark mb-0"
                            style={{ marginLeft: "15px" }}
                          >
                            {ticket?.sowDescription}
                          </p>
                        </div>
                        <div className="text-center">
                          <button
                            onClick={() => viewTicket(ticket)}
                            className="btn btn-success mr-2"
                            style={{ marginRight: "25px" }}
                          >
                            View Ticket
                          </button>
                          <button
                            onClick={() => cancelTicket(ticket._id)}
                            className="btn btn-danger"
                          >
                            Cancel Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))
            ) : (
              <p>No tickets available</p>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default InProgressTickets;
