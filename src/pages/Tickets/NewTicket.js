import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { toast } from "react-toastify";
import { getAPI, postAPI } from "../../Services/Apis";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getUserDetails } from "../../common/utility";
import { Row, Col } from "reactstrap";
import loader from "../../assets/images/instaone-loader.svg";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";

const NewTicket = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState();
  const [allTickets, setAllTickets] = useState([]);
  const [user, setUser] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);

  const loginUser = getUserDetails();

  useEffect(() => {
    getUser();
    getAllTicket();
  }, []);

  const getUser = async () => {
    try {
      const data = {
        userId: loginUser?.userId,
      };
      const response = await postAPI("user/get-user", data);
      if (response.statusCode == 200) {
        setUser(response?.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllTicket = async () => {
    try {
      LoaderShow();
      const response = await getAPI("ticket/get-ticket");
      if (response.statusCode == 200) {
        // const filteredTickets = response?.data?.filter(
        //   (ticket) =>
        //     ticket.status === "created" &&
        //     ticket.assign.includes(loginUser.userId)
        // );
        const filteredTickets = response?.data?.filter((ticket) =>
          ticket.assign.some(
            (assignUser) =>
              assignUser.userId === loginUser.userId &&
              ticket.status === "created"
          )
        );
        setAllTickets(filteredTickets); // Store the original list
        setFilteredTickets(filteredTickets); // Initialize filtered list
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

  // Example usage
  const role = getRole();
  const acceptTicket = async (id) => {
    // event.preventDefault();
    try {
      let name;
      if (user?.role === "company") {
        name = user?.companyName;
      } else if (user?.role === "individual") {
        name = `${user?.firstName} ${user?.lastName}`;
      }
      LoaderShow();
      const data = {
        ticketID: id,
        userID: loginUser?.userId,
        name: name,
      };
      const response = await postAPI("ticket/update-ticket-assign", data);
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
      LoaderHide();
      toast.error(error.message);
    }
  };

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!image) {
      toast.error("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("submitDetails", image);
    formData.append("ticketID", "66cf10f764cb7f206c686416");

    setLoading(true);
    try {
      const response = await postAPI("ticket/submit-ticket-details", formData);

      if (response.statusCode === 200) {
        toast.success(response.message);
      } else {
        toast.error(response.message || "Failed to upload image.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
            {console.log("filteredTickets=========", filteredTickets)}
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
                            <strong className="mr-2">Service Price:</strong>
                          </h6>
                          <p
                            className="text-dark mb-0"
                            style={{ marginLeft: "15px" }}
                          >
                            ₹ {ticket?.servicePrice}
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
                            <b>{ticket?.ticketName}</b>
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
                            {moment(ticket?.dateRange[0]).format("DD-MM-YYYY ")}{" "}
                            to{" "}
                            {moment(ticket?.dateRange[1]).format("DD-MM-YYYY ")}
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
                            onClick={() => acceptTicket(ticket?._id)}
                            className="btn btn-success"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  </Col>
                  // <Box
                  //   sx={{
                  //     width: "100%",
                  //     maxWidth: 500,
                  //     display: "grid",
                  //     gridTemplateColumns:
                  //       "repeat(auto-fill, minmax(240px, 1fr))",
                  //     gap: 2,
                  //   }}
                  // >
                  //   <Card variant="outlined">
                  //     <CardContent>
                  //       <Typography level="title-md">
                  //         Outlined card (default)
                  //       </Typography>
                  //       <Typography>Description of the card.</Typography>
                  //     </CardContent>
                  //   </Card>
                  // </Box>
                ))
            ) : (
              <p>No tickets available</p>
            )}
          </Row>
          {/* <>
            {ticket?.status === "accepted" ? (
              <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">Ticket Details</h5>
                </div>

                <div className="card-body">
                  <div className="mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                  </div>

                  <div className="text-center">
                    <button
                      className="btn btn-success"
                      onClick={handleFileUpload}
                      disabled={loading}
                    >
                      {loading ? "Uploading..." : "Submit Details"}
                    </button>
                  </div>
                </div>
              </div>
            ) : ticket?.status === "done" ? (
              <>
                <Typography variant="h4" component="h1" gutterBottom>
                  This ticket is already accepted
                </Typography>
              </>
            ) : (
              <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
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
                      750
                    </p>
                  </div>

                 
                  <div className="mb-3 d-flex">
                    <h6 className="text-muted">
                      <strong>End User:</strong>
                    </h6>
                    <p
                      className="text-dark mb-0 ml-2"
                      style={{ marginLeft: "15px" }}
                    >
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>

        
                  <div className="mb-3 d-flex">
                    <h6 className="text-muted">
                      <strong>Site Address:</strong>
                    </h6>
                    <p
                      className="text-dark mb-0 ml-2"
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
                      className="text-dark mb-0 ml-2"
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
                      className="text-dark mb-0 ml-2"
                      style={{ marginLeft: "15px" }}
                    >
                      {ticket?.ticketDescription}
                    </p>
                  </div>

                  <div className="text-center">
                    <button onClick={acceptTicket} className="btn btn-success">
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            )}
          </> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NewTicket;
