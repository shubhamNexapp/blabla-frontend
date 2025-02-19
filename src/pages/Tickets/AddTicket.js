import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import Select from "react-select";
import "../../assets/scss/pages/ticket.scss";
import makeAnimated from "react-select/animated";
import {
  Container,
  Row,
  Col,
  Card,
  FormGroup,
  CardBody,
  Label,
  Button,
  FormFeedback,
  Form,
  Input,
  CardHeader,
} from "reactstrap";
import moment from "moment";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getAPI, postAPI } from "../../Services/Apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  errorStyle,
  LoaderHide,
  LoaderShow,
} from "../../helpers/common_constants";
import {
  assign,
  assignValidation,
  boqDetails,
  boqDetailsValidation,
  servicesValidation,
  dateRangeValidation,
  localContactName,
  localContactNameValidation,
  mobileNumber,
  mobileNumberValidation,
  ticketIDValidation,
  ticketName,
  ticketNameValidation,
  workingHoursValidation,
  startTimeValidation,
  sowDescriptionValidation,
} from "../../customValidations/customValidations";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateTimeRangePicker } from "@mui/x-date-pickers-pro/DateTimeRangePicker";
import { DateRangePicker } from "@mui/x-date-pickers-pro";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getUserDetails } from "../../common/utility";
import loader from "../../assets/images/instaone-loader.svg";
import dayjs from "dayjs"; // Import dayjs if using AdapterDayjs

