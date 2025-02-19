import React, { useEffect, useState } from "react";
import {
  NavItem,
  TabContent,
  TabPane,
  NavLink,
  UncontrolledTooltip,
  Card,
  Label,
  Col,
  Row,
} from "reactstrap";
import Select from "react-select";
import classnames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getAPI, postAPI } from "../../../Services/Apis";
import { Banks } from "../../../constants/ObjectData";
import loader from "../../../assets/images/instaone-loader.svg";

import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import {
  errorStyle,
  LoaderHide,
  LoaderShow,
} from "../../../helpers/common_constants";

const ClassCRegister = () => {
  const getPhoneNumber = JSON.parse(localStorage?.getItem("registerNumber"));
  const getpassword = JSON.parse(localStorage?.getItem("registerPassword"));

  let navigate = useNavigate();

  const [activeTab, setactiveTab] = useState(1);
  const [ispDetails, setISPDetails] = useState();
  const [licenceCopy, setLicenceCopy] = useState([]);
  const [cancelCheque, setCancelCheque] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [billingDetails, setBillingDetails] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = React.useState([]);

  const handleCompanyChange = (e) => {
    const selectedCompanyId = e.target.value;
    const selected = ispDetails.find((isp) => isp._id === selectedCompanyId);
    setSelectedCompany(selected);
  };

  const reDirect = () => {
    navigate("/login");
  };

  useEffect(() => {
    getISPDetails();
  }, []);

  const getISPDetails = async () => {
    try {
      const response = await getAPI("isp/get-isp");
      if (response.statusCode === 200) {
        setISPDetails(response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const validationSchemas = {
    1: Yup.object().shape({
      companyName: Yup.string().required("Company Name is required"),
      vendorName: Yup.string().required("Vendor Name is required"),
      email: Yup.string()
        .matches(
          /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
          "Enter a valid email address"
        )
        .required("Email is required"),
      panCard: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN card number")
        .required("PAN card is required"),
      aadharCard: Yup.string()
        .matches(/^\d{12}$/, "Aadhaar card must be exactly 12 digits")
        .required("Aadhaar card is required"),
      // gstNumber: Yup.string()
      //   .nullable()
      //   .notRequired()
      //   .when("gstNumber", {
      //     is: (value) => value?.trim() !== "",
      //     then: Yup.string().matches(
      //       /^\d{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z1-9]{1}Z[0-9A-Z]{1}$/,
      //       "Enter a valid GST number"
      //     ),
      //   }),
    }),
    2: Yup.object().shape({
      licenceNumber: Yup.string().required("Licence Number is required"),
      ispServices: Yup.array()
        .of(
          Yup.object().shape({
            label: Yup.string().required("Service label is required"),
            value: Yup.string().required("Service value is required"),
          })
        )
        .min(1, "Please select at least one service"),
      // licenceCopy: Yup.array()
      //   .min(1, "Upload at least one licence copy")
      //   .required(),
      cancelCheque: Yup.array()
        .min(1, "Upload at least one cancelled cheque")
        .required(),
      billingOption: Yup.string()
        .oneOf(["MRC", "QRC", "HRC", "ARC"], "Invalid billing option")
        .required("Billing option is required"),
      price: Yup.number()
        .positive("Price must be greater than 0")
        .required("Price is required"),
      planOptions: Yup.string().required("Plan option is required"),
      otc: Yup.string().required("One time cost is required"),
    }),
    3: Yup.object().shape({
      permanentAddress: Yup.object().shape({
        pinCode: Yup.string()
          .required("Pin Code is required")
          .matches(
            /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/,
            "Enter a valid pincode"
          ),
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        country: Yup.string().required("Country is required"),
      }),
      officeAddress: Yup.object().shape({
        pinCode: Yup.string()
          .required("Pin Code is required")
          .matches(
            /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/,
            "Enter a valid pincode"
          ),
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        country: Yup.string().required("Country is required"),
      }),
    }),
  };

  const validateTab = async (tab) => {
    const schema = validationSchemas[tab];
    if (schema) {
      try {
        await schema.validate(ispValidation.values, { abortEarly: false });
        return true;
      } catch (error) {
        error?.inner?.forEach((err) => {
          ispValidation?.setFieldError(err.path, err.message);
        });
        return false;
      }
    }
    return true;
  };
  const toggleTab = async (tab) => {
    if (tab < 1 || tab > 4) return;
    if (tab > activeTab) {
      const isValid = await validateTab(activeTab);
      if (!isValid) return;
    }
    setactiveTab(tab);
  };

  const billingOptions = [
    { value: "MRC", label: "MRC" },
    { value: "QRC", label: "QRC" },
    { value: "HRC", label: "HRC" },
    { value: "ARC", label: "ARC" },
  ];

  const planOptions = [
    { value: "10MBPS", label: "10MBPS" },
    { value: "20MBPS", label: "20MBPS" },
    { value: "30MBPS", label: "30MBPS" },
    { value: "40MBPS", label: "40MBPS" },
    { value: "50MBPS", label: "50MBPS" },
    { value: "100MBPS", label: "100MBPS" },
    { value: "200MBPS", label: "200MBPS" },
    { value: "500MBPS", label: "500MBPS" },
    { value: "1GBPS", label: "1GBPS" },
  ];

  const bankAccount = [
    { value: "savings", label: "Savings" },
    { value: "current", label: "Current" },
    { value: "salary", label: "Salary" },
    { value: "demat", label: "Demat" },
  ];

  const Formhandle = (e) => {
    e.preventDefault();
    ispValidation.handleSubmit();
  };

  function handleLicenceCopy(files, setFieldValue) {
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
    setFieldValue("licenceCopy", files); // This only stores the file objects in Formik state

    // Store the files with metadata for UI preview
    setLicenceCopy(updatedFiles);
  }

  function handleCancelCheque(files, setFieldValue) {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    const updatedFiles = files
      .map((file) => {
        if (!allowedTypes.includes(file.type)) {
          toast.error("Only PDF and image files are allowed.");
          return null;
        }

        return Object.assign(file, {
          preview: URL.createObjectURL(file),
          formattedSize: formatBytes(file.size),
        });
      })
      .filter(Boolean);

    setFieldValue("cancelCheque", files);

    setCancelCheque(updatedFiles);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const servicesDropdown = [
    { label: "Broadband", value: "broadband" },
    { label: "ILL (Internet Lease Time)", value: "ILL" },
    { label: "P2P (Point to Point)", value: "P2P" },
    { label: "MPLS", value: "MPLS" },
  ];

  const handleSelectServices = (selectedOptions, setFieldValue) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))
      : [];
    setFieldValue("ispServices", selectedValues);
  };

  const ispValidation = useFormik({
    initialValues: {
      user: "isp",
      role: "isp",
      phone: getPhoneNumber.phone,
      password: getpassword.password,
      companyName: "",
      vendorName: "",
      email: "",
      panCard: "",
      aadharCard: "",
      gstNumber: "",
      licenceCopy: [],
      cancelCheque: [],
      licenceNumber: "",
      ispServices: [],
      billingOption: "", // Selected billing option
      price: "", // Price associated with the selected option
      planOptions: "",
      otc: "",
      permanentAddress: {
        pinCode: "",
        street: "",
        city: "",
        state: "",
        country: "",
      },
      officeAddress: {
        pinCode: "",
        street: "",
        city: "",
        state: "",
        country: "",
      },
      copyAddress: false, // For the checkbox
      bankDetails: {
        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        cnfmAccountNumber: "",
        ifscCode: "",
        branchName: "",
        accountType: "",
      },
    },
    validationSchema: Yup.object().shape({
      bankDetails: Yup.object().shape({
        bankName: Yup.string().required("Bank name is required"),
        accountHolderName: Yup.string().required(
          "Account holder name is required"
        ),
        ifscCode: Yup.string()
          .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code")
          .required("IFSC code is required"),
        branchName: Yup.string().required("Branch name is required"),
        accountNumber: Yup.string()
          .matches(/^\d+$/, "Account Number must contain only digits") // Ensure numeric input
          .min(8, "Account Number must be at least 8 digits")
          .max(16, "Account Number cannot exceed 16 digits")
          .required("Account Number is required"),
        cnfmAccountNumber: Yup.string()
          .required("Confirm Account Number is required")
          .oneOf(
            [Yup.ref("accountNumber"), null],
            "Confirm Account Number must match Account Number"
          ),
        accountType: Yup.string().required("Account type is required"),
      }),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        LoaderShow();
        const newBillingDetail = {
          billingOption: values.billingOption,
          price: parseFloat(values.price),
        };

        setBillingDetails((prevDetails) => [...prevDetails, newBillingDetail]);

        const formData = new FormData();

        formData.append("user", values.user);
        formData.append("role", values.role);
        formData.append("phone", values.phone);
        formData.append("password", values.password);
        formData.append("companyName", values.companyName);
        formData.append("vendorName", values.vendorName);
        formData.append("email", values.email);
        formData.append("panCard", values.panCard);
        formData.append("gstNumber", values.gstNumber);
        formData.append("licenceNumber", values.licenceNumber);
        formData.append("price", values.price);
        formData.append("planOptions", values.planOptions);
        formData.append("otc", values.otc);
        formData.append(
          "permanentAddress",
          JSON.stringify(values.permanentAddress)
        );
        formData.append("officeAddress", JSON.stringify(values.officeAddress)); // Serialize objects
        formData.append("bankDetails", JSON.stringify(values.bankDetails)); // Serialize objects
        formData.append("ispServices", JSON.stringify(values.ispServices)); // Serialize arrays
        if (values.licenceCopy.length > 0) {
          formData.append("licenceCopy", values.licenceCopy[0]); // Replace with actual file object
        }
        if (values.cancelCheque.length > 0) {
          formData.append("cancelCheque", values.cancelCheque[0]); // Replace with actual file object
        }
        formData.append("newBillingDetail", JSON.stringify(newBillingDetail));

        const response = await postAPI("isp/register-isp", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Optional; axios sets this automatically for FormData
          },
        });
        if (response.statusCode === 200) {
          LoaderHide();
          toast.success(response.message);
          resetForm();
          localStorage.removeItem("registerNumber");
          localStorage.removeItem("registerPassword");
          navigate("/login");
        }
      } catch (error) {
        LoaderHide();
        toast.error(error.message);
      }
    },
  });

  return (
    <React.Fragment>
      <div
        id="hideloding"
        className="loding-display"
        style={{ display: "none" }}
      >
        <img src={loader} alt="loader-img" />
      </div>

      <div id="basic-pills-wizard" className="twitter-bs-wizard">
        <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
          <NavItem>
            <NavLink
              href="#"
              className={classnames({ active: activeTab === 1 })}
              onClick={() => {
                toggleTab(1);
              }}
            >
              <div
                className="step-icon"
                data-bs-toggle="tooltip"
                id="ProfileDetails"
              >
                <i className="bx bx-list-ul"></i>
                <UncontrolledTooltip placement="top" target="ProfileDetails">
                  Profile Details
                </UncontrolledTooltip>
              </div>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#"
              className={classnames({ active: activeTab === 2 })}
              onClick={() => {
                toggleTab(2);
              }}
            >
              <div
                className="step-icon"
                data-bs-toggle="tooltip"
                id="ContactDetails"
              >
                <i className="bx bx-book-bookmark"></i>
                <UncontrolledTooltip placement="top" target="ContactDetails">
                  Contact Details
                </UncontrolledTooltip>
              </div>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#"
              className={classnames({ active: activeTab === 3 })}
              onClick={() => {
                toggleTab(3);
              }}
            >
              <div
                className="step-icon"
                data-bs-toggle="tooltip"
                id="AddressDetails"
              >
                <i className="bx bxs-home"></i>
                <UncontrolledTooltip placement="top" target="AddressDetails">
                  Address Details
                </UncontrolledTooltip>
              </div>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#"
              className={classnames({ active: activeTab === 4 })}
              onClick={() => {
                toggleTab(4);
              }}
            >
              <div
                className="step-icon"
                data-bs-toggle="tooltip"
                id="bankDetails"
              >
                <i className="bx bxs-bank"></i>
                <UncontrolledTooltip placement="top" target="bankDetails">
                  Bank Details
                </UncontrolledTooltip>
              </div>
            </NavLink>
          </NavItem>
        </ul>
        <form onSubmit={Formhandle}>
          <TabContent
            className="twitter-bs-wizard-tab-content"
            activeTab={activeTab}
          >
            {/* Tab One Details */}
            <TabPane tabId={1}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="companyName" className="form-label">
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      value={ispValidation.values.companyName}
                      onChange={(e) => {
                        ispValidation.handleChange(e);
                        setFilteredCompanies(
                          ispDetails?.filter((isp) =>
                            isp.ISP.toLowerCase().includes(
                              e.target.value.toLowerCase()
                            )
                          )
                        );
                      }}
                      onBlur={ispValidation.handleBlur}
                      className="form-control"
                      placeholder="Enter or select a company name"
                      autoComplete="off"
                    />
                    {filteredCompanies.length > 0 &&
                      ispValidation.values.companyName && (
                        <ul
                          className="list-group mt-2"
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                          {filteredCompanies.map((isp) => (
                            <li
                              key={isp._id}
                              className="list-group-item list-group-item-action"
                              onClick={() => {
                                ispValidation.setFieldValue(
                                  "companyName",
                                  isp.ISP
                                );
                                setSelectedCompany(isp);
                                setFilteredCompanies([]);
                              }}
                            >
                              {isp.ISP}
                            </li>
                          ))}
                        </ul>
                      )}
                    {ispValidation.errors.companyName ? (
                      <span style={errorStyle}>
                        {ispValidation.errors.companyName}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-firstname-input"
                      className="form-label"
                    >
                      Vendor Name
                    </label>
                    <input
                      id="vendorName"
                      type="text"
                      name="vendorName"
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleChange}
                      value={ispValidation.values.vendorName}
                      className="form-control"
                      placeholder="Enter Your Vendor Name"
                    />
                    {ispValidation.errors.vendorName ? (
                      <span style={errorStyle}>
                        {ispValidation.errors.vendorName}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-firstname-input"
                      className="form-label"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="text"
                      name="email"
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleChange}
                      value={ispValidation.values.email}
                      className="form-control"
                      placeholder="Enter Your Email"
                    />
                    {ispValidation?.errors?.email ? (
                      <span style={{ color: "red" }}>
                        {ispValidation?.errors?.email}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-firstname-input"
                      className="form-label"
                    >
                      Mobile Number
                    </label>
                    <input
                      id="phone"
                      type="number"
                      name="phone"
                      readOnly
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleChange}
                      value={ispValidation.values.phone}
                      className="form-control"
                      placeholder="Enter Your Mobile Number"
                    />
                    {ispValidation.errors.phone ? (
                      <span style={errorStyle}>
                        {ispValidation.errors.phone}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-firstname-input"
                      className="form-label"
                    >
                      Pan Card
                    </label>
                    <input
                      id="panCard"
                      type="text"
                      name="panCard"
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleChange}
                      value={ispValidation.values.panCard}
                      className="form-control"
                      placeholder="Enter Your Pan Card"
                    />
                    {ispValidation?.errors?.panCard ? (
                      <span style={{ color: "red" }}>
                        {ispValidation?.errors?.panCard}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-firstname-input"
                      className="form-label"
                    >
                      Aadhaar Card
                    </label>
                    <input
                      id="aadharCard"
                      type="number"
                      name="aadharCard"
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleChange}
                      value={ispValidation.values.aadharCard}
                      className="form-control"
                      placeholder="Enter Your Aadhar Card Number"
                      maxLength={12}
                    />
                    {ispValidation.errors.aadharCard ? (
                      <span style={errorStyle}>
                        {ispValidation.errors.aadharCard}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-firstname-input"
                      className="form-label"
                    >
                      GST Number
                    </label>
                    <input
                      id="gstNumber"
                      type="text"
                      name="gstNumber"
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleChange}
                      value={ispValidation.values.gstNumber}
                      className="form-control"
                      placeholder="Enter Your GST Number"
                    />
                    {ispValidation?.errors?.gstNumber ? (
                      <span style={{ color: "red" }}>
                        {ispValidation?.errors?.gstNumber}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </TabPane>

            {/* Tab Two Details */}
            <TabPane tabId={2}>
              <div className="text-center mb-4">
                <h5>Company Details</h5>
                <p className="card-title-desc">Fill all information below</p>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-firstname-input"
                      className="form-label"
                    >
                      Licence Number
                    </label>
                    <input
                      id="licenceNumber"
                      type="text"
                      name="licenceNumber"
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleChange}
                      value={ispValidation.values.licenceNumber}
                      className="form-control"
                      placeholder="Enter Your Licence Number"
                    />
                    {ispValidation.errors.licenceNumber ? (
                      <span style={errorStyle}>
                        {ispValidation.errors.licenceNumber}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label>Services</label>
                    <Select
                      isMulti
                      name="ispServices"
                      id="ispServices"
                      options={servicesDropdown}
                      onChange={(selectedOptions) =>
                        handleSelectServices(
                          selectedOptions,
                          ispValidation.setFieldValue
                        )
                      }
                      onBlur={() =>
                        ispValidation.setFieldTouched("ispServices", true)
                      }
                    />
                    {ispValidation?.errors?.ispServices ? (
                      <span style={{ color: "red" }}>
                        {ispValidation?.errors?.ispServices}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <div className="mb-3">
                      <Label className="form-label">Upload Licence Copy</Label>
                      <Dropzone
                        onDrop={(acceptedFiles) => {
                          handleLicenceCopy(
                            acceptedFiles,
                            ispValidation.setFieldValue
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
                        {licenceCopy.map((file, i) => {
                          return (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    {file.type.startsWith("image/") ? (
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
                    {ispValidation?.errors?.licenceCopy ? (
                      <span style={{ color: "red" }}>
                        {ispValidation?.errors?.licenceCopy}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <div className="mb-3">
                      <Label className="form-label">Upload Cancel Cheque</Label>
                      <Dropzone
                        onDrop={(acceptedFiles) => {
                          handleCancelCheque(
                            acceptedFiles,
                            ispValidation.setFieldValue
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
                        {cancelCheque.map((file, i) => {
                          return (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    {file.type.startsWith("image/") ? (
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
                    {ispValidation?.errors?.cancelCheque ? (
                      <span style={{ color: "red" }}>
                        {ispValidation?.errors?.cancelCheque}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label>Billing Option</label>
                    <Select
                      options={billingOptions}
                      onChange={(option) =>
                        ispValidation.setFieldValue(
                          "billingOption",
                          option.value
                        )
                      }
                      name="billingOption"
                    />
                    {ispValidation.errors.billingOption ? (
                      <div style={{ color: "red" }}>
                        {ispValidation.errors.billingOption}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div>
                    <label>Billing Price</label>
                    <input
                      type="number"
                      name="price"
                      value={ispValidation.values.price}
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleBlur}
                      className="form-control"
                      placeholder="Enter Your Billing Price"
                    />
                    {ispValidation.errors.price ? (
                      <div style={{ color: "red" }}>
                        {ispValidation.errors.price}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="row ">
                <div className="col-lg-6">
                  <div>
                    <label>Plan</label>
                    <Select
                      options={planOptions}
                      onChange={(option) =>
                        ispValidation.setFieldValue("planOptions", option.value)
                      }
                      name="planOptions"
                    />
                    {ispValidation.errors.planOptions ? (
                      <div style={{ color: "red" }}>
                        {ispValidation.errors.planOptions}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div>
                    <label>One Time Cost</label>
                    <input
                      type="number"
                      name="otc"
                      value={ispValidation.values.otc}
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleBlur}
                      className="form-control"
                      placeholder="Enter Your One Time Cost"
                    />
                    {ispValidation.errors.otc ? (
                      <div style={{ color: "red" }}>
                        {ispValidation.errors.otc}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </TabPane>

            {/* Tab Three Details */}
            <TabPane tabId={3}>
              <div className="text-center mb-4">
                <h5>Address Details</h5>
                <p className="card-title-desc">Fill all information below</p>
              </div>
              <div className="row">
                {/* Checkbox for Copying Address */}
                <div className="col-lg-12">
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="sameAddress"
                      onChange={(e) => {
                        if (e.target.checked) {
                          ispValidation.setFieldValue(
                            "officeAddress",
                            ispValidation.values.permanentAddress
                          );
                        } else {
                          ispValidation.setFieldValue("officeAddress", {
                            pinCode: "",
                            street: "",
                            city: "",
                            state: "",
                            country: "",
                          });
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="sameAddress">
                      Same as Permanent Address
                    </label>
                  </div>
                </div>

                {/* Permanent Address on Left & Office Address on Right */}
                <div className="row">
                  <div className="col-lg-6">
                    <h5>Permanent Address</h5>
                    {["pinCode", "street", "city", "state", "country"].map(
                      (field) => (
                        <div className="mb-3" key={`permanent-${field}`}>
                          <label className="form-label">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            type={field === "pinCode" ? "number" : "text"}
                            name={`permanentAddress.${field}`}
                            value={
                              ispValidation.values.permanentAddress[field] || ""
                            }
                            onChange={ispValidation.handleChange}
                            onBlur={ispValidation.handleBlur}
                            className="form-control"
                          />
                          {ispValidation.errors.permanentAddress?.[field] && (
                            <span style={{ color: "red" }}>
                              {ispValidation.errors.permanentAddress[field]}
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  <div className="col-lg-6">
                    <h5>Office Address</h5>
                    {["pinCode", "street", "city", "state", "country"].map(
                      (field) => (
                        <div className="mb-3" key={`office-${field}`}>
                          <label className="form-label">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            type={field === "pinCode" ? "number" : "text"}
                            name={`officeAddress.${field}`}
                            value={ispValidation.values.officeAddress[field]}
                            onChange={ispValidation.handleChange}
                            onBlur={ispValidation.handleBlur}
                            className="form-control"
                          />
                          {ispValidation.errors.officeAddress?.[field] && (
                            <span style={{ color: "red" }}>
                              {ispValidation.errors.officeAddress[field]}
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </TabPane>

            {/* Tab Four Details */}
            <TabPane tabId={4}>
              <div className="text-center mb-4">
                <h5>Bank Details</h5>
                <p className="card-title-desc">Fill all information below</p>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="bankName" className="form-label">
                      Bank Name
                    </label>
                    <select
                      id="bankName"
                      name="bankDetails.bankName"
                      value={ispValidation.values.bankDetails.bankName}
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleBlur}
                      className="form-control"
                    >
                      <option value="" disabled>
                        Select Bank
                      </option>
                      {Object.entries(Banks).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                    {ispValidation.errors.bankDetails?.bankName ? (
                      <span style={{ color: "red" }}>
                        {ispValidation.errors.bankDetails.bankName}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div>
                    <label>Account Type</label>
                    <Select
                      options={bankAccount}
                      onChange={(option) =>
                        ispValidation.setFieldValue(
                          "bankDetails.accountType",
                          option.value
                        )
                      }
                      name="bankDetails.accountType"
                    />
                    {ispValidation.errors.bankDetails?.accountType ? (
                      <div style={{ color: "red" }}>
                        {ispValidation.errors.bankDetails.accountType}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-cardno-input"
                      className="form-label"
                    >
                      Account Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="basicpill-cardno-input"
                      name="bankDetails.accountNumber" // Nested path
                      value={ispValidation.values.bankDetails.accountNumber}
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleBlur}
                    />
                    {ispValidation.errors.bankDetails?.accountNumber ? (
                      <span style={{ color: "red" }}>
                        {ispValidation.errors.bankDetails.accountNumber}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-card-verification-input"
                      className="form-label"
                    >
                      Confirm Account Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="basicpill-card-verification-input"
                      name="bankDetails.cnfmAccountNumber" // Nested path
                      value={ispValidation.values.bankDetails.cnfmAccountNumber}
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleBlur}
                    />
                    {ispValidation.errors.bankDetails?.cnfmAccountNumber ? (
                      <span style={{ color: "red" }}>
                        {ispValidation.errors.bankDetails.cnfmAccountNumber}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  {" "}
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-cardno-input"
                      className="form-label"
                    >
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="basicpill-cardno-input"
                      name="bankDetails.accountHolderName"
                      value={ispValidation.values.bankDetails.accountHolderName}
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleBlur}
                    />
                    {ispValidation.errors.bankDetails?.accountHolderName ? (
                      <span style={{ color: "red" }}>
                        {ispValidation.errors.bankDetails.accountHolderName}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-cardno-input"
                      className="form-label"
                    >
                      IFSC Code{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="basicpill-cardno-input"
                      name="bankDetails.ifscCode"
                      value={ispValidation.values.bankDetails.ifscCode}
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleBlur}
                    />
                    {ispValidation.errors.bankDetails?.ifscCode ? (
                      <span style={{ color: "red" }}>
                        {ispValidation.errors.bankDetails.ifscCode}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-cardno-input"
                      className="form-label"
                    >
                      Branch Name{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="basicpill-cardno-input"
                      name="bankDetails.branchName"
                      value={ispValidation.values.bankDetails.branchName}
                      onChange={ispValidation.handleChange}
                      onBlur={ispValidation.handleBlur}
                    />
                    {ispValidation.errors.bankDetails?.branchName ? (
                      <span style={{ color: "red" }}>
                        {ispValidation.errors.bankDetails.branchName}
                      </span>
                    ) : null}
                  </div>
                </div>
                {/* {["accountHolderName", "ifscCode", "branchName"].map(
                      (field) => (
                        <div className="col-lg-6" key={field}>
                          <div className="mb-3">
                            <label className="form-label">
                              {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            <input
                              type="text"
                              name={`bankDetails.${field}`}
                              value={ispValidation.values.bankDetails[field]}
                              onChange={ispValidation.handleChange}
                              onBlur={ispValidation.handleBlur}
                              className="form-control"
                            />
                            {ispValidation?.errors?.bankDetails?.[field] ? (
                              <span style={{ color: "red" }}>
                                {ispValidation.errors.bankDetails[field]}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      )
                    )} */}
              </div>
            </TabPane>
          </TabContent>

          {/* Next Previous */}
          <ul className="pager wizard twitter-bs-wizard-pager-link">
            <li className={activeTab === 1 ? "previous disabled" : "previous"}>
              <Link
                to="#"
                className={
                  activeTab === 1
                    ? "btn btn-primary disabled"
                    : "btn btn-primary"
                }
                onClick={() => {
                  toggleTab(activeTab - 1);
                }}
              >
                <i className="bx bx-chevron-left me-1"></i> Previous
              </Link>
            </li>

            {activeTab > 3 ? (
              <li className="next">
                <button
                  className="btn btn-primary w-100 waves-effect waves-light"
                  type="submit"
                >
                  save
                </button>
                {/* <Link
                                            to="/login"
                                            className="btn btn-primary"
                                        >
                                            Save
                                        </Link> */}
              </li>
            ) : (
              <li className="next">
                <Link
                  to="#"
                  className="btn btn-primary"
                  onClick={() => toggleTab(activeTab + 1)}
                >
                  Next <i className="bx bx-chevron-right ms-1"></i>
                </Link>
              </li>
            )}
          </ul>
        </form>
      </div>
    </React.Fragment>
  );
};

export default ClassCRegister;
