import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Alert,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { registerUser, apiError } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

// import images
import logo from "../../assets/images/Instaone.png";

import CarouselPage from "../AuthenticationInner/CarouselPage";
import { createSelector } from "reselect";
import { postAPI } from "../../Services/Apis";
import { toast } from "react-toastify";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";
import loader from "../../assets/images/instaone-loader.svg";

const Register = (props) => {
  const [load, setLoad] = useState(false);

  const [timer, setTimer] = useState(60); // Initial timer value (e.g., 30 seconds)
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const getPhoneNumber = JSON.parse(localStorage?.getItem("registerNumber"));

  //meta title
  document.title = "Register | InstaOne";
  // let verify = false
  useEffect(() => {
    const scriptLoaded = () => {
      const callback = (userinfo) => {
        const emailMap = userinfo.identities.find(
          (item) => item.identityType === "EMAIL"
        );

        const mobileMap = userinfo.identities.find(
          (item) => item.identityType === "MOBILE"
        )?.identityValue;

        const token = userinfo.token;
        const email = emailMap?.identityValue;
        const mobile = mobileMap?.identityValue;
        const name = emailMap?.name || mobileMap?.name;

        console.log("User Info:", userinfo);

        console.log(
          "User verify:",
          userinfo.identities[0].identityValue.slice(-10)
        );

        setLoad(userinfo.identities[0].verified);
        console.log(load);
        // Implement your custom logic here
      };

      // Initialize OTPLESS SDK with the defined callback
      window.OTPlessSignin = new OTPless(callback);
    };

    // Check if the script has loaded
    if (window.OTPless) {
      scriptLoaded();
    } else {
      window.addEventListener("otpless:loaded", scriptLoaded);
    }
  }, []);

  // Handle the timer countdown
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setIsResendDisabled(false); // Enable resend after timer ends
    }

    return () => clearTimeout(countdown); // Cleanup the timeout
  }, [timer]);

  // Simulate OTP sending
  const sendOtp = async () => {
    try {
      LoaderShow();
      setTimer(60); // Reset the timer
      setIsResendDisabled(true); // Disable the resend button
      window.OTPlessSignin.initiate({
        channel: "PHONE",
        phone: getPhoneNumber.phone,
        countryCode: "+91", // Adjust country code as necessary
        expiry: 60,
      });
      LoaderHide();
    } catch (error) {
      LoaderHide();
      toast.error(error.message);
    }
  };

  const verifyOTP = async () => {
    const otpInput = numbervalidation?.values?.otp;
    try {
      const response = await window.OTPlessSignin.verify({
        channel: "PHONE",
        phone: getPhoneNumber.phone,
        otp: otpInput,
        countryCode: "+91",
      });

      if (response.success) {
        toast.success("OTP Verified");
        // Additional logic if needed
      } else if (
        response?.response?.errorMessage == "Request error: OTP expired"
      ) {
        toast.error("OTP Expired");
        navigate("/register-number");
      } else {
        toast.error("Wrong OTP entered");
      }
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  let navigate = useNavigate();

  const numbervalidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .required("OTP is required")
        .matches(/^[0-9]{6}$/, "Must be a valid 6-digit  number"),
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        LoaderShow();
        const otpInput = numbervalidation?.values?.otp;
        const verifyOTP = await window.OTPlessSignin.verify({
          channel: "PHONE",
          phone: getPhoneNumber.phone,
          otp: otpInput,
          countryCode: "+91",
        });

        if (verifyOTP.success) {
          LoaderHide();
          // Additional logic if needed
          const data = {
            verify: verifyOTP.success,
            password: values.password,
            confirmPassword: values.confirmPassword,
          };

          const response = await postAPI("auth/verify-otp-register", data);
          LoaderHide();
          if (response.statusCode === 200) {
            LoaderHide();
            toast.success("Mobile number verified successfully!");
            const registerPassword = {
              password: values.password,
            };
            localStorage.setItem(
              "registerPassword",
              JSON.stringify(registerPassword)
            );

            resetForm();
            navigate("/registration-selection");
          }
        } else if (
          verifyOTP?.response?.errorMessage == "Request error: OTP expired"
        ) {
          LoaderHide();
          toast.error("OTP Expired");
          navigate("/register-number");
        } else if (
          verifyOTP?.response?.errorMessage ==
          "Request error: OTP is already verified"
        ) {
          LoaderHide();
          toast.error("OTP Already Verified");
          navigate("/register-number");
        } else {
          LoaderHide();
          toast.error("Wrong OTP entered");
        }
      } catch (error) {
        LoaderHide();
        toast.error(error.message);
      }
      LoaderHide();
    },
  });
  const [passwordShow, setPasswordShow] = useState(false);
  const [cnfpasswordShow, setCnfPasswordShow] = useState(false);

  const Formhandle = (e) => {
    e.preventDefault();
    numbervalidation.handleSubmit();
  };

  return (
    <React.Fragment>
      <div className="auth-page">
        <Container fluid className="p-0">
          <div
            id="hideloding"
            className="loding-display"
            style={{ display: "none" }}
          >
            <img src={loader} alt="loader-img" />
          </div>
          <Row className="g-0">
            <Col lg={4} md={5} className="col-xxl-4">
              <div className="auth-full-page-content d-flex p-sm-5 p-3">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-2 mb-md-3 text-center">
                      <Link to="/" className="d-block auth-logo">
                        <img src={logo} alt="" height={55} width={150} />
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h5 className="mb-0">Register Account</h5>
                        <p className="text-muted mt-2">
                          Get your free InstaOne account now.
                        </p>
                      </div>
                      <div
                        className="alert alert-success text-left my-3 mb-2"
                        role="alert"
                      >
                        Enter OTP sent to your Mobile Number
                      </div>
                      <form
                        className="needs-validation custom-form mt-4 pt-2"
                        onSubmit={Formhandle}
                      >
                        {/* <div className="mb-3">
                          <Label className="form-label"> OTP</Label>
                          <Input
                            id="email"
                            name="otp"
                            className="form-control"
                            placeholder="Enter OTP"
                            type="number"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.otp || ""}
                            invalid={
                              validation.touched.otp && validation.errors.otp ? true : false
                            }
                          />
                          {validation.touched.otp && validation.errors.otp ? (
                            <FormFeedback type="invalid">{validation.errors.otp}</FormFeedback>
                          ) : null}
                        </div> */}

                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-otp-input"
                            className="form-label"
                          >
                            OTP
                          </label>
                          <input
                            type="text"
                            name="otp"
                            onChange={numbervalidation.handleChange}
                            onBlur={numbervalidation.handleBlur}
                            value={numbervalidation.values.otp}
                            className="form-control"
                            id="basicpill-otp-input"
                            placeholder="Enter OTP"
                            disabled={load}
                          />
                          {numbervalidation.touched.otp &&
                          numbervalidation?.errors?.otp ? (
                            <span style={{ color: "red" }}>
                              {numbervalidation?.errors?.otp}
                            </span>
                          ) : null}
                          {/* <div
                            onClick={verifyOTP}
                            style={{ textAlign: "right", cursor: "pointer" }}
                          >
                            {load ? (
                              <span style={{ color: "green" }}>Verified</span>
                            ) : (
                              <span style={{ color: "Blue" }}>Verify</span>
                            )}
                          </div> */}
                          <div className="mt-2 text-left">
                            {isResendDisabled ? (
                              <div>
                                {/* Didn't receive an OTP ?{" "} */}
                                <span
                                  className="text-primary fw-semibold"
                                  disabled
                                >
                                  {" "}
                                  Resend
                                </span>{" "}
                                <span>OTP in {timer} seconds</span>
                              </div>
                            ) : (
                              <div>
                                <span>Didn't receive OTP ?</span>{" "}
                                <span
                                  onClick={sendOtp}
                                  className="text-primary fw-semibold"
                                  style={{ cursor: "pointer" }}
                                >
                                  Resend
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-password-input"
                            className="form-label"
                          >
                            Password
                          </label>
                          <div className="input-group auth-pass-inputgroup">
                            <input
                              type={passwordShow ? "text" : "password"}
                              name="password"
                              onChange={numbervalidation.handleChange}
                              onBlur={numbervalidation.handleBlur}
                              value={numbervalidation.values.password}
                              className="form-control"
                              id="basicpill-password-input"
                              placeholder="Enter Password"
                            />
                            <button
                              onClick={() => setPasswordShow(!passwordShow)}
                              className="btn btn-light shadow-none ms-0"
                              type="button"
                              id="password-addon"
                            >
                              <i className="mdi mdi-eye-outline"></i>
                            </button>
                          </div>

                          {numbervalidation.touched.password &&
                          numbervalidation?.errors?.password ? (
                            <span style={{ color: "red" }}>
                              {numbervalidation?.errors?.password}
                            </span>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-confirmPassword-input"
                            className="form-label"
                          >
                            Confirm Password
                          </label>
                          <div className="input-group auth-pass-inputgroup">
                            <input
                              type={cnfpasswordShow ? "text" : "password"}
                              name="confirmPassword"
                              onChange={numbervalidation.handleChange}
                              onBlur={numbervalidation.handleBlur}
                              value={numbervalidation.values.confirmPassword}
                              className="form-control"
                              id="basicpill-confirmPassword-input"
                              placeholder="Enter confirm Password"
                            />
                            <button
                              onClick={() =>
                                setCnfPasswordShow(!cnfpasswordShow)
                              }
                              className="btn btn-light shadow-none ms-0"
                              type="button"
                              id="password-addon"
                            >
                              <i className="mdi mdi-eye-outline"></i>
                            </button>
                          </div>

                          {numbervalidation.touched.confirmPassword &&
                          numbervalidation?.errors?.confirmPassword ? (
                            <span style={{ color: "red" }}>
                              {numbervalidation?.errors?.confirmPassword}
                            </span>
                          ) : null}
                        </div>

                        {/* <div className="mb-3">
                          <Label className="form-label">Password</Label>
                          <Input
                            name="password"
                            type="text"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.username || ""}
                            invalid={
                              validation.touched.password && validation.errors.password ? true : false
                            }
                          />
                          {validation.touched.password && validation.errors.password ? (
                            <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label className="form-label">Confirm Password</Label>
                          <Input
                            name="cnfpassword"
                            type="password"
                            placeholder="Confirm Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.cnfpassword || ""}
                            invalid={
                              validation.touched.cnfpassword && validation.errors.cnfpassword ? true : false
                            }
                          />
                          {validation.touched.cnfpassword && validationFt&.errors.cnfpassword ? (
                            <FormFeedback type="invalid">{validation.errors.cnfpassword}</FormFeedback>
                          ) : null}
                        </div> */}

                        <div className="mb-3">
                          <p className="mb-0">
                            By registering you agree to the InstaOne{" "}
                            <Link to="#" className="text-primary">
                              Terms of Use
                            </Link>
                          </p>
                        </div>
                        <div className="mb-3">
                          <button
                            className="btn btn-primary w-100 waves-effect waves-light"
                            type="submit"
                          >
                            Register
                          </button>
                        </div>
                      </form>

                      <div className="mt-1 text-center">
                        <p className="text-muted mb-0">
                          Already have an account ?{" "}
                          <Link
                            to="/login"
                            className="text-primary fw-semibold"
                          >
                            {" "}
                            Login{" "}
                          </Link>{" "}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">
                        © {new Date().getFullYear()} InstaOne . Powered By
                        Nexapp Technologies Pvt Ltd.
                        {/* <span style={{ color: '#ed8d21' }} >T&C</span> */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <CarouselPage />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Register;
