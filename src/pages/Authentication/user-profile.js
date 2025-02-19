import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";
import { toast } from "react-toastify";
import loader from "../../assets/images/instaone-loader.svg";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import withRouter from "../../components/Common/withRouter";

//redux
import { useSelector, useDispatch } from "react-redux";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { createSelector } from "reselect";
import { getAPI, postAPI } from "../../Services/Apis";
import { getUserDetails } from "../../common/utility";
import Avatar from "react-avatar";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";
import Select from "react-select";

const UserProfile = (props) => {
  //meta title
  document.title = "Instaone";

  const userprofileData = createSelector(
    (state) => state.Profile,
    (state) => ({
      error: state.error,
      success: state.success,
    })
  );

  // Inside your component
  const { error, success } = useSelector(userprofileData);
  const [user, setUser] = useState({});
  const [allService, setAllService] = useState([]);

  useEffect(() => {
    getUser();
    getAllService();
  }, []);

  const getUser = async () => {
    try {
      const loginUser = getUserDetails();
      const data = { userId: loginUser?.userId };
      const userDetails = await postAPI("user/get-user", data);
      if (userDetails.statusCode == 200) {
        setUser(userDetails.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Shared onSubmit logic
  const handleRoleBasedSubmit = async (role, values) => {
    if (role === "customer") {
      try {
        const data = {
          userId: user?.userId,
          firstName: values.customerData.firstName,
          lastName: values.customerData.lastName,
          companyName: values.customerData.companyName,
          gstNumber: values.customerData.gstNumber,
          billingAddress: values.billingData,
          shippingAddress: values.shippingData,
        };

        const response = await postAPI("user/update-user", data);
        if (response.statusCode === 200) {
          toast.success(response.message);
          getUser();
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else if (role === "individual") {
      const servicesToSave = values.individualData.selectedServices.map(
        (service) => service.label
      );
      try {
        const data = {
          userId: user?.userId,
          firstName: values.individualData.firstName,
          lastName: values.individualData.lastName,
          address: values.individualData.address,
          servicesProvided: servicesToSave,
        };
        LoaderShow();
        const response = await postAPI("user/update-user", data);
        if (response.statusCode === 200) {
          toast.success(response.message);
          getUser();
          LoaderHide();
        }
      } catch (error) {
        LoaderHide();
        toast.error(error.message);
      }
    } else if (role === "company") {
      const servicesToSave = values.servicesProvided.map(
        (service) => service.label
      );
      try {
        const data = {
          userId: user?.userId,
          companyName: values?.companyName || "",
          servicesProvided: servicesToSave,
        };
        LoaderShow();
        const response = await postAPI("user/update-user", data);
        if (response.statusCode === 200) {
          toast.success(response.message);
          getUser();
          LoaderHide();
        }
      } catch (error) {
        LoaderHide();
        toast.error(error.message);
      }
    }
    LoaderHide();
  };

  // Customer
  const customervalidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      customerData: {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        email: user?.email || "",
        companyName: user?.companyName || "",
        gstNumber: user?.gstNumber || "",
      },
      billingData: {
        street: user?.billingAddress?.street || "",
        city: user?.billingAddress?.city || "",
        state: user?.billingAddress?.state || "",
        pinCode: user?.billingAddress?.pinCode || "",
      },
      shippingData: {
        street: user?.shippingAddress?.street || "",
        city: user?.shippingAddress?.city || "",
        state: user?.shippingAddress?.state || "",
        pinCode: user?.shippingAddress?.pinCode || "",
      },
    },
    validationSchema: Yup.object({
      customerData: Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        phone: Yup.string()
          .required("Mobile Number is required")
          .matches(/^[0-9]{10}$/, "Must be a valid 10-digit mobile number"),
        email: Yup.string()
          .required("Email is required")
          .email("Must be a valid email"),
        companyName: Yup.string().required("Company Name is required"),
        gstNumber: Yup.string().required("GST Number is required"),
      }),
      billingData: Yup.object().shape({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        pinCode: Yup.string()
          .required("PIN Code is required")
          .matches(/^[0-9]{6}$/, "Must be a valid 6-digit PIN code"),
      }),
      shippingData: Yup.object().shape({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        pinCode: Yup.string()
          .required("PIN Code is required")
          .matches(/^[0-9]{6}$/, "Must be a valid 6-digit PIN code"),
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      await handleRoleBasedSubmit("customer", values);
    },
  });

  const getAllService = async () => {
    try {
      const response = await getAPI("service/get-service");
      if (response.statusCode === 200) {
        // const serviceOptions = response.data.map((item) => ({
        //   label: item.serviceName, // label to display in the dropdown
        //   value: item._id, // value associated with the service
        // }));
        setAllService(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatServices = (services) =>
    services.map((service) => ({
      value: service._id,
      label: service.serviceName,
    }));

  // Individual
  const Individualvalidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      individualData: {
        phone: user?.phone || "",
        email: user?.email || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        identityProof: user?.identityProof || "",
        identificationNumber: user?.identificationNumber || "",
        address: user?.address || "",
        selectedServices: formatServices(allService)?.filter((option) =>
          user?.servicesProvided?.includes(option.label)
        ),
      },
      individualBankData: {
        accountHolderName: user?.bankDetails?.accountHolderName || "",
        accountNumber: user?.bankDetails?.accountNumber || "",
        cnfmAccountNumber: user?.bankDetails?.accountNumber || "",
        accountType: user?.bankDetails?.accountType || "",
        bankName: user?.bankDetails?.bankName || "",
        ifscCode: user?.bankDetails?.ifscCode || "",
      },
    },
    validationSchema: Yup.object({
      individualData: Yup.object().shape({
        firstName: Yup.string()
          .required("First Name is required")
          .min(3, "First Name must be at least 3 characters long"),
        lastName: Yup.string()
          .required("Last Name is required")
          .min(3, "Last Name must be at least 3 characters long"),
        address: Yup.string()
          .required("Address is required")
          .min(3, "Address must be at least 3 characters long"),
        selectedServices: Yup.array()
          .min(1, "At least one service must be selected")
          .required("Services are required"),
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      await handleRoleBasedSubmit("individual", values);
    },
  });

  // Company
  const companyValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyName: user?.companyName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      servicesProvided: formatServices(allService)?.filter((option) =>
        user?.servicesProvided?.includes(option.label)
      ),
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values, { resetForm }) => {
      await handleRoleBasedSubmit("company", values);
    },
  });

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (user?.role === "customer") {
      customervalidation.handleSubmit();
    } else if (user?.role === "individual") {
      Individualvalidation.handleSubmit();
    } else if (user?.role === "company") {
      companyValidation.handleSubmit();
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
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="InstaOne" breadcrumbItem="Profile" />

          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="ms-3">
                      <Avatar
                        name="Instaone"
                        size="35"
                        style={{ width: "35px" }}
                        round={true}
                        color="#ED8D21"
                        fgColor="#fff"
                      />
                    </div>
                    <div className="flex-grow-1 d-flex justify-content-between align-items-center ms-3">
                      <div className="text-muted">
                        <p className="mb-0">
                          User ID:
                          <b style={{ marginLeft: "15px" }}>{user?.userId}</b>
                        </p>
                      </div>
                      <div className="text-muted">
                        <p className="mb-0">
                          User Role:
                          <b
                            style={{ marginLeft: "15px", marginRight: "100px" }}
                          >
                            {user?.role?.toUpperCase()}
                          </b>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4 mt-4">Update User Profile Details</h4>

          <Card>
            <CardBody>
              <Form className="form-horizontal" onSubmit={handleSubmit}>
                {user?.role === "customer" && (
                  <div className="row">
                    {/*First Name */}
                    <div className="form-group col-md-6">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="customerData.firstName"
                        onChange={customervalidation.handleChange}
                        onBlur={customervalidation.handleBlur}
                        value={customervalidation.values.customerData.firstName}
                        className="form-control"
                        id="basicpill-firstname-input"
                        placeholder="Enter Your First Name"
                      />
                      {customervalidation.touched.customerData?.firstName &&
                      customervalidation.errors.customerData?.firstName ? (
                        <span style={{ color: "red" }}>
                          {customervalidation.errors.customerData.firstName}
                        </span>
                      ) : null}
                    </div>

                    {/* Last Name */}
                    <div className="form-group col-md-6">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="customerData.lastName"
                        onChange={customervalidation.handleChange}
                        onBlur={customervalidation.handleBlur}
                        value={customervalidation.values.customerData.lastName}
                        className="form-control"
                        id="basicpill-lastName-input"
                        placeholder="Enter Your Last Name"
                      />
                      {customervalidation.touched.customerData?.lastName &&
                      customervalidation.errors.customerData?.lastName ? (
                        <span style={{ color: "red" }}>
                          {customervalidation.errors.customerData.lastName}
                        </span>
                      ) : null}
                    </div>

                    {/* Email */}
                    <div className="form-group col-md-6 mt-4">
                      <label className="form-label">Email</label>
                      <input
                        readOnly
                        type="text"
                        name="customerData.email"
                        onChange={customervalidation.handleChange}
                        onBlur={customervalidation.handleBlur}
                        value={customervalidation.values.customerData.email}
                        className="form-control"
                        id="basicpill-email-input"
                        placeholder="Enter Your Email"
                      />
                      {customervalidation.touched.customerData?.email &&
                      customervalidation.errors.customerData?.email ? (
                        <span style={{ color: "red" }}>
                          {customervalidation.errors.customerData.email}
                        </span>
                      ) : null}
                    </div>

                    {/* Phone Number */}
                    <div className="form-group col-md-6 mt-4">
                      <label className="form-label">Phone Number</label>
                      <input
                        readOnly
                        type="text"
                        name="customerData.phone"
                        onChange={customervalidation.handleChange}
                        onBlur={customervalidation.handleBlur}
                        value={customervalidation.values.customerData.phone}
                        className="form-control"
                        id="basicpill-phone-input"
                        placeholder="Enter Your phone"
                      />
                      {customervalidation.touched.customerData?.phone &&
                      customervalidation.errors.customerData?.phone ? (
                        <span style={{ color: "red" }}>
                          {customervalidation.errors.customerData.phone}
                        </span>
                      ) : null}
                    </div>

                    {/* Company Name */}
                    <div className="form-group col-md-6 mt-4">
                      <label className="form-label">Company Name</label>
                      <input
                        readOnly
                        type="text"
                        name="customerData.companyName"
                        onChange={customervalidation.handleChange}
                        onBlur={customervalidation.handleBlur}
                        value={
                          customervalidation.values.customerData.companyName
                        }
                        className="form-control"
                        id="basicpill-companyName-input"
                        placeholder="Enter Your Company Name"
                      />
                      {customervalidation.touched.customerData?.companyName &&
                      customervalidation.errors.customerData?.companyName ? (
                        <span style={{ color: "red" }}>
                          {customervalidation.errors.customerData.companyName}
                        </span>
                      ) : null}
                    </div>

                    {/* GST Number */}
                    <div className="form-group col-md-6 mt-4">
                      <label className="form-label">GST Number</label>
                      <input
                        readOnly
                        type="text"
                        name="customerData.gstNumber"
                        onChange={customervalidation.handleChange}
                        onBlur={customervalidation.handleBlur}
                        value={customervalidation.values.customerData.gstNumber}
                        className="form-control"
                        id="basicpill-gstNumber-input"
                        placeholder="Enter Your GST Number"
                      />
                      {customervalidation.touched.customerData?.gstNumber &&
                      customervalidation.errors.customerData?.gstNumber ? (
                        <span style={{ color: "red" }}>
                          {customervalidation.errors.customerData.gstNumber}
                        </span>
                      ) : null}
                    </div>

                    {/* Billing Details on the Left */}
                    <div className="col-lg-6 mt-4">
                      <h4>Billing Address</h4>
                      <div className="mb-3">
                        <label htmlFor="billingStreet" className="form-label">
                          Street
                        </label>
                        <input
                          type="text"
                          name="billingData.street"
                          className="form-control"
                          placeholder="Enter Billing Street"
                          onChange={customervalidation.handleChange}
                          onBlur={customervalidation.handleBlur}
                          value={customervalidation.values.billingData.street}
                        />
                        {customervalidation.touched.billingData?.street &&
                        customervalidation.errors.billingData?.street ? (
                          <span style={{ color: "red" }}>
                            {customervalidation.errors.billingData?.street}
                          </span>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="billingStreet" className="form-label">
                          City
                        </label>
                        <input
                          type="text"
                          name="billingData.city"
                          className="form-control"
                          placeholder="Enter Billing city"
                          onChange={customervalidation.handleChange}
                          onBlur={customervalidation.handleBlur}
                          value={customervalidation.values.billingData?.city}
                        />
                        {customervalidation.touched.billingData?.city &&
                        customervalidation.errors.billingData?.city ? (
                          <span style={{ color: "red" }}>
                            {customervalidation.errors.billingData?.city}
                          </span>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="billingStreet" className="form-label">
                          State
                        </label>
                        <input
                          type="text"
                          name="billingData.state"
                          className="form-control"
                          placeholder="Enter Billing Street"
                          onChange={customervalidation.handleChange}
                          onBlur={customervalidation.handleBlur}
                          value={customervalidation.values.billingData?.state}
                        />
                        {customervalidation.touched.billingData?.state &&
                        customervalidation.errors.billingData?.state ? (
                          <span style={{ color: "red" }}>
                            {customervalidation.errors.billingData?.state}
                          </span>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="billingStreet" className="form-label">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          name="billingData.pinCode"
                          className="form-control"
                          placeholder="Enter Billing pinCode"
                          onChange={customervalidation.handleChange}
                          onBlur={customervalidation.handleBlur}
                          value={customervalidation.values.billingData?.pinCode}
                        />
                        {customervalidation.touched.billingData?.pinCode &&
                        customervalidation.errors.billingData?.pinCode ? (
                          <span style={{ color: "red" }}>
                            {customervalidation.errors.billingData?.pinCode}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Shipping Details on the Right */}
                    <div className="col-lg-6 mt-4">
                      <h4>Shipping Address</h4>
                      <div className="mb-3">
                        <label htmlFor="shippingStreet" className="form-label">
                          Street
                        </label>
                        <input
                          type="text"
                          name="shippingData.street"
                          className="form-control"
                          placeholder="Enter Shipping Street"
                          onChange={customervalidation.handleChange}
                          onBlur={customervalidation.handleBlur}
                          value={customervalidation.values.shippingData?.street}
                        />
                        {customervalidation.touched.shippingData?.street &&
                        customervalidation.errors.shippingData?.street ? (
                          <span style={{ color: "red" }}>
                            {customervalidation.errors.shippingData?.street}
                          </span>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="billingStreet" className="form-label">
                          City
                        </label>
                        <input
                          type="text"
                          name="shippingData.city"
                          className="form-control"
                          placeholder="Enter Billing city"
                          onChange={customervalidation.handleChange}
                          onBlur={customervalidation.handleBlur}
                          value={customervalidation.values.shippingData?.city}
                        />
                        {customervalidation.touched.shippingData?.city &&
                        customervalidation.errors.shippingData?.city ? (
                          <span style={{ color: "red" }}>
                            {customervalidation.errors.shippingData?.city}
                          </span>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="billingStreet" className="form-label">
                          State
                        </label>
                        <input
                          type="text"
                          name="shippingData.state"
                          className="form-control"
                          placeholder="Enter Billing Street"
                          onChange={customervalidation.handleChange}
                          onBlur={customervalidation.handleBlur}
                          value={customervalidation.values.shippingData?.state}
                        />
                        {customervalidation.touched.shippingData?.state &&
                        customervalidation.errors.shippingData?.state ? (
                          <span style={{ color: "red" }}>
                            {customervalidation.errors.shippingData?.state}
                          </span>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="billingStreet" className="form-label">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          name="shippingData.pinCode"
                          className="form-control"
                          placeholder="Enter Billing pinCode"
                          onChange={customervalidation.handleChange}
                          onBlur={customervalidation.handleBlur}
                          value={
                            customervalidation.values.shippingData?.pinCode
                          }
                        />
                        {customervalidation.touched.shippingData?.pinCode &&
                        customervalidation.errors.shippingData?.pinCode ? (
                          <span style={{ color: "red" }}>
                            {customervalidation.errors.shippingData?.pinCode}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}

                {user?.role == "individual" && (
                  <>
                    <div className="row">
                      <div className="form-group col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-lastname-input"
                            className="form-label"
                          >
                            Identity Proof
                          </label>
                          <input
                            readOnly
                            type="text"
                            name="individualData.identityProof"
                            onChange={Individualvalidation.handleChange}
                            onBlur={Individualvalidation.handleBlur}
                            value={
                              Individualvalidation.values.individualData
                                .identityProof
                            }
                            className="form-control"
                            id="basicpill-lastname-input"
                          />
                          {Individualvalidation.touched.individualData
                            ?.identityProof &&
                          Individualvalidation?.errors?.individualData
                            ?.identityProof ? (
                            <span style={{ color: "red" }}>
                              {
                                Individualvalidation?.errors?.individualData
                                  ?.identityProof
                              }
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="form-group col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-lastname-input"
                            className="form-label"
                          >
                            Enter Identification Number
                          </label>
                          <input
                            readOnly
                            type="text"
                            name="individualData.identificationNumber"
                            onChange={Individualvalidation.handleChange}
                            onBlur={Individualvalidation.handleBlur}
                            value={
                              Individualvalidation.values.individualData
                                .identificationNumber
                            }
                            className="form-control"
                            id="basicpill-lastname-input"
                          />
                          {Individualvalidation.touched.individualData
                            ?.identificationNumber &&
                          Individualvalidation?.errors?.individualData
                            ?.identificationNumber ? (
                            <span style={{ color: "red" }}>
                              {
                                Individualvalidation?.errors?.individualData
                                  ?.identificationNumber
                              }
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/*First Name */}
                      <div className="form-group col-lg-6">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          name="individualData.firstName"
                          onChange={Individualvalidation.handleChange}
                          onBlur={Individualvalidation.handleBlur}
                          value={
                            Individualvalidation.values.individualData.firstName
                          }
                          className="form-control"
                          id="basicpill-firstname-input"
                        />
                        {Individualvalidation.touched.individualData
                          ?.firstName &&
                        Individualvalidation?.errors?.individualData
                          ?.firstName ? (
                          <span style={{ color: "red" }}>
                            {
                              Individualvalidation?.errors?.individualData
                                ?.firstName
                            }
                          </span>
                        ) : null}
                      </div>

                      {/* Last Name */}
                      <div className="form-group col-lg-6">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          name="individualData.lastName"
                          onChange={Individualvalidation.handleChange}
                          onBlur={Individualvalidation.handleBlur}
                          value={
                            Individualvalidation.values.individualData.lastName
                          }
                          className="form-control"
                          id="basicpill-lastName-input"
                          placeholder="Enter Your Last Name"
                        />
                        {Individualvalidation.touched.individualData
                          ?.lastName &&
                        Individualvalidation.errors.individualData?.lastName ? (
                          <span style={{ color: "red" }}>
                            {
                              Individualvalidation.errors.individualData
                                .lastName
                            }
                          </span>
                        ) : null}
                      </div>

                      {/* Email */}
                      <div className="form-group col-lg-6 mt-2 ">
                        <label className="form-label">Email</label>
                        <input
                          readOnly
                          type="text"
                          name="individualData.email"
                          onChange={Individualvalidation.handleChange}
                          onBlur={Individualvalidation.handleBlur}
                          value={
                            Individualvalidation.values.individualData.email
                          }
                          className="form-control"
                          id="basicpill-email-input"
                          placeholder="Enter Your Email"
                        />
                        {Individualvalidation.touched.individualData?.email &&
                        Individualvalidation.errors.individualData?.email ? (
                          <span style={{ color: "red" }}>
                            {Individualvalidation.errors.individualData.email}
                          </span>
                        ) : null}
                      </div>

                      {/* Phone Number */}
                      <div className="form-group col-lg-6 mt-2">
                        <label className="form-label">Phone Number</label>
                        <input
                          readOnly
                          type="text"
                          name="individualData.phone"
                          onChange={Individualvalidation.handleChange}
                          onBlur={Individualvalidation.handleBlur}
                          value={
                            Individualvalidation.values.individualData.phone
                          }
                          className="form-control"
                          id="basicpill-phone-input"
                          placeholder="Enter Your phone"
                        />
                        {Individualvalidation.touched.individualData?.phone &&
                        Individualvalidation.errors.individualData?.phone ? (
                          <span style={{ color: "red" }}>
                            {Individualvalidation.errors.individualData.phone}
                          </span>
                        ) : null}
                      </div>

                      {/* Address */}
                      <div className="form-group col-md-12 mt-2">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          name="individualData.address"
                          onChange={Individualvalidation.handleChange}
                          onBlur={Individualvalidation.handleBlur}
                          value={
                            Individualvalidation.values.individualData.address
                          }
                          className="form-control"
                          id="basicpill-address-input"
                          placeholder="Enter Your Last Name"
                        />
                        {Individualvalidation.touched.individualData?.address &&
                        Individualvalidation.errors.individualData?.address ? (
                          <span style={{ color: "red" }}>
                            {Individualvalidation.errors.individualData.address}
                          </span>
                        ) : null}
                      </div>

                      {/* Services Field */}
                      <div className="form-group col-md-12 mt-2">
                        <div className="mb-3">
                          <label className="form-label font-size-13 text-muted">
                            Services
                          </label>
                          <Select
                            isMulti
                            name="selectedServices"
                            options={formatServices(allService)}
                            value={
                              Individualvalidation.values.individualData
                                .selectedServices
                            }
                            onChange={(selectedOptions) =>
                              Individualvalidation.setFieldValue(
                                "individualData.selectedServices",
                                selectedOptions
                              )
                            }
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                          {Individualvalidation.touched.individualData
                            ?.selectedServices &&
                          Individualvalidation.errors.individualData
                            ?.selectedServices ? (
                            <span style={{ color: "red" }}>
                              {
                                Individualvalidation.errors.individualData
                                  .selectedServices
                              }
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <h5>Bank Details</h5>

                      {/*Bank Name */}
                      <div className="form-group col-md-6 mt-3">
                        <label className="form-label">Bank Name</label>
                        <input
                          readOnly
                          type="text"
                          name="individualBankData.bankName"
                          onChange={Individualvalidation.handleChange}
                          onBlur={Individualvalidation.handleBlur}
                          value={
                            Individualvalidation.values.individualBankData
                              .bankName
                          }
                          className="form-control"
                        />
                        {Individualvalidation.touched.individualBankData
                          ?.bankName &&
                        Individualvalidation?.errors?.individualBankData
                          ?.bankName ? (
                          <span style={{ color: "red" }}>
                            {
                              Individualvalidation?.errors?.individualBankData
                                ?.bankName
                            }
                          </span>
                        ) : null}
                      </div>

                      {/*Account Holder Name */}
                      <div className="form-group col-md-6 mt-3">
                        <label className="form-label">
                          Account Holder Name
                        </label>
                        <input
                          readOnly
                          type="text"
                          name="individualBankData.accountHolderName"
                          onChange={Individualvalidation.handleChange}
                          onBlur={Individualvalidation.handleBlur}
                          value={
                            Individualvalidation.values.individualBankData
                              .accountHolderName
                          }
                          className="form-control"
                        />
                        {Individualvalidation.touched.individualBankData
                          ?.accountHolderName &&
                        Individualvalidation?.errors?.individualBankData
                          ?.accountHolderName ? (
                          <span style={{ color: "red" }}>
                            {
                              Individualvalidation?.errors?.individualBankData
                                ?.accountHolderName
                            }
                          </span>
                        ) : null}
                      </div>

                      {/* Account Number */}
                      <div className="form-group col-md-6 mt-3">
                        <label className="form-label">Account Number</label>
                        <input
                          readOnly
                          type="text"
                          name="individualBankData.accountNumber"
                          onChange={Individualvalidation.handleChange}
                          onBlur={Individualvalidation.handleBlur}
                          value={
                            Individualvalidation.values.individualBankData
                              .accountNumber
                          }
                          className="form-control"
                        />
                        {Individualvalidation.touched.individualBankData
                          ?.accountNumber &&
                        Individualvalidation?.errors?.individualBankData
                          ?.accountNumber ? (
                          <span style={{ color: "red" }}>
                            {
                              Individualvalidation?.errors?.individualBankData
                                ?.accountNumber
                            }
                          </span>
                        ) : null}
                      </div>

                      {/* IFSC Code */}
                      <div className="form-group col-md-6 mt-3">
                        <label className="form-label">IFSC Code</label>
                        <input
                          readOnly
                          type="text"
                          name="individualBankData.ifscCode"
                          onChange={Individualvalidation.handleChange}
                          onBlur={Individualvalidation.handleBlur}
                          value={
                            Individualvalidation.values.individualBankData
                              .ifscCode
                          }
                          className="form-control"
                        />
                        {Individualvalidation.touched.individualBankData
                          ?.ifscCode &&
                        Individualvalidation?.errors?.individualBankData
                          ?.ifscCode ? (
                          <span style={{ color: "red" }}>
                            {
                              Individualvalidation?.errors?.individualBankData
                                ?.ifscCode
                            }
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </>
                )}

                {user?.role == "company" && (
                  <>
                    <div className="row">
                      {/* Company Name */}
                      <div className="form-group col-lg-6 mt-2 ">
                        <label className="form-label">Company Name</label>
                        <input
                          type="text"
                          name="companyName"
                          onChange={companyValidation.handleChange}
                          onBlur={companyValidation.handleBlur}
                          value={companyValidation.values.companyName}
                          className="form-control"
                          id="basicpill-companyName-input"
                          placeholder="Enter Your Company Name"
                        />
                        {companyValidation.touched.companyName &&
                        companyValidation.errors.companyName ? (
                          <span style={{ color: "red" }}>
                            {companyValidation.errors.companyName}
                          </span>
                        ) : null}
                      </div>

                      {/* Email */}
                      <div className="form-group col-lg-6 mt-2 ">
                        <label className="form-label">Email</label>
                        <input
                          readOnly
                          type="text"
                          name="email"
                          onChange={companyValidation.handleChange}
                          onBlur={companyValidation.handleBlur}
                          value={companyValidation.values.email}
                          className="form-control"
                          id="basicpill-email-input"
                          placeholder="Enter Your Email"
                        />
                        {companyValidation.touched.email &&
                        companyValidation.errors.email ? (
                          <span style={{ color: "red" }}>
                            {companyValidation.errors.email}
                          </span>
                        ) : null}
                      </div>

                      {/* Phone Number */}
                      <div className="form-group col-lg-6 mt-2">
                        <label className="form-label">Phone Number</label>
                        <input
                          readOnly
                          type="text"
                          name="phone"
                          onChange={companyValidation.handleChange}
                          onBlur={companyValidation.handleBlur}
                          value={companyValidation.values.phone}
                          className="form-control"
                          id="basicpill-phone-input"
                          placeholder="Enter Your phone"
                        />
                        {companyValidation.touched?.phone &&
                        companyValidation.errors?.phone ? (
                          <span style={{ color: "red" }}>
                            {companyValidation.errors.phone}
                          </span>
                        ) : null}
                      </div>

                      {/* Services Field */}
                      <div className="form-group col-md-12 mt-2">
                        <div className="mb-3">
                          <label className="form-label font-size-13 text-muted">
                            Services
                          </label>
                          <Select
                            isMulti
                            name="servicesProvided"
                            options={formatServices(allService)}
                            value={companyValidation.values.servicesProvided}
                            onChange={(selectedOptions) =>
                              companyValidation.setFieldValue(
                                "servicesProvided",
                                selectedOptions
                              )
                            }
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                          {companyValidation.touched?.servicesProvided &&
                          companyValidation.errors?.servicesProvided ? (
                            <span style={{ color: "red" }}>
                              {companyValidation.errors.servicesProvided}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Update User Info
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
