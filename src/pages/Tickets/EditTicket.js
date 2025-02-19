import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { getAPI, postAPI } from "../../Services/Apis";
import { useNavigate } from "react-router-dom";
import {
  errorStyle,
  LoaderHide,
  LoaderShow,
} from "../../helpers/common_constants";
import {
  assignValidation,
  boqDetailsValidation,
  localContactNameValidation,
  mobileNumberValidation,
  serviceValidation,
  startTimeValidation,
  ticketDescriptionValidation,
  ticketIDValidation,
  ticketNameValidation,
  workingHoursValidation,
} from "../../customValidations/customValidations";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateTimeRangePicker } from "@mui/x-date-pickers-pro/DateTimeRangePicker";
import dayjs from "dayjs";
import moment from "moment/moment";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { getUserDetails } from "../../common/utility";
import loader from "../../assets/images/instaone-loader.svg";

const EditTicket = (props) => {
  const { id } = useParams(); // Fetch the id parameter from the route
  const location = useLocation(); // Access the location object to get state
  const navigate = useNavigate();
  const { state } = location;

  if (!state || !state.row) {
    return <div>No data available for editing</div>;
  }
  console.log(state.row);
  // Example of accessing data fields
  const {
    ticketID,
    ticketName,
    siteID,
    siteAddress,
    localContactName,
    mobileNumber,
    assign,
    profile,
    sowDescription,
    irFile,
    services,
    boqDetails,
    dateRange,
    servicePrice,
    workingHours,
    startTime,
  } = state?.row;

  document.title = "Instaone";
  const [endTime, setEndTime] = useState("");
  // const [services, setServices] = useState([]);
  const [allservices, setAllServices] = useState([]);
  const [optionGroup, setOptionGroup] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFiles, setselectedFiles] = useState([]);
  const [selectedIRFiles, setSelectedIFFiles] = useState([]);

  const animatedComponents = makeAnimated();

  // Flatten option groups for easier manipulation
  const flatOptions = optionGroup.flatMap((group) => group.options);

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  function handleIRFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setSelectedIFFiles(files);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const [initialValues, setInitialValues] = useState({
    ticketID: "",
    ticketName: "",
    siteID: "",
    siteAddress: "",
    localContactName: "",
    mobileNumber: "",
    assign: "",
    sowFiles: "",
    sowDescription: "",
    irFile: "",
    services: "",
    boqDetails: "",
    dateRange: [null, null],
    servicePrice: "",
    workingHours: "",
    startTime: "",
    endTime: "",
  });

  const handleInputChange = async (siteAddress) => {
    handleSuggestionClick(siteAddress);
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
  function getRole() {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.role;
    }
    return null;
  }
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
        setAllServices(response.data);
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
  // Example usage
  useEffect(() => {
    getServicesDetails();
    getSiteDetails();
  }, []);

  const role = getRole();
  useEffect(() => {
    // Convert dateRange strings to Dayjs objects
    const formattedDateRange = state.row.dateRange
      ? state.row.dateRange.map((date) => dayjs(date))
      : [null, null];

    if (state?.row) {
      setInitialValues({
        ticketID: ticketID || "",
        ticketName: ticketName || "",
        siteID: siteID || "",
        siteAddress: siteAddress || "",
        localContactName: localContactName || "",
        mobileNumber: mobileNumber || "",
        assign: assign || "",
        sowFiles: profile || "",
        sowDescription: sowDescription || "",
        services: services || "",
        boqDetails: boqDetails || "",
        irFile: irFile || "",
        startTime: startTime || "",
        endTime: endTime || "",
        dateRange: formattedDateRange || "",
        servicePrice: servicePrice || "",
        workingHours: workingHours || "",
      });
    }
  }, [state]);

  const validationType = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // This is important to update form values after initialization
    validationSchema: Yup.object().shape({
      ticketName: ticketNameValidation,
      workingHours: workingHoursValidation,
      startTime: startTimeValidation,
      // siteID: Yup.string().required("This value is required"),
      // siteAddress: Yup.string().required("This value is required"),
      // localContactName: localContactNameValidation,
      // mobileNumber: mobileNumberValidation,
      // // assign: assignValidation,
      // ticketDescription: ticketDescriptionValidation,
      // service: serviceValidation,
      // boqDetails: boqDetailsValidation,
      // dateRange: Yup.array()
      //   .of(Yup.date().required("Date is required"))
      //   .required("Date range is required")
      //   .min(2, "Please select a valid date range"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = {
          ...values,
          endTime, // Add endTime from its separate state
        };
        LoaderShow();
        const response = await postAPI("ticket/update-ticket", formData);
        if (response.statusCode === 200) {
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

  // Handle select change
  // const handleSelectGroup = (selectedGroup, setFieldValue) => {
  //   if (selectedGroup) {
  //     setFieldValue("siteID", selectedGroup.siteID);
  //     setFieldValue("siteAddress", selectedGroup.siteAddress);
  //   } else {
  //     setFieldValue("siteID", "");
  //     setFieldValue("siteAddress", "");
  //   }
  // };

  const gotoTicketsPage = () => {
    if (role == "customer") {
      navigate(`/customer/tickets`);
    } else {
      navigate("/admin/tickets");
    }
  };
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

  const handleServiceChange = (e) => {
    const selectedService = allservices.find(
      (service) => service.serviceName === e.target.value
    );

    // Set the selected service and its price
    validationType.setFieldValue("services", e.target.value);
    validationType.setFieldValue("servicePrice", selectedService?.price || "");
  };

  const fileExtensions = [".pdf", ".PDF", ".txt", ".jpg", ".jpeg", ".png"];

  const isValidFile = (fileName) => {
    return fileExtensions.some((ext) => fileName.endsWith(ext));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Ticket" breadcrumbItem="Edit Ticket" />
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
                  <h4 className="card-title mb-2">Edit Ticket</h4>
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

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Ticket ID</Label>
                          <Input
                            name="username"
                            placeholder={id}
                            readOnly
                            type="text"
                            onChange={validationType.handleChange}
                          />
                        </div>
                      </Col>

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

                    <Row className="mb-4">
                      <h5 className="mb-2">Site Information</h5>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Site ID</Label>
                          <Input
                            name="siteID"
                            id="siteID"
                            type="text"
                            readOnly
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.siteID || ""} // Ensure the value prop is an object or null
                          />
                          {validationType.touched.siteID &&
                            validationType.errors.siteID ? (
                            <FormFeedback type="invalid">
                              {validationType.errors.siteID}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Site Address</Label>
                          <Input
                            name="siteAddress"
                            placeholder=""
                            type="text"
                            readOnly
                            value={validationType.values.siteAddress || ""}
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                          />
                          {validationType.touched.siteAddress &&
                            validationType.errors.siteAddress ? (
                            <FormFeedback type="invalid">
                              {validationType.errors.siteAddress}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      {/* <Col lg={6} className="d-flex justify-content-end">
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
                      </Col> */}
                    </Row>

                    <Row className="mb-4">
                      <Col>
                        <div className="mb-4">
                          <Label className="form-label">Date Range</Label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateRangePicker"]}>
                              <DateRangePicker
                                readOnly
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
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <h5 className="mb-2">Total Working Hours</h5>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Working Hours</Label>
                          <Input
                            type="number"
                            name="workingHours"
                            value={validationType.values.workingHours}
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
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
                            Start Time (12-hour format)
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
                          {console.log(
                            "validationType.errors===",
                            validationType.errors
                          )}
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
                          {console.log("endTime======", endTime)}
                          <Input
                            type="text"
                            name="endTime"
                            value={endTime}
                            readOnly
                            placeholder="End time will auto-calculate"
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <h5 className="mb-2">Contact Information</h5>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Local Contact Name
                          </Label>
                          <Input
                            readOnly
                            name="localContactName"
                            id="localContactName"
                            type="text"
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
                            readOnly
                            name="mobileNumber"
                            label="mobileNumber"
                            id="mobileNumber"
                            type="number"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.mobileNumber || ""}
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
                      <h5 className="mb-2">Job Information</h5>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Upload SOW</Label>
                          {/* <Dropzone
                            onDrop={(acceptedFiles) => {
                              handleAcceptedFiles(acceptedFiles);
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
                          </Dropzone> */}
                          {selectedFiles.length > 0 ? (
                            // Display new file preview if available
                            <div
                              className="dropzone-previews mt-3"
                              id="file-previews"
                            >
                              {selectedFiles.map((file, i) => (
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
                              ))}
                            </div>
                          ) : profile ? (
                            // Display existing profile image if no new file is selected
                            <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    {fileExtensions.some((ext) =>
                                      validationType?.values?.sowFiles?.endsWith(
                                        ext
                                      )
                                    ) ? (
                                      // If it's a PDF
                                      validationType?.values?.sowFiles?.endsWith(
                                        ".pdf"
                                      ) ||
                                        validationType?.values?.sowFiles?.endsWith(
                                          ".txt"
                                        ) ||
                                        validationType?.values?.sowFiles?.endsWith(
                                          ".PDF"
                                        ) ? (
                                        <a
                                          href={
                                            validationType?.values?.sowFiles
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <i className="far fa-file-pdf fa-2x text-danger"></i>
                                          <p>SOW File</p>
                                        </a>
                                      ) : (
                                        // If it's an image
                                        <img
                                          src={validationType?.values?.sowFiles}
                                          height="70"
                                          width="70"
                                          style={{ marginTop: "15px" }}
                                          alt="sow"
                                        />
                                      )
                                    ) : (
                                      <p>Unsupported file type</p>
                                    )}
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Upload IR File</Label>
                          {/* <Dropzone
                            onDrop={(acceptedFiles) => {
                              handleIRFiles(acceptedFiles);
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
                          </Dropzone> */}
                          {selectedIRFiles.length > 0 ? (
                            // Display new file preview if available
                            <div
                              className="dropzone-previews mt-3"
                              id="file-previews"
                            >
                              {selectedIRFiles.map((file, i) => (
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
                              ))}
                            </div>
                          ) : irFile ? (
                            // Display existing profile image if no new file is selected
                            <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    {fileExtensions.some((ext) =>
                                      validationType?.values?.irFile?.endsWith(
                                        ext
                                      )
                                    ) ? (
                                      // If it's a PDF
                                      validationType?.values?.irFile?.endsWith(
                                        ".pdf"
                                      ) ||
                                        validationType?.values?.irFile?.endsWith(
                                          ".txt"
                                        ) ||
                                        validationType?.values?.irFile?.endsWith(
                                          ".PDF"
                                        ) ? (
                                        <a
                                          href={validationType?.values?.irFile}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <i className="far fa-file-pdf fa-2x text-danger"></i>
                                          <p>IR File</p>
                                        </a>
                                      ) : (
                                        // If it's an image
                                        <img
                                          src={validationType?.values?.irFile}
                                          height="70"
                                          width="70"
                                          style={{ marginTop: "15px" }}
                                          alt="sow"
                                        />
                                      )
                                    ) : (
                                      <p>Unsupported file type</p>
                                    )}
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">SOW Description</Label>
                          <textarea
                            readOnly
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

                    <Row className="mb-4">
                      <h5 className="mb-2">Service Information</h5>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Services</Label>
                          <Input
                            type="text"
                            readOnly
                            name="services"
                            // onChange={handleServiceChange} // Custom handler
                            // onChange={validationType.handleChange}
                            // onBlur={validationType.handleBlur}
                            value={validationType.values.services || ""}
                          >
                            {/* {allservices?.map((item) => (
                              <option key={item?._id} value={item?.serviceName}>
                                {item?.serviceName}
                              </option>
                            ))} */}
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
                        Update
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

export default EditTicket;
