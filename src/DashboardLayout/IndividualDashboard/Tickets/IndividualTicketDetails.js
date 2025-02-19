import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Row, Card, CardBody, CardHeader } from "reactstrap";

import moment from "moment";
import {
  filesButtonStyle,
  statusBadge,
  ticketNameStyle,
} from "../../../helpers/common_constants";
import { toast } from "react-toastify";

const IndividualTicketDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [ticket, setTicket] = useState(location?.state?.ticketData);
  console.log(location)
  console.log(ticket)
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


  const back = () => {
    if (role == "company") {
      navigate(`/company/tickets`);

    } else {
      navigate('/individual/tickets')
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

  // Utility function to check if the file is an image (returns true if image)
  const isImage = (fileUrl) => {
    return fileUrl?.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  // Function to download the file and handle different types
  const download = (fileUrl, filenameInitial, ticketID) => {
    fetch(fileUrl, {
      method: "GET",
      headers: {},
    })
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const blob = new Blob([buffer]); // Create a Blob object from the buffer
        const url = window.URL.createObjectURL(blob);

        // Extract the file name from the URL
        const fileName = fileUrl.split("/").pop(); // Get the last part of the URL
        let prefixedFileName;
        if (filenameInitial === "sow") {
          prefixedFileName = `sow_${fileName}`;
        } else if (filenameInitial === "irFile") {
          prefixedFileName = `irFile_${fileName}`;
        } else if (filenameInitial === "completedWork") {
          prefixedFileName = `completedWork_${fileName}`;
        } else if (filenameInitial === "vendorIRFile") {
          prefixedFileName = `vendorIRFile_${fileName}`;
        } else if (filenameInitial === "invoiceFile") {
          prefixedFileName = `invoice_${ticketID}.pdf`;
        } else {
          prefixedFileName = `${fileName}`;
        }
        // Create a temporary link element for downloading the file
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", prefixedFileName); // Set the prefixed file name
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the link after download
      })
      .catch((err) => {
        toast.error("Error downloading the file", err);
      });
  };

  return (
    <React.Fragment>
      <div className="page-content">
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
                    <dt className="col-sm-3">Reward</dt>
                    <dd className="col-sm-9">{ticket?.servicePrice} </dd>

                    <dt className="col-sm-3">Ticket ID</dt>
                    <dd className="col-sm-9">
                      <b>{ticket?.ticketID}</b>{" "}
                    </dd>

                    <dt className="col-sm-3">Service Name</dt>
                    <dd className="col-sm-9">{ticket?.services}</dd>

                    <dt className="col-sm-3">Service Price</dt>
                    <dd className="col-sm-9">{ticket?.servicePrice}</dd>

                    <dt className="col-sm-3">Site Address</dt>
                    <dd className="col-sm-9">{ticket?.siteAddress}</dd>

                    <dt className="col-sm-3">Site ID</dt>
                    <dd className="col-sm-9">{ticket?.siteID}</dd>

                    <dt className="col-sm-3">Date Range</dt>
                    <dd className="col-sm-9">
                      {" "}
                      {moment(ticket?.dateRange[0]).format(
                        "DD-MM-YYYY hh:mm A"
                      )}{" "}
                      to{" "}
                      {moment(ticket?.dateRange[1]).format(
                        "DD-MM-YYYY hh:mm A"
                      )}
                    </dd>

                    <dt className="col-sm-3">Description</dt>
                    <dd className="col-sm-9"> {ticket?.sowDescription}</dd>

                    <dt className="col-sm-3">Local Contact Name</dt>
                    <dd className="col-sm-9">{ticket?.localContactName}</dd>

                    <dt className="col-sm-3">Local Contact Number</dt>
                    <dd className="col-sm-9">{ticket?.mobileNumber}</dd>

                    <dt className="col-sm-3">Start Time</dt>
                    <dd className="col-sm-9">{ticket?.startTime}</dd>

                    <dt className="col-sm-3">End Time</dt>
                    <dd className="col-sm-9">{ticket?.endTime}</dd>

                    <dt className="col-sm-3">SOW</dt>
                    <dd className="col-sm-9">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {ticket?.profile && (
                          <>
                            <button
                              type="button"
                              style={filesButtonStyle}
                              onClick={() => download(ticket?.profile, "sow")}
                            >
                              Download SOW File
                            </button>
                            <a
                              href={ticket?.profile}
                              target="_blank" // This opens the file in a new tab
                              rel="noopener noreferrer" // Security measure to prevent the new tab from accessing your page's window object
                              style={{
                                marginLeft: "10px",
                                textDecoration: "none",
                              }}
                            >
                              <button type="button" style={filesButtonStyle}>
                                View SOW File
                              </button>
                            </a>
                          </>
                        )}
                      </div>
                    </dd>

                    <dt className="col-sm-3">IR File</dt>
                    <dd className="col-sm-9">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {ticket?.irFile && (
                          <>
                            <button
                              type="button"
                              style={filesButtonStyle}
                              onClick={() => download(ticket?.irFile, "irFile")}
                            >
                              Download IR File
                            </button>
                            <a
                              href={ticket?.irFile}
                              target="_blank" // This opens the file in a new tab
                              rel="noopener noreferrer" // Security measure to prevent the new tab from accessing your page's window object
                              style={{
                                marginLeft: "10px",
                                textDecoration: "none",
                              }}
                            >
                              <button type="button" style={filesButtonStyle}>
                                View IR File
                              </button>
                            </a>
                          </>
                        )}
                      </div>
                    </dd>

                    <dt className="col-sm-3">Invoice</dt>
                    <dd className="col-sm-9">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {ticket?.invoiceFile && (
                          <>
                            <button
                              type="button"
                              style={filesButtonStyle}
                              onClick={() =>
                                download(
                                  ticket?.invoiceFile,
                                  "invoiceFile",
                                  ticket?.ticketID
                                )
                              }
                            >
                              Download Invoice
                            </button>
                            <a
                              href={ticket?.invoiceFile}
                              target="_blank" // This opens the file in a new tab
                              rel="noopener noreferrer" // Security measure to prevent the new tab from accessing your page's window object
                              style={{
                                marginLeft: "10px",
                                textDecoration: "none",
                              }}
                            >
                              <button type="button" style={filesButtonStyle}>
                                View Invoice
                              </button>
                            </a>
                          </>
                        )}
                      </div>
                    </dd>

                    {ticket?.completedWork && ticket?.vendorIRFile && (
                      <>
                        <dt className="col-sm-3">Completed Work</dt>
                        <dd className="col-sm-9">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <>
                              <button
                                type="button"
                                style={filesButtonStyle}
                                onClick={() =>
                                  download(
                                    ticket?.completedWork,
                                    "completedWork"
                                  )
                                }
                              >
                                Download Completed File
                              </button>
                              <a
                                href={ticket?.completedWork}
                                target="_blank" // This opens the file in a new tab
                                rel="noopener noreferrer" // Security measure to prevent the new tab from accessing your page's window object
                                style={{
                                  marginLeft: "10px",
                                  textDecoration: "none",
                                }}
                              >
                                <button type="button" style={filesButtonStyle}>
                                  View Completed File
                                </button>
                              </a>
                            </>
                          </div>
                        </dd>

                        <dt className="col-sm-3">Vendor IR File</dt>
                        <dd className="col-sm-9">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <>
                              <button
                                type="button"
                                style={filesButtonStyle}
                                onClick={() =>
                                  download(ticket?.vendorIRFile, "vendorIRFile")
                                }
                              >
                                Download VendorIR File
                              </button>
                              <a
                                href={ticket?.vendorIRFile}
                                target="_blank" // This opens the file in a new tab
                                rel="noopener noreferrer" // Security measure to prevent the new tab from accessing your page's window object
                                style={{
                                  marginLeft: "10px",
                                  textDecoration: "none",
                                }}
                              >
                                <button type="button" style={filesButtonStyle}>
                                  View VendorIR File
                                </button>
                              </a>
                            </>
                          </div>
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

export default IndividualTicketDetails;
