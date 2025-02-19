import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";

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
import { toast } from "react-toastify";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  companyNameValidation,
  confirmPasswordValidation,
  emailValidation,
  firstNameValidation,
  gstNumberValidation,
  lastNameValidation,
  mobileNumberValidation,
  passwordValidation,
} from "../../customValidations/customValidations";
import loader from "../../assets/images/instaone-loader.svg";
import {
  errorStyle,
  LoaderHide,
  LoaderShow,
} from "../../helpers/common_constants";
import { postAPI } from "../../Services/Apis";

const AddCustomer = () => {
  const { id } = useParams(); // Fetch the id parameter from the route
  const location = useLocation(); // Access the location object to get state
  //   const { state } = location;
  //   console.log("State in EditCustomer:", state);
  // console.log(state.row.assign); // Check what is being passed in state

  // Example of accessing data fields

  document.title = "Instaone";

  const [selectedFiles, setselectedFiles] = useState([]);
  const [siteAddress, setSiteAddress] = useState("");
  const animatedComponents = makeAnimated();

  const optionGroup = [
    {
      // label: "Group 1",
      options: [
        {
          label: "67835",
          value: "site1",
          siteId: "123",
          siteAddress: "Nexapp Tech,Pune",
        },
        {
          label: "64815",
          value: "site2",
          siteId: "124",
          siteAddress: "Nano Stuff, Pune",
        },
      ],
    },
    {
      // label: "Group 2",
      options: [
        {
          label: "56734",
          value: "site3",
          siteId: "125",
          siteAddress: "Bank Of India, Kolhapur",
        },
        {
          label: "98765",
          value: "site4",
          siteId: "126",
          siteAddress: "TCS, Pune",
        },
      ],
    },
  ];

  const handleSelectGroup = (selectedGroup) => {
    if (selectedGroup) {
      setSiteAddress(selectedGroup.siteAddress);
    } else {
      setSiteAddress("");
    }
  };

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

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
      customerData: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        gstNumber: "",
      },
      billingData: {
        street: "",
        city: "",
        state: "",
        Country: "",
        pinCode: "",
      },
      shippingData: {
        street: "",
        city: "",
        state: "",
        Country: "",
        pinCode: "",
      },
    },

    validationSchema: Yup.object().shape({
      firstName: firstNameValidation,
      lastName: lastNameValidation,
      phone: mobileNumberValidation,
      email: emailValidation,
      password: passwordValidation,
      confirmPassword: confirmPasswordValidation,
      companyName: companyNameValidation,
      gstNumber: gstNumberValidation,
      billingData: Yup.object().shape({
        street: Yup.string().required("Billing street is required"),
        city: Yup.string().required("Billing city is required"),
        state: Yup.string().required("Billing state is required"),
        Country: Yup.string().required("Billing country is required"),
        pinCode: Yup.string()
          .required("Billing PIN code is required")
          .matches(/^[0-9]{6}$/, "Must be a valid 6-digit PIN code"),
      }),
      shippingData: Yup.object().shape({
        street: Yup.string().required("Shipping street is required"),
        city: Yup.string().required("Shipping city is required"),
        state: Yup.string().required("Shipping state is required"),
        Country: Yup.string().required("Shipping country is required"),
        pinCode: Yup.string()
          .required("Shipping PIN code is required")
          .matches(/^[0-9]{6}$/, "Must be a valid 6-digit PIN code"),
      }),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        LoaderShow();

        const data = {
          role: "customer",
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone.toString(),
          companyName: values.companyName,
          gstNumber: values.gstNumber,
          billingAddress: values.billingData,
          shippingAddress: values.shippingData,
        };

        const response = await postAPI("auth/register-customer", data);
        if (response.statusCode === 200) {
          toast.success(response.message);
          navigate("/admin/customer");
        }
      } catch (error) {
        toast.error(error.message);
        LoaderHide();
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Customer" breadcrumbItem="Add Customer" />
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
                  <h4 className="card-title mb-2">Add Customer</h4>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validationType.handleSubmit();
                      //   return false;
                    }}
                  >
                    <Row className="mb-4">
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.firstName || ""}
                          />
                          {validationType.errors.firstName ? (
                            <span style={errorStyle}>
                              {validationType.errors.firstName}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.lastName || ""}
                          />
                          {validationType.errors.lastName ? (
                            <span style={errorStyle}>
                              {validationType.errors.lastName}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Mobile Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="number"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.phone || ""}
                          />
                          {validationType.errors.phone ? (
                            <span style={errorStyle}>
                              {validationType.errors.phone}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.email || ""}
                          />
                          {validationType.errors.email ? (
                            <span style={errorStyle}>
                              {validationType.errors.email}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Password</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.password || ""}
                          />
                          {validationType.errors.password ? (
                            <span style={errorStyle}>
                              {validationType.errors.password}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.confirmPassword || ""}
                          />
                          {validationType.errors.confirmPassword ? (
                            <span style={errorStyle}>
                              {validationType.errors.confirmPassword}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-4">
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
                          {validationType.errors.companyName ? (
                            <span style={errorStyle}>
                              {validationType.errors.companyName}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>GST Number</Label>
                          <Input
                            id="gstNumber"
                            name="gstNumber"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.gstNumber || ""}
                          />
                          {validationType.errors.gstNumber ? (
                            <span style={errorStyle}>
                              {validationType.errors.gstNumber}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <h4>Billing Address</h4>
                    <Row className="mb-4">
                      <Col lg={6}>
                        <Label>Street</Label>
                        <Input
                          id="billingData.street"
                          name="billingData.street"
                          type="text"
                          onChange={validationType.handleChange}
                          onBlur={validationType.handleBlur}
                          value={validationType.values.billingData.street}
                        />
                        {validationType.errors.billingData?.street ? (
                          <div style={{ color: "red" }}>
                            {validationType.errors.billingData.street}
                          </div>
                        ) : null}
                      </Col>
                      <Col lg={6}>
                        <Label>City</Label>
                        <Input
                          id="billingData.city"
                          name="billingData.city"
                          type="text"
                          onChange={validationType.handleChange}
                          onBlur={validationType.handleBlur}
                          value={validationType.values.billingData.city}
                        />
                        {validationType.errors.billingData?.city ? (
                          <div style={{ color: "red" }}>
                            {validationType.errors.billingData.city}
                          </div>
                        ) : null}
                      </Col>
                      <Col lg={6}>
                        <Label>State</Label>
                        <Input
                          id="billingData.state"
                          name="billingData.state"
                          type="text"
                          onChange={validationType.handleChange}
                          onBlur={validationType.handleBlur}
                          value={validationType.values.billingData.state}
                        />
                        {validationType.errors.billingData?.state ? (
                          <div style={{ color: "red" }}>
                            {validationType.errors.billingData.state}
                          </div>
                        ) : null}
                      </Col>
                      <Col lg={6}>
                        <Label>Country</Label>
                        <Input
                          id="billingData.Country"
                          name="billingData.Country"
                          type="text"
                          onChange={validationType.handleChange}
                          onBlur={validationType.handleBlur}
                          value={validationType.values.billingData.Country}
                        />
                        {validationType.errors.billingData?.Country ? (
                          <div style={{ color: "red" }}>
                            {validationType.errors.billingData.Country}
                          </div>
                        ) : null}
                      </Col>
                      <Col lg={6}>
                        <Label>PIN Code</Label>
                        <Input
                          id="billingData.pinCode"
                          name="billingData.pinCode"
                          type="text"
                          onChange={validationType.handleChange}
                          onBlur={validationType.handleBlur}
                          value={validationType.values.billingData.pinCode}
                        />
                        {validationType.errors.billingData?.pinCode ? (
                          <div style={{ color: "red" }}>
                            {validationType.errors.billingData.pinCode}
                          </div>
                        ) : null}
                      </Col>
                    </Row>

                    <h4>Shipping Address</h4>
                    <Row className="mb-4">
                      <Col lg={6}>
                        <Label>Street</Label>
                        <Input
                          id="shippingData.street"
                          name="shippingData.street"
                          type="text"
                          onChange={validationType.handleChange}
                          onBlur={validationType.handleBlur}
                          value={validationType.values.shippingData.street}
                        />
                        {validationType.errors.shippingData?.street ? (
                          <div style={{ color: "red" }}>
                            {validationType.errors.shippingData.street}
                          </div>
                        ) : null}
                      </Col>
                      <Col lg={6}>
                        <Label>City</Label>
                        <Input
                          id="shippingData.city"
                          name="shippingData.city"
                          type="text"
                          onChange={validationType.handleChange}
                          onBlur={validationType.handleBlur}
                          value={validationType.values.shippingData.city}
                        />
                        {validationType.errors.shippingData?.city ? (
                          <div style={{ color: "red" }}>
                            {validationType.errors.shippingData.city}
                          </div>
                        ) : null}
                      </Col>
                      <Col lg={6}>
                        <Label>State</Label>
                        <Input
                          id="shippingData.state"
                          name="shippingData.state"
                          type="text"
                          onChange={validationType.handleChange}
                          onBlur={validationType.handleBlur}
                          value={validationType.values.shippingData.state}
                        />
                        {validationType.errors.shippingData?.state ? (
                          <div style={{ color: "red" }}>
                            {validationType.errors.shippingData.state}
                          </div>
                        ) : null}
                      </Col>
                      <Col lg={6}>
                        <Label>Country</Label>
                        <Input
                          id="shippingData.Country"
                          name="shippingData.Country"
                          type="text"
                          onChange={validationType.handleChange}
                          onBlur={validationType.handleBlur}
                          value={validationType.values.shippingData.Country}
                        />
                        {validationType.errors.shippingData?.Country ? (
                          <div style={{ color: "red" }}>
                            {validationType.errors.shippingData.Country}
                          </div>
                        ) : null}
                      </Col>
                      <Col lg={6}>
                        <Label>PIN Code</Label>
                        <Input
                          id="shippingData.pinCode"
                          name="shippingData.pinCode"
                          type="text"
                          onChange={validationType.handleChange}
                          onBlur={validationType.handleBlur}
                          value={validationType.values.shippingData.pinCode}
                        />
                        {validationType.errors.shippingData?.pinCode ? (
                          <div style={{ color: "red" }}>
                            {validationType.errors.shippingData.pinCode}
                          </div>
                        ) : null}
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                      <Link to="/admin/customer">
                        <Button type="reset" color="secondary">
                          Cancel
                        </Button>
                      </Link>
                      <Button type="submit" color="primary">
                        Add Customer
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

export default AddCustomer;