const AddTicket = () => {
  // meta title
  document.title = "Instaone";

  const [selectedFiles, setselectedFiles] = useState([]);
  const [irFile, setIRFile] = useState([]);
  const animatedComponents = makeAnimated();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  const [services, setServices] = useState([]);

  useEffect(() => {
    getSiteDetails();
    getServicesDetails();
  }, []);

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
  const [siteDetails, setSiteDetails] = useState([]);
  const [optionGroup, setOptionGroup] = useState([]);
  const [endTime, setEndTime] = useState("");

  const handleInputChange = async (siteAddress) => {
    handleSuggestionClick(siteAddress);
    // Ensure the siteAddress has a value before fetching suggestions
    // if (siteAddress && siteAddress.length > 2) {
    //   try {
    //     const response = await axios.get(
    //       "https://api.olamaps.io/places/v1/autocomplete",
    //       {
    //         params: {
    //           input: siteAddress,
    //           api_key: "FANgz5SPPeXsGdtDz2c3X1k4NzGejJLAK3CcTubL",
    //         },
    //         headers: {
    //           "X-Request-Id": uuidv4(),
    //         },
    //       }
    //     );

    //     if (response.data && response.data.predictions) {
    //       setSuggestions(response.data.predictions);
    //     } else {
    //       console.error("Unexpected response format:", response.data);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching autocomplete suggestions:", error);
    //     console.error(
    //       "Error details:",
    //       error.response ? error.response.data : error.message
    //     );
    //   }
    // } else {
    //   setSuggestions([]);
    // }
  };

  const handleSuggestionClick = async (suggestion) => {
    setSuggestions([]); // Clear suggestions after selection

    try {
      const response = await axios.get(
        "https://api.olamaps.io/places/v1/geocode",
        {
          params: {
            address: suggestion,
            api_key: "FANgz5SPPeXsGdtDz2c3X1k4NzGejJLAK3CcTubL",
          },
          headers: {
            "X-Request-Id": uuidv4(),
          },
        }
      );
      if (
        response.data &&
        response.data.geocodingResults &&
        response.data.geocodingResults.length > 0
      ) {
        const location = response.data.geocodingResults[0].geometry.location;
        setCoordinates({ lat: location.lat, lng: location.lng });
        // validationType.setFieldValue("siteAddress", suggestion.description);
      } else {
        console.error("No results found for the address");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      console.error(
        "Error details:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const getSiteDetails = async () => {
    try {
      const user = getUserDetails();

      const data = { userId: user?.userId };
      const response = await postAPI("site/get-site", data);
      if (response.statusCode === 200) {
        const siteDetails = response.data;

        // Map the siteDetails to the required format for the Select component
        const mappedOptions = siteDetails.map((site) => ({
          label: site.siteID, // Display the siteID as the label
          value: site.siteID, // Use siteID as the value
          siteAddress: site.address, // Set the site address
          localContactName: site.localContactName, // Set the site address
          localContactPhone: site.localContactPhone, // Set the site address
        }));

        // Update the optionGroup state
        setOptionGroup([{ options: mappedOptions }]);
        console.log(optionGroup);
      }
    } catch (error) {
      toast.error(error.message);
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

  const handleSelectGroup = (option, setFieldValue) => {
    setFieldValue("siteID", option.value);
    setFieldValue("siteAddress", option.siteAddress);
    setFieldValue("localContactName", option.localContactName);
    setFieldValue("mobileNumber", option.localContactPhone);
    setSuggestions([]);
    if (option.siteAddress) {
      handleInputChange(option.siteAddress);
    }
  };

  // function handleAcceptedFiles(files, setFieldValue) {
  //   const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

  //   const updatedFiles = files.map((file) =>

  //     Object.assign(file, {
  //       preview: URL.createObjectURL(file),
  //       formattedSize: formatBytes(file.size),
  //     })
  //   );
  //   setselectedFiles(updatedFiles);
  //   setFieldValue("sowFiles", updatedFiles);
  // }

  // Function to handle accepted files
  function handleAcceptedFiles(files, setFieldValue) {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    const updatedFiles = files
      .map((file) => {
        if (!allowedTypes.includes(file.type)) {
          // Show error message if file type is not allowed
          toast.error("Only PDF and image files are allowed.");
          return null; // Skip invalid file
        }

        // If file type is valid, process it
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
          formattedSize: formatBytes(file.size),
        });
      })
      .filter(Boolean); // Filter out invalid files (null values)

    if (updatedFiles?.length === 0) {
      toast.error("Only PDF and image files are allowed.");
    }
    // Set the updated files in state and Formik
    setselectedFiles(updatedFiles);
    setFieldValue("sowFiles", updatedFiles);
  }

  function handleIRFile(files, setFieldValue) {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    const updatedFiles = files
      .map((file) => {
        if (!allowedTypes.includes(file.type)) {
          // Show error message if file type is not allowed
          toast.error("Only PDF and image files are allowed.");
          return null; // Skip invalid file
        }

        // If file type is valid, process it
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
          formattedSize: formatBytes(file.size),
        });
      })
      .filter(Boolean); // Filter out invalid files (null values)

    // Set only the actual file objects in Formik's state
    setFieldValue("irFile", files); // This only stores the file objects in Formik state

    // Store the files with metadata for UI preview
    setIRFile(updatedFiles);
  }

  const handleServiceChange = (e) => {
    const selectedService = services.find(
      (service) => service.serviceName === e.target.value
    );

    // Set the selected service and its price
    validationType.setFieldValue("services", e.target.value);
    // Mark the 'services' field as touched to trigger validation (if needed)
    validationType.setFieldValue("servicePrice", selectedService?.price || "");

    // Mark the field as touched to ensure validation shows up correctly
    validationType.setFieldTouched("services", false);
    // Trigger validation manually for 'services' field
    validationType.validateField("services");
  };

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const validationType = useFormik({
    initialValues: {
      workingHours: "",
      startTime: "",
      ticketID: "",
      ticketName: "",
      siteID: "",
      siteAddress: "",
      localContactName: "",
      mobileNumber: "",
      assign: "",
      sowDescription: "",
      sowFiles: [],
      irFile: [],
      services: "",
      servicePrice: "",
      // boqDetails: "",
      dateRange: [null, null],
    },

    validationSchema: Yup.object().shape({
      // ticketID: ticketIDValidation,
      ticketName: ticketNameValidation,
      // siteAddress: Yup.string().required("This value is required"),
      localContactName: localContactNameValidation,
      mobileNumber: mobileNumberValidation,
      // assign: assignValidation,
      sowDescription: sowDescriptionValidation,
      services: servicesValidation,
      // boqDetails: boqDetailsValidation,
      workingHours: workingHoursValidation,
      startTime: startTimeValidation,
      // dateRange: dateRangeValidation,
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        LoaderShow();
        const user = getUserDetails();
        const formData = new FormData();
        // formData.append("ticketID", values.ticketID);
        formData.append("ticketName", values.ticketName);
        formData.append("siteID", values.siteID);
        formData.append("siteAddress", values.siteAddress);
        formData.append("localContactName", values.localContactName);
        formData.append("mobileNumber", values.mobileNumber);
        formData.append("assign", values.assign);
        formData.append("sowDescription", values.sowDescription);
        formData.append("services", values.services);
        formData.append("servicePrice", values.servicePrice);
        // formData.append("boqDetails", values.boqDetails);
        formData.append("profile", values.sowFiles[0]);
        if (values.irFile.length > 0) {
          formData.append("irFile", values.irFile[0]); // Correctly append the file
        }
        formData.append("dateRange", JSON.stringify(values.dateRange));
        formData.append("latitude", coordinates.lat);
        formData.append("longitude", coordinates.lng);
        formData.append("userId", user?.userId);
        formData.append("startTime", values.startTime);
        formData.append("endTime", endTime);
        formData.append("workingHours", values.workingHours);

        // if (values.sowFiles.length > 0) {
        //   formData.append("profile", values.sowFiles[0]); // Append single file
        // }

        const response = await postAPI("ticket/add-ticket", formData);
        if (response.statusCode === 200) {
          resetForm();
          toast.success(response.message);
          if (role == "customer") {
            navigate(`/customer/tickets`);
          } else {
            navigate("/admin/tickets");
          }
          LoaderHide();
        }
      } catch (error) {
        toast.error(error.message);
        LoaderHide();
      }
    },
  });

  useEffect(() => {
    const { workingHours, startTime } = validationType.values;

    if (workingHours && startTime) {
      // Parse the start time in 12-hour format with AM/PM
      const start = moment(startTime, "hh:mm A");

      // Calculate the end time by adding the working hours
      const end = start.add(workingHours, "hours").format("hh:mm A"); // 12-hour format with AM/PM
      setEndTime(end);
    } else {
      setEndTime(""); // Reset if input fields are empty
    }
  }, [validationType.values.workingHours, validationType.values.startTime]);

  const gotoTicketsPage = () => {
    if (role == "customer") {
      navigate(`/customer/tickets`);
    } else {
      navigate("/admin/tickets");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Ticket" breadcrumbItem="Add Ticket" />
          <div
            id="hideloding"
            className="loding-display"
            style={{ display: "none" }}
          >
            <img src={loader} alt="loader-img" />
          </div>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-2">Add Ticket</h4>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validationType.handleSubmit();
                      return false;
                    }}
                  >
                    <Row className="mb-4">
                      <h5 className="mb-2">Ticket Information</h5>

                      {/*<Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Ticket ID</Label>
                          <Input
                            name="ticketID"
                            id="ticketID"
                            placeholder="INSTA8765"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.ticketID || ""}
                          />
                         {validationType.touched.ticketID && 
                          validationType.errors.ticketID ? (
                            <span style={errorStyle}>
                              {validationType.errors.ticketID}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                      */}
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Ticket Name</Label>
                          <Input
                            id="ticketName"
                            name="ticketName"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.ticketName || ""}
                          />
                          {validationType.touched.ticketName &&
                          validationType.errors.ticketName ? (
                            <span style={errorStyle}>
                              {validationType.errors.ticketName}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row className="">
                      <h5 className="mb-2">Site Information</h5>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Site ID</Label>
                          <Select
                            name="siteID"
                            id="siteID"
                            components={animatedComponents}
                            options={optionGroup}
                            onChange={(option) =>
                              handleSelectGroup(
                                option,
                                validationType.setFieldValue
                              )
                            }
                            classNamePrefix="select2-selection"
                          />
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Site Address</Label>
                          <Input
                            id="siteAddress"
                            name="siteAddress"
                            type="text"
                            value={validationType.values.siteAddress}
                            readOnly
                            onChange={validationType.handleChange}
                            onBlur={handleInputChange}
                          />
                          {validationType.touched.siteAddress &&
                          validationType.errors.siteAddress ? (
                            <span style={errorStyle}>
                              {validationType.errors.siteAddress}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6} className="d-flex justify-content-end"></Col>

                      <Col lg={6} className="d-flex justify-content-end">
                        <div className="mb-3">
                          <ul>
                            {suggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                              >
                                {suggestion.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Col>
                    </Row>

                    <Col>
                      <div
                        style={{ position: "relative", zIndex: 0 }}
                        className="mb-4"
                      >
                        <Label className="form-label">Service Date</Label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DateRangePicker"]}>
                            <DateRangePicker
                              localeText={{
                                start: "from",
                                end: "to",
                              }}
                              value={validationType.values.dateRange}
                              onChange={(newValue) =>
                                validationType.setFieldValue(
                                  "dateRange",
                                  newValue
                                )
                              }
                              minDate={dayjs()}
                            />
                            {validationType.touched.dateRange &&
                            validationType.errors.dateRange ? (
                              <span style={errorStyle}>
                                {validationType.errors.dateRange}
                              </span>
                            ) : null}
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </Col>

                    <Row className="mb-4">
                      <h5 className="mb-4">Total Working Hours</h5>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Working Hours</Label>
                          <Input
                            type="number"
                            name="workingHours"
                            value={validationType.values.workingHours}
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            placeholder="Enter working hours (e.g., 4)"
                          />
                          {validationType.touched.workingHours &&
                          validationType.errors.workingHours ? (
                            <span style={{ color: "red" }}>
                              {validationType.errors.workingHours}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Start Time (24-hour format)
                          </Label>
                          <Input
                            type="time"
                            name="startTime"
                            value={moment(
                              validationType.values.startTime,
                              "hh:mm A"
                            ).format("HH:mm")} // Keep input in 24-hour format
                            onChange={(e) => {
                              validationType.setFieldValue(
                                "startTime",
                                moment(e.target.value, "HH:mm").format(
                                  "hh:mm A"
                                ) // Convert to 12-hour format after input
                              );
                            }}
                            onBlur={validationType.handleBlur}
                            placeholder="02:00 PM"
                          />
                          {validationType.touched.startTime &&
                          validationType.errors.startTime ? (
                            <span style={{ color: "red" }}>
                              {validationType.errors.startTime}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">
                            End Time (Auto-calculated)
                          </Label>
                          <Input
                            type="text"
                            value={endTime}
                            readOnly
                            placeholder="End time will auto-calculate"
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-">
                      <h5 className="mb-2">Contact Information</h5>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Local Contact Name
                          </Label>
                          <Input
                            name="localContactName"
                            id="localContactName"
                            type="text"
                            readOnly
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.localContactName || ""}
                          />
                          {validationType.touched.localContactName &&
                          validationType.errors.localContactName ? (
                            <span style={errorStyle}>
                              {validationType.errors.localContactName}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Mobile Number</Label>
                          <Input
                            name="mobileNumber"
                            label="mobileNumber"
                            readOnly
                            id="mobileNumber"
                            type="number"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.mobileNumber || ""}
                            maxLength="10"
                          />
                          {validationType.touched.mobileNumber &&
                          validationType.errors.mobileNumber ? (
                            <span style={errorStyle}>
                              {validationType.errors.mobileNumber}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      {/* <Col lg={6}>
                        <div className="mb-2">
                          <Label htmlFor="progresspill-address-input">
                            Address
                          </Label>
                          <textarea
                            id="progresspill-address-input"
                            className="form-control"
                            rows="2"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.address || ""}
                            invalid={
                              validationType.touched.address &&
                              validationType.errors.address
                                ? true
                                : false
                            }
                          ></textarea>
                          {validationType.touched.address &&
                            validationType.errors.address ? (
                            <FormFeedback type="invalid">
                              {validationType.errors.address}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col> */}
                      <Col lg={6}>
                        {/* <div className="mb-3">
                          <Label className="form-label">Assign</Label>
                          <Input
                            name="assign"
                            label="assign"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.assign || ""} // assuming 'name' is a string property of the 'assign' object
                          />
                          {validationType.touched.assign &&
                          validationType.errors.assign ? (
                            <span style={errorStyle}>
                              {validationType.errors.assign}
                            </span>
                          ) : null}
                        </div> */}
                      </Col>
                    </Row>

                    <Row>
                      <h5 className="mb-2">Job Information</h5>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Upload SOW</Label>
                          <Dropzone
                            accept={{
                              "application/pdf": [],
                              "image/jpeg": [],
                              "image/png": [],
                            }} // Accept only PDF and image types
                            onDrop={(acceptedFiles) => {
                              handleAcceptedFiles(
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
                            {selectedFiles.map((file, i) => {
                              return (
                                <Card
                                  className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                  key={i + "-file"}
                                >
                                  <div className="p-2">
                                    <Row className="align-items-center">
                                      <Col className="col-auto">
                                        {file.type.startsWith("image/") ? (
                                          // Display image preview
                                          <>
                                            <img
                                              src={file.preview}
                                              height="70"
                                              width="70"
                                              style={{ marginTop: "15px" }}
                                              alt={file.name}
                                            />
                                            <p
                                              style={{
                                                color: "rgb(245 146 34)",
                                                marginTop: "5px",
                                              }}
                                            >
                                              {file.name}
                                            </p>
                                          </>
                                        ) : file.type === "application/pdf" ? (
                                          // Display PDF link
                                          <a
                                            href={file.preview}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <i className="far fa-file-pdf fa-2x text-danger"></i>
                                            <p>{file.name}</p>
                                          </a>
                                        ) : (
                                          <p>Unsupported file type</p>
                                        )}
                                      </Col>
                                    </Row>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Upload IR File</Label>
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              handleIRFile(
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
                            {console.log("irFile=====", irFile)}
                            {irFile.map((file, i) => {
                              return (
                                <Card
                                  className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                  key={i + "-file"}
                                >
                                  <div className="p-2">
                                    <Row className="align-items-center">
                                      <Col className="col-auto">
                                        {console.log(
                                          "file.type======",
                                          file.type
                                        )}
                                        {file.type.startsWith("image/") ? (
                                          // Display image preview
                                          <>
                                            <img
                                              src={file.preview}
                                              height="70"
                                              width="70"
                                              style={{ marginTop: "15px" }}
                                              alt={file.name}
                                            />
                                            <p
                                              style={{
                                                color: "rgb(245 146 34)",
                                                marginTop: "5px",
                                              }}
                                            >
                                              {file.name}
                                            </p>
                                          </>
                                        ) : file.type === "application/pdf" ? (
                                          // Display PDF link
                                          <a
                                            href={file.preview}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <i className="far fa-file-pdf fa-2x text-danger"></i>
                                            <p>{file.name}</p>
                                          </a>
                                        ) : (
                                          <p>Unsupported file type</p>
                                        )}
                                      </Col>
                                    </Row>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">SOW Description</Label>
                          <textarea
                            id="sowDescription"
                            name="sowDescription"
                            className="form-control"
                            rows="2"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.sowDescription || ""}
                          ></textarea>
                          {validationType.touched.sowDescription &&
                          validationType.errors.sowDescription ? (
                            <span style={errorStyle}>
                              {validationType.errors.sowDescription}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      {/* <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Service</Label>
                          <Input
                            name="service"
                            label="service"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.service || ""}
                          />
                          {validationType.touched.service &&
                          validationType.errors.service ? (
                            <span style={errorStyle}>
                              {validationType.errors.service}
                            </span>
                          ) : null}
                        </div>
                      </Col> */}
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Services</Label>
                          <Input
                            type="select"
                            name="services"
                            onChange={handleServiceChange} // Custom handler
                            // onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.services || ""}
                          >
                            <option value="">Select Service</option>
                            {services?.map((item) => (
                              <option key={item?._id} value={item?.serviceName}>
                                {item?.serviceName}
                              </option>
                            ))}
                          </Input>
                          {validationType.touched.services &&
                          validationType.errors.services ? (
                            <span style={errorStyle}>
                              {validationType.errors.services}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Service Price</Label>
                          <Input
                            readOnly
                            name="servicePrice"
                            label="servicePrice"
                            type="text"
                            value={validationType.values.servicePrice}
                          />
                          {validationType.touched.servicePrice &&
                          validationType.errors.servicePrice ? (
                            <span style={errorStyle}>
                              {validationType.errors.servicePrice}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      {/* <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">BOQ Details</Label>
                          <Input
                            name="boqDetails"
                            label="boqDetails"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.boqDetails || ""}
                          />
                          {validationType.touched.boqDetails &&
                          validationType.errors.boqDetails ? (
                            <span style={errorStyle}>
                              {validationType.errors.boqDetails}
                            </span>
                          ) : null}
                        </div>
                      </Col> */}
                      {/* <Col>
                        <div className="mb-3">
                          <Label className="form-label">Time Stamp</Label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateTimeRangePicker"]}>
                              <DateTimeRangePicker
                                localeText={{
                                  start: "Check-in",
                                  end: "Check-out",
                                }}
                                value={validationType.values.dateRange}
                                onChange={(newValue) =>
                                  validationType.setFieldValue(
                                    "dateRange",
                                    newValue
                                  )
                                }
                              />
                              {validationType.touched.dateRange &&
                                validationType.errors.dateRange ? (
                                <span style={errorStyle}>
                                  {validationType.errors.dateRange}
                                </span>
                              ) : null}
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                      </Col> */}
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        onClick={gotoTicketsPage}
                        type="reset"
                        color="secondary"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" color="primary">
                        Add Ticket
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

export default AddTicket;
