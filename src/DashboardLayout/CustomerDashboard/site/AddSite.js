import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import Select from "react-select";
import "../../../assets/scss/pages/ticket.scss";
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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { postAPI } from "../../../Services/Apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  errorStyle,
  LoaderHide,
  LoaderShow,
} from "../../../helpers/common_constants";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getUserDetails } from "../../../common/utility";
import {
  cityValidation,
  colonyNameValidation,
  companyNameValidation,
  landMarkValidation,
  legalCodeValidation,
  localContactNameValidation,
  mobileNumberValidation,
  pincodeValidation,
  siteAddressValidation,
  siteNameValidation,
  stateValidation,
  streetAddressValidation,
} from "../../../customValidations/customValidations";
import loader from "../../../assets/images/instaone-loader.svg";

const AddSite = () => {
  document.title = "Instaone";
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const navigate = useNavigate();

  const handleInputChange = async (e) => {
    const { value } = e.target;
    setInput(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          "https://api.olamaps.io/places/v1/autocomplete",
          {
            params: {
              input: value,
              api_key: "FANgz5SPPeXsGdtDz2c3X1k4NzGejJLAK3CcTubL",
            },
            headers: {
              "X-Request-Id": uuidv4(),
            },
          }
        );

        if (response.data && response.data.predictions) {
          setSuggestions(response.data.predictions);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setInput(suggestion.description);
    setSuggestions([]);

    try {
      const response = await axios.get(
        "https://api.olamaps.io/places/v1/geocode",
        {
          params: {
            address: suggestion.description,
            api_key: "FANgz5SPPeXsGdtDz2c3X1k4NzGejJLAK3CcTubL",
          },
          headers: {
            "X-Request-Id": uuidv4(),
          },
        }
      );

      if (response.data) {
        const selectedAddress = suggestion.description;
        setAddress(selectedAddress);

        const pincodeRegex = /\b\d{6}\b/; // Match 6 digit pincode
        const pincodeMatch = selectedAddress.match(pincodeRegex);

        if (pincodeMatch) {
          validationType.setFieldValue("pincode", pincodeMatch[0], true); // Set pincode with form validation
          validationType.setFieldTouched("pincode", false); // Reset the touched state
          validationType.setFieldError("pincode", undefined); // Clear any pincode error
        } else {
          setPincode(""); // Allow manual entry if not found
        }
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const validationType = useFormik({
    initialValues: {
      pincode: "",
      city: "",
      state: "",
      legalCode: "",
      localContactName: "",
      localContactPhone: "",
      siteName: "",
      address: "",
      companyName: "",
      streetAddress: "",
      landMark: "",
      colonyName: "",
    },

    validationSchema: Yup.object().shape({
      siteName: siteNameValidation,
      // legalCode: legalCodeValidation,
      pincode: pincodeValidation,
      localContactName: localContactNameValidation,
      localContactPhone: mobileNumberValidation,
      address: siteAddressValidation,
      companyName: companyNameValidation,
      streetAddress: streetAddressValidation,
      landMark: landMarkValidation,
      // colonyName: colonyNameValidation,
      city: cityValidation,
      state: stateValidation,
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        LoaderShow();
        const user = getUserDetails();

        const data = {
          pincode: values.pincode,
          city: values.city,
          state: values.state,
          localContactName: values.localContactName,
          localContactPhone: values.localContactPhone,
          //   address: values.address,
          address: address,
          legalCode: values.legalCode,
          siteName: values.siteName,
          companyName: values.companyName,
          streetAddress: values.streetAddress,
          landMark: values.landMark,
          colonyName: values.colonyName,
          userId: user?.userId,
        };

        const response = await postAPI("site/add-site", data);
        if (response.statusCode === 200) {
          LoaderHide();
          toast.success(response.message);
          navigate("/customer/allsite");
        }
      } catch (error) {
        toast.error(error.message);
        LoaderHide();
      }
    },
  });

  const gotoSitePage = () => {
    navigate("/customer/allsite");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Site" breadcrumbItem="Add Site" />
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
                  <h4 className="card-title mb-2">Add Site</h4>
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
                      <h5 className="mb-2">Site Information</h5>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Site Name</Label>
                          <Input
                            id="siteName"
                            name="siteName"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.siteName || ""}
                          />
                          {validationType.touched.siteName &&
                            validationType.errors.siteName ? (
                            <span style={errorStyle}>
                              {validationType.errors.siteName}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Legal Code</Label>
                          <Input
                            id="legalCode"
                            name="legalCode"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.legalCode || ""}
                          />
                          {validationType.touched.legalCode &&
                            validationType.errors.legalCode ? (
                            <span style={errorStyle}>
                              {validationType.errors.legalCode}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <h5 className="mb-2">Address Information</h5>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Site Address</Label>
                          <Input
                            id="address"
                            name="address"
                            type="text"
                            value={input}
                            onChange={(e) => {
                              handleInputChange(e);
                              validationType.setFieldValue(
                                "address",
                                e.target.value
                              );
                            }}
                            onBlur={validationType.handleBlur}
                          />
                          {suggestions.length > 0 && (
                            <ul className="suggestions">
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
                          )}
                          {validationType.touched.address &&
                            validationType.errors.address ? (
                            <span style={errorStyle}>
                              {validationType.errors.address}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">PIN Code</Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={pincode || validationType.values.pincode}
                          />
                          {validationType.touched.pincode &&
                            validationType.errors.pincode ? (
                            <span style={errorStyle}>
                              {validationType.errors.pincode}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Company Name</Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.companyName || ""}
                          />
                          {validationType.touched.companyName &&
                            validationType.errors.companyName ? (
                            <span style={errorStyle}>
                              {validationType.errors.companyName}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Street Address</Label>
                          <Input
                            id="streetAddress"
                            name="streetAddress"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.streetAddress || ""}
                          />
                          {validationType.touched.streetAddress &&
                            validationType.errors.streetAddress ? (
                            <span style={errorStyle}>
                              {validationType.errors.streetAddress}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Land Mark</Label>
                          <Input
                            id="landMark"
                            name="landMark"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.landMark || ""}
                          />
                          {validationType.touched.landMark &&
                            validationType.errors.landMark ? (
                            <span style={errorStyle}>
                              {validationType.errors.landMark}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Map Location (optional)</Label>
                          <Input
                            id="colonyName"
                            name="colonyName"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.colonyName || ""}
                          />
                          {validationType.touched.colonyName &&
                            validationType.errors.colonyName ? (
                            <span style={errorStyle}>
                              {validationType.errors.colonyName}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>City</Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.city || ""}
                          />
                          {validationType.touched.city &&
                            validationType.errors.city ? (
                            <span style={errorStyle}>
                              {validationType.errors.city}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>State</Label>
                          <Input
                            id="state"
                            name="state"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.state || ""}
                          />
                          {validationType.touched.state &&
                            validationType.errors.state ? (
                            <span style={errorStyle}>
                              {validationType.errors.state}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      {/* <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">State</Label>
                          <Input
                            id="state"
                            name="state"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.state || ""}
                          />
                          {validationType.touched.state &&
                          validationType.errors.state ? (
                            <span style={errorStyle}>
                              {validationType.errors.state}
                            </span>
                          ) : null}
                        </div>
                      </Col> */}
                      {/* <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">City</Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.city || ""}
                          />
                          {validationType.touched.city &&
                          validationType.errors.city ? (
                            <span style={errorStyle}>
                              {validationType.errors.city}
                            </span>
                          ) : null}
                        </div>
                      </Col> */}
                      {/* <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">PIN Code</Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.pincode || ""}
                          />
                          {validationType.touched.pincode &&
                          validationType.errors.pincode ? (
                            <span style={errorStyle}>
                              {validationType.errors.pincode}
                            </span>
                          ) : null}
                        </div>
                      </Col> */}
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
                            name="localContactPhone"
                            id="mobileNumber"
                            type="number"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={
                              validationType.values.localContactPhone || ""
                            }
                            maxLength="10"
                          />
                          {validationType.touched.localContactPhone &&
                            validationType.errors.localContactPhone ? (
                            <span style={errorStyle}>
                              {validationType.errors.localContactPhone}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        onClick={gotoSitePage}
                        type="reset"
                        color="secondary"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" color="primary">
                        Add Site
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

export default AddSite;
