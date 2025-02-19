import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import loader from "../../assets/images/instaone-loader.svg";

import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Button,
  Form,
  CardHeader,
} from "reactstrap";

import moment from "moment";
import {
  errorStyle,
  LoaderShow,
  LoaderHide,
  filesButtonStyle,
  ticketNameStyle,
  statusBadge
} from "../../helpers/common_constants";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { postAPI } from "../../Services/Apis";

const ViewParticularTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [ticket, setTicket] = useState(location?.state?.row);
  const [completedWork, setCompletedWork] = useState([]);
  const [vendorIRFile, setVendorIrFile] = useState([]);

  useEffect(() => {
    LoaderHide();
  }, []);

  function handleCompletedWork(files, setFieldValue) {
    // Separate the actual file from its metadata
    const updatedFiles = files.map((file) => ({
      originalFile: file, // Store the original file for FormData
      preview: URL.createObjectURL(file), // Preview URL for display
      formattedSize: formatBytes(file.size), // Formatted size for display
    }));

    // Set only the actual file objects in Formik's state
    setFieldValue("completedWork", files); // This only stores the file objects in Formik state

    // Store the files with metadata for UI preview
    setCompletedWork(updatedFiles);
  }

  function handleVendorIRFile(files, setFieldValue) {
    // Separate the actual file from its metadata
    const updatedFiles = files.map((file) => ({
      originalFile: file, // Store the original file for FormData
      preview: URL.createObjectURL(file), // Preview URL for display
      formattedSize: formatBytes(file.size), // Formatted size for display
    }));

    // Set only the actual file objects in Formik's state
    setFieldValue("vendorIRFile", files); // This only stores the file objects in Formik state

    // Store the files with metadata for UI preview
    setVendorIrFile(updatedFiles);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

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

  const validationType = useFormik({
    initialValues: {
      completedWork: [],
      vendorIRFile: [],
      verificationCode: "",
    },

    validationSchema: Yup.object().shape({
      completedWork: Yup.array()
        .min(1, "At least one file is required") // Ensure at least one file
        .required("Completed work files are required"),
      vendorIRFile: Yup.array()
        .min(1, "At least one file is required") // Ensure at least one file
        .required("IR File is  required"),
      verificationCode: Yup.string()
        .required("Verification Code is required")
        .matches(/^[0-9]{5}$/, "Must be a valid 5-digit number"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        LoaderShow();
        const formData = new FormData();
        formData.append("_id", ticket?._id);
        formData.append("completedWork", values.completedWork[0]);
        formData.append("vendorIRFile", values.vendorIRFile[0]);
        formData.append("verificationCode", values.verificationCode);
        // formData.append("verificationCode", values.verificationCode);

        // if (values.irFile.length > 0) {
        //   formData.append("irFile", values.irFile[0]); // Correctly append the file
        // }

        const response = await postAPI("ticket/complete-ticket", formData);
        if (response.statusCode === 200) {
          toast.success(response.message);
          resetForm();
          if (role == "company") {
            navigate(`/company/tickets`);

          } else {
            navigate('/individual/tickets')
          }
          LoaderHide();
        }
      } catch (error) {
        LoaderHide();
        toast.error(error.message);
      }
    },
  });



  const back = () => {
    if (role == "company") {
      navigate(`/company/inprogress-ticket`);

    } else {
      navigate('/individual/inprogress-ticket')
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

  // Function to download the file and handle different types
  const download = (fileUrl, filenameInitial) => {
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
          prefixedFileName = `sow_${fileName}`; // Add 'sow_' prefix to the file name
        } else if (filenameInitial === "irFile") {
          prefixedFileName = `irFile_${fileName}`; // Add 'sow_' prefix to the file name
        } else if (filenameInitial === "completedWork") {
          prefixedFileName = `completedWork_${fileName}`; // Add 'sow_' prefix to the file name
        } else if (filenameInitial === "vendorIRFile") {
          prefixedFileName = `vendorIRFile_${fileName}`; // Add 'sow_' prefix to the file name
        } else {
          prefixedFileName = `${fileName}`; // Add 'sow_' prefix to the file name
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
        <div
          id="hideloding"
          className="loding-display"
        // style={{ display: "none" }}
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
                    <dt className="col-sm-3">Reward</dt>
                    <dd className="col-sm-9">750 </dd>

                    <dt className="col-sm-3">Site Address</dt>
                    <dd className="col-sm-9">{ticket?.siteAddress}</dd>

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
                    {/* 
                    <dt className="col-sm-3">Status</dt>
                    <dd className="col-sm-9">{ticket?.status}</dd> */}

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
                                download(ticket?.invoiceFile, "invoiceFile")
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
          <Row className="mt-4">
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-2">Complete Ticket</h4>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validationType.handleSubmit();
                      return false;
                    }}
                  >
                    <Row>
                      <h5 className="mb-2">Job Information</h5>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Upload Completed Work
                          </Label>
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              handleCompletedWork(
                                acceptedFiles,
                                validationType.setFieldValue
                              );
                            }}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div className="dropzone">
                                <div
                                  className="dz-message needsclick mt-"
                                  {...getRootProps()}
                                >
                                  <input {...getInputProps()} />
                                  <i className="display-4 text-muted bx bx-cloud-upload" />
                                </div>
                              </div>
                            )}
                          </Dropzone>
                          <div
                            className="dropzone-previews mt-3"
                            id="file-previews"
                          >
                            {completedWork.map((f, i) => {
                              return (
                                <Card
                                  className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                  key={i + "-file"}
                                >
                                  <div className="p-2">
                                    <Row className="align-items-center">
                                      <Col className="col-auto">
                                        <img
                                          data-dz-thumbnail=""
                                          height="80"
                                          className="avatar-sm rounded bg-light"
                                          alt={f.name}
                                          src={f.preview}
                                        />
                                      </Col>
                                      <Col>
                                        <Link
                                          to="#"
                                          className="text-muted font-weight-bold"
                                        >
                                          {f.name}
                                        </Link>
                                        <p className="mb-0">
                                          <strong>{f.formattedSize}</strong>
                                        </p>
                                      </Col>
                                    </Row>
                                  </div>
                                </Card>
                              );
                            })}
                            {validationType.errors.completedWork ? (
                              <span style={errorStyle}>
                                {validationType.errors.completedWork}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Upload IR File</Label>
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              handleVendorIRFile(
                                acceptedFiles,
                                validationType.setFieldValue
                              );
                            }}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div className="dropzone">
                                <div
                                  className="dz-message needsclick mt-"
                                  {...getRootProps()}
                                >
                                  <input {...getInputProps()} />
                                  <i className="display-4 text-muted bx bx-cloud-upload" />
                                </div>
                              </div>
                            )}
                          </Dropzone>
                          <div
                            className="dropzone-previews mt-3"
                            id="file-previews"
                          >
                            {vendorIRFile.map((f, i) => {
                              return (
                                <Card
                                  className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                  key={i + "-file"}
                                >
                                  <div className="p-2">
                                    <Row className="align-items-center">
                                      <Col className="col-auto">
                                        <img
                                          data-dz-thumbnail=""
                                          height="80"
                                          className="avatar-sm rounded bg-light"
                                          alt={f.name}
                                          src={f.preview}
                                        />
                                      </Col>
                                      <Col>
                                        <Link
                                          to="#"
                                          className="text-muted font-weight-bold"
                                        >
                                          {f.name}
                                        </Link>
                                        <p className="mb-0">
                                          <strong>{f.formattedSize}</strong>
                                        </p>
                                      </Col>
                                    </Row>
                                  </div>
                                </Card>
                              );
                            })}
                            {validationType.errors.vendorIRFile ? (
                              <span style={errorStyle}>
                                {validationType.errors.vendorIRFile}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Verification Code
                          </Label>

                          <input
                            type="text"
                            name="verificationCode"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.verificationCode}
                            className="form-control"
                            placeholder="Enter Verification Code"
                          />
                          {validationType.touched.verificationCode &&
                            validationType?.errors?.verificationCode ? (
                            <span style={{ color: "red" }}>
                              {validationType?.errors?.verificationCode}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="reset" color="secondary">
                        Cancel
                      </Button>
                      <Button type="submit" color="primary">
                        Submit
                      </Button>

                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ViewParticularTicket;
