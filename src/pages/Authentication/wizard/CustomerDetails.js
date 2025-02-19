import React, { useState } from "react";
import {
  CardBody,
  Form,
  NavItem,
  TabContent,
  TabPane,
  NavLink,
  UncontrolledTooltip,
  Card,
  CardHeader,
} from "reactstrap";
import Select from "react-select";
import classnames from "classnames";
import { Link, useNavigate } from "react-router-dom";
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { postAPI } from "../../../Services/Apis";

import { toast } from "react-toastify";

const CustomerDetails = () => {
  const [activeTab, setactiveTab] = useState(1);
  const getPhoneNumber = JSON.parse(localStorage?.getItem("registerNumber"));
  const getpassword = JSON.parse(localStorage?.getItem("registerPassword"));

  const [customerData, setCustomerData] = useState({
    phone: getPhoneNumber.phone,
    password: getpassword.password,
    email: "",
    firstName: "",
    lastName: "",
  });
  const customerValueChange = (e) =>
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });

  const [customerGstData, setCustomerGstData] = useState({
    companyName: "",
    gstNumber: "",
  });
  const customerGstValueChange = (e) =>
    setCustomerGstData({ ...customerGstData, [e.target.name]: e.target.value });

  const [billingData, setBillingData] = useState({
    street: "",
    city: "",
    state: "",
    Country: "",
    pinCode: "",
  });
  const billingValueChange = (e) =>
    setBillingData({ ...billingData, [e.target.name]: e.target.value });

  const [shippingData, setShippingData] = useState({
    street: "",
    city: "",
    state: "",
    Country: "",
    pinCode: "",
  });
  const shippingValueChange = (e) =>
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });

  let navigate = useNavigate();
  const reDirect = () => {
    navigate("/login");
  };
  const customervalidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      user: "customer",
      role: "customer",
      shippingData,
      billingData,
      customerGstData,
      customerData,
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

        // .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Must be a valid GST number")
      }),
      customerGstData: Yup.object().shape({
        companyName: Yup.string().required("Company Name is required"),
        gstNumber: Yup.string().required("GST Number is required"),

        // .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Must be a valid GST number")
      }),
      billingData: Yup.object().shape({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        Country: Yup.string().required("Country is required"),
        pinCode: Yup.string()
          .required("PIN Code is required")
          .matches(/^[0-9]{6}$/, "Must be a valid 6-digit PIN code"),
      }),
      shippingData: Yup.object().shape({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        Country: Yup.string().required("Country is required"),
        pinCode: Yup.string()
          .required("PIN Code is required")
          .matches(/^[0-9]{6}$/, "Must be a valid 6-digit PIN code"),
      }),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("values===", values);

        const data = {
          role: values.role,
          password: values.customerData.password,
          firstName: values.customerData.firstName,
          lastName: values.customerData.lastName,
          email: values.customerData.email,
          phone: values.customerData.phone,
          companyName: values.customerGstData.companyName,
          gstNumber: values.customerGstData.gstNumber,
          billingAddress: values.billingData,
          shippingAddress: values.shippingData,
        };

        const response = await postAPI("auth/register-customer", data);
        if (response.statusCode === 200) {
          toast.success(response.message);
          resetForm();
          localStorage.removeItem("registerNumber");
          localStorage.removeItem("registerPassword");
          navigate("/login");
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  const validationSchemas = {
    1: Yup.object().shape({
      customerData: Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        phone: Yup.string()
          .required("Mobile Number is required")
          .matches(/^[0-9]{10}$/, "Must be a valid 10-digit mobile number"),
        email: Yup.string()
          .required("Email is required")
          .email("Must be a valid email"),

        // .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Must be a valid GST number")
      }),
    }),
    2: Yup.object().shape({
      customerGstData: Yup.object().shape({
        companyName: Yup.string().required("Company Name is required"),
        gstNumber: Yup.string()
          .required("GST Number is required")
          .matches(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Must be a valid GST number"
          ),
      }),
    }),
  };

  const validateTab = async (tab) => {
    const schema = validationSchemas[tab];
    if (schema) {
      try {
        await schema.validate(customervalidation.values, { abortEarly: false });
        return true;
      } catch (error) {
        error.inner.forEach((err) => {
          customervalidation.setFieldError(err.path, err.message);
        });
        return false;
      }
    }
    return true;
  };

  const toggleTab = async (tab) => {
    if (tab < 1 || tab > 3) return;
    if (tab > activeTab) {
      const isValid = await validateTab(activeTab);
      if (!isValid) return;
    }
    setactiveTab(tab);
  };

  // Multiple GST

  const Formhandle = (e) => {
    e.preventDefault();
    customervalidation.handleSubmit();
  };
  const handleNext = () => {
    companyvalidation.validateForm(customerData).then(
      (errors) => {
        if (Object.keys(errors).length > 0) {
          alert("Please fill in all required fields before proceeding.");
        } else {
          // Proceed to the next form field logic
          // goToNextStep(); // Function to navigate to the next form
          console.log("haldle nesx=============");
          toggleTab(activeTab + 1);
        }
      },
      (err) => {
        console.error("Validation error:", err);
        alert("Validation failed.");
      }
    );
  };
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const isBillingComplete =
    billingData.street.trim() !== "" &&
    billingData.city.trim() !== "" &&
    billingData.state.trim() !== "" &&
    billingData.Country.trim() !== "" &&
    billingData.pinCode.trim() !== "";

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsBilling(isChecked);

    if (isChecked) {
      setShippingData({ ...billingData });
    } else {
      setShippingData({
        street: "",
        city: "",
        state: "",
        Country: "",
        pinCode: "",
      });
    }
  };

  return (
    <React.Fragment>
      <Card className="registration-card">
        <CardHeader>
          <h4 className="card-title mb-0"> Customer Registration</h4>
        </CardHeader>
        <CardBody>
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
                    <UncontrolledTooltip
                      placement="top"
                      target="ProfileDetails"
                    >
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
                    <UncontrolledTooltip
                      placement="top"
                      target="ContactDetails"
                    >
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
                    <i className="bx bxs-bank"></i>
                    <UncontrolledTooltip
                      placement="top"
                      target="AddressDetails"
                    >
                      Address Details
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
                {/* {(customervalidation.errors.customerData || customervalidation.errors.billingData || customervalidation.errors.shippingData) && (
                                    <div style={{ textAlign: 'center', color: 'red', fontSize: '18px', margin: '20px' }}>Please Fill all Details</div>)} */}

                {/* Profile Details */}
                <TabPane tabId={1}>
                  <div className="text-center mb-4">
                    <h5>Profile Details</h5>
                    <p className="card-title-desc">
                      Fill all information below
                    </p>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="basicpill-firstname-input"
                          className="form-label"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          onChange={customerValueChange}
                          value={customerData.firstName}
                          className="form-control"
                          id="basicpill-firstname-input"
                          placeholder="Enter Your First Name"
                        />
                        {customervalidation?.errors?.customerData?.firstName ? (
                          <span style={{ color: "red" }}>
                            {
                              customervalidation?.errors?.customerData
                                ?.firstName
                            }
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="basicpill-lastname-input"
                          className="form-label"
                        >
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          onChange={customerValueChange}
                          value={customerData.lastName}
                          className="form-control"
                          id="basicpill-lastName-input"
                          placeholder="Enter Your Last Name"
                        />
                        {customervalidation?.errors?.customerData?.lastName ? (
                          <span style={{ color: "red" }}>
                            {customervalidation?.errors?.customerData?.lastName}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="basicpill-phoneno-input"
                          className="form-label"
                        >
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          readOnly
                          onChange={customerValueChange}
                          value={customerData.phone}
                          className="form-control"
                          id="basicpill-phoneno-input"
                          placeholder="Enter Your Phone No"
                        />
                        {customervalidation?.errors?.customerData?.phone ? (
                          <span style={{ color: "red" }}>
                            {customervalidation?.errors?.customerData?.phone}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="basicpill-email-input"
                          className="form-label"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          onChange={customerValueChange}
                          value={customerData.email}
                          className="form-control"
                          id="basicpill-email-input"
                          placeholder="Enter Your Email"
                        />
                        {customervalidation?.errors?.customerData?.email ? (
                          <span style={{ color: "red" }}>
                            {customervalidation?.errors?.customerData?.email}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </TabPane>

                {/* Company Details */}
                <TabPane tabId={2}>
                  <div>
                    <div className="text-center mb-4">
                      <h5>Contact information</h5>
                      <p className="card-title-desc">
                        Fill company Contact information below
                      </p>
                    </div>

                    <form>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-companyName-input"
                              className="form-label"
                            >
                              Company Name
                            </label>
                            <input
                              type="text"
                              name="companyName"
                              onChange={customerGstValueChange}
                              value={customerGstData.companyName}
                              className="form-control"
                              id="basicpill-companyName-input"
                              placeholder="Enter Your Company Name "
                            />
                            {customervalidation?.errors?.customerGstData
                              ?.companyName ? (
                              <span style={{ color: "red" }}>
                                {
                                  customervalidation?.errors?.customerGstData
                                    ?.companyName
                                }
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-gstNumber-input"
                              className="form-label"
                            >
                              GST Number
                            </label>
                            <input
                              type="text"
                              name="gstNumber"
                              onChange={customerGstValueChange}
                              value={customerGstData.gstNumber}
                              className="form-control"
                              id="basicpill-gstNumber-input"
                              placeholder="Enter GST Number"
                            />
                            {customervalidation?.errors?.customerGstData
                              ?.gstNumber ? (
                              <span style={{ color: "red" }}>
                                {
                                  customervalidation?.errors?.customerGstData
                                    ?.gstNumber
                                }
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </TabPane>

                {/* Address Details */}
                <TabPane tabId={3}>
                  <div>
                    <div className="text-center mb-4">
                      <h5>Address Details</h5>
                      <p className="card-title-desc">
                        Fill all information below
                      </p>
                    </div>
                    <form>
                      <div className="mb-3">
                        <input
                          type="checkbox"
                          id="sameAsBilling"
                          checked={sameAsBilling}
                          onChange={handleCheckboxChange}
                          disabled={!isBillingComplete}
                        />
                        <label
                          htmlFor="sameAsBilling"
                          className="form-label ms-2"
                        >
                          Shipping address same as Billing address
                        </label>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <h5 className="mb-3">Billing Address</h5>
                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-Billingstreet-input"
                              className="form-label"
                            >
                              Street
                            </label>
                            <input
                              type="text"
                              name="street"
                              onChange={billingValueChange}
                              value={billingData.street}
                              className="form-control"
                              id="basicpill-Billingstreet-input"
                            />
                            {customervalidation?.errors?.billingData?.street ? (
                              <span style={{ color: "red" }}>
                                {
                                  customervalidation?.errors?.billingData
                                    ?.street
                                }
                              </span>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-Billingcity-input"
                              className="form-label"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              onChange={billingValueChange}
                              value={billingData.city}
                              className="form-control"
                              id="basicpill-Billingcity-input"
                            />
                            {customervalidation?.errors?.billingData?.city ? (
                              <span style={{ color: "red" }}>
                                {customervalidation?.errors?.billingData?.city}
                              </span>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-Billingstate-input"
                              className="form-label"
                            >
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              onChange={billingValueChange}
                              value={billingData.state}
                              className="form-control"
                              id="basicpill-Billingstate-input"
                            />
                            {customervalidation?.errors?.billingData?.state ? (
                              <span style={{ color: "red" }}>
                                {customervalidation?.errors?.billingData?.state}
                              </span>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-Billingcountry-input"
                              className="form-label"
                            >
                              Country
                            </label>
                            <input
                              type="text"
                              name="Country"
                              onChange={billingValueChange}
                              value={billingData.Country}
                              className="form-control"
                              id="basicpill-Billingcountry-input"
                            />
                            {customervalidation?.errors?.billingData
                              ?.Country ? (
                              <span style={{ color: "red" }}>
                                {
                                  customervalidation?.errors?.billingData
                                    ?.Country
                                }
                              </span>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-Billingpincode-input"
                              className="form-label"
                            >
                              PIN Code
                            </label>
                            <input
                              type="text"
                              name="pinCode"
                              onChange={billingValueChange}
                              value={billingData.pinCode}
                              className="form-control"
                              id="basicpill-Billingpincode-input"
                            />
                            {customervalidation?.errors?.billingData
                              ?.pinCode ? (
                              <span style={{ color: "red" }}>
                                {
                                  customervalidation?.errors?.billingData
                                    ?.pinCode
                                }
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <h5 className="mb-3">Shipping Address</h5>
                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-Shippingstreet-input"
                              className="form-label"
                            >
                              Street
                            </label>
                            <input
                              type="text"
                              name="street"
                              onChange={shippingValueChange}
                              value={shippingData.street}
                              className="form-control"
                              id="basicpill-Shippingstreet-input"
                              disabled={sameAsBilling} // Disable field if checkbox is checked
                            />
                            {customervalidation?.errors?.shippingData
                              ?.street ? (
                              <span style={{ color: "red" }}>
                                {
                                  customervalidation?.errors?.shippingData
                                    ?.street
                                }
                              </span>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-Shippingcity-input"
                              className="form-label"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              onChange={shippingValueChange}
                              value={shippingData.city}
                              className="form-control"
                              id="basicpill-Shippingcity-input"
                              disabled={sameAsBilling} // Disable field if checkbox is checked
                            />
                            {customervalidation?.errors?.shippingData?.city ? (
                              <span style={{ color: "red" }}>
                                {customervalidation?.errors?.shippingData?.city}
                              </span>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-Shippingstate-input"
                              className="form-label"
                            >
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              onChange={shippingValueChange}
                              value={shippingData.state}
                              className="form-control"
                              disabled={sameAsBilling} // Disable field if checkbox is checked
                              id="basicpill-Shippingstate-input"
                            />
                            {customervalidation?.errors?.shippingData?.state ? (
                              <span style={{ color: "red" }}>
                                {
                                  customervalidation?.errors?.shippingData
                                    ?.state
                                }
                              </span>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-Shippingcountry-input"
                              className="form-label"
                            >
                              Country
                            </label>
                            <input
                              type="text"
                              name="Country"
                              onChange={shippingValueChange}
                              value={shippingData.Country}
                              className="form-control"
                              disabled={sameAsBilling} // Disable field if checkbox is checked
                              id="basicpill-Shippingcountry-input"
                            />
                            {customervalidation?.errors?.shippingData
                              ?.Country ? (
                              <span style={{ color: "red" }}>
                                {
                                  customervalidation?.errors?.shippingData
                                    ?.Country
                                }
                              </span>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-Shippingpincode-input"
                              className="form-label"
                            >
                              PIN Code
                            </label>
                            <input
                              type="text"
                              name="pinCode"
                              onChange={shippingValueChange}
                              value={shippingData.pinCode}
                              disabled={sameAsBilling} // Disable field if checkbox is checked
                              className="form-control"
                              id="basicpill-Shippingpincode-input"
                            />
                            {customervalidation?.errors?.shippingData
                              ?.pinCode ? (
                              <span style={{ color: "red" }}>
                                {
                                  customervalidation?.errors?.shippingData
                                    ?.pinCode
                                }
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </TabPane>
              </TabContent>

              {/* Next Previous */}
              <ul className="pager wizard twitter-bs-wizard-pager-link">
                <li
                  className={activeTab === 1 ? "previous disabled" : "previous"}
                >
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

                {activeTab > 2 ? (
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
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default CustomerDetails;
