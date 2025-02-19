import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import loader from "../../assets/images/instaone-loader.svg";
import {
  Row,
  Col,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap";
//redux
// import { useSelector, useDispatch } from "react-redux"

import withRouter from "../../components/Common/withRouter";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
// import { loginUser, socialLogin } from "../../store/actions"

// import images
import logo from "../../assets/images/Instaone.png";
//Import config
import config from "../../config";
import CarouselPage from "../AuthenticationInner/CarouselPage";
import { toast } from "react-toastify";
import { postAPI } from "../../Services/Apis";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";
// import { createSelector } from "reselect";

const Login = (props) => {
  let navigate = useNavigate();
  localStorage.removeItem("authUser");
  localStorage.removeItem("loginMobile");
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  });
  // console.log(loginData)

  const loginValueChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

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
        console.log("User verify:", userinfo.identities[0].verified);
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

  const phoneAuth = () => {
    const mobileInput = validation?.values?.loginData.phone;
    const loginMobile = {
      mobile: mobileInput,
    };
    localStorage.setItem("loginMobile", JSON.stringify(loginMobile));
    console.log(mobileInput);
    window.OTPlessSignin.initiate({
      channel: "PHONE",
      phone: mobileInput,
      countryCode: "+91", // Adjust country code as necessary
      expiry: 60,
    });
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      loginData,
    },
    validationSchema: Yup.object({
      loginData: Yup.object().shape({
        phone: Yup.string()
          .required("Mobile number is required")
          .matches(
            /^[6-9][0-9]{9}$/,
            "Mobile Number must start with 6-9 and be 10 digits"
          )
          .length(10, "Mobile Number must be exactly 10 digits"),
        password: Yup.string().required("Please Enter Your Password"),
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        LoaderShow();
        const data = {
          phone: values.loginData.phone,
          password: values.loginData.password,
        };
        const response = await postAPI("auth/user-login-password", data);

        if (response.statusCode === 200) {
          const authUser = {
            role: response.userDetails.role,
            tokenNumber: response.tokenData,
            userId: response.userDetails.user.userId,
          };
          localStorage.setItem("authUser", JSON.stringify(authUser));

          toast.success(response.message);

          if (response.userDetails.role == "customer") {
            navigate("/customer/dashboard");
            window.location.reload(true);
          } else if (response.userDetails.role == "individual") {
            navigate("/individual/dashboard");
            window.location.reload(true);
          } else if (response.userDetails.role == "company") {
            navigate("/company/dashboard");
            window.location.reload(true);
          } else if (response.userDetails.role == "isp") {
            navigate("/isp/dashboard");
            window.location.reload(true);
          } else if (response.userDetails.role == "account") {
            navigate("/account/dashboard");
            window.location.reload(true);
          } else {
            navigate("/admin/dashboard");
            window.location.reload(true);
          }
          LoaderHide();
        }
      } catch (error) {
        LoaderHide();
        toast.error(error.message);
      }
    },
  });

  const OTPfetch = async () => {
    if (!loginData?.phone) {
      return toast.error("Please Enter Mobile Number");
    }
    try {
      LoaderShow();
      const data = {
        phone: loginData?.phone,
      };
      const response = await postAPI("auth/send-login-otp", data);
      if (response.statusCode === 200) {
        phoneAuth();
        toast.success(response.message);

        navigate("/page-two-step-verification");
        LoaderHide();
      }
    } catch (error) {
      LoaderHide();
      toast.error(error.message);
    }
  };
  const [passwordShow, setPasswordShow] = useState(false);
  const Formhandle = (e) => {
    e.preventDefault();
    validation.handleSubmit();
  };

  document.title = "Login | InstaOne ";

  return (
    <React.Fragment>
      <div className="auth-page">
        <div
          id="hideloding"
          className="loding-display"
          style={{ display: "none" }}
        >
          <img src={loader} alt="loader-img" />
        </div>
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4} md={5} className="col-xxl-4">
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5 text-center">
                      <Link to="/" className="d-block auth-logo">
                        <img src={logo} alt="" height={55} width={150} />
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h5 className="mb-0">Welcome Back !</h5>
                        <p className="text-muted mt-2">
                          Sign in to continue to InstaOne.
                        </p>
                      </div>
                      <form
                        className="custom-form mt-4 pt-2"
                        onSubmit={Formhandle}
                      >
                        <div className="mb-3">
                          <Label className="form-label">Mobile No.</Label>
                          <Input
                            className="form-control"
                            placeholder="Enter Mobile No."
                            type="number"
                            name="phone"
                            onChange={loginValueChange}
                            value={loginData.phone}
                          />
                          {validation.touched.loginData?.phone &&
                          validation?.errors?.loginData?.phone ? (
                            <div style={{ color: "red" }}>
                              {validation?.errors?.loginData?.phone}
                            </div>
                          ) : null}
                        </div>

                        <div className=" mb-3 text-left">
                          <p
                            onClick={OTPfetch}
                            className=" mb-0 text-primary fw-semibold"
                            style={{ color: "#ed8d21", cursor: "pointer" }}
                          >
                            Login Via OTP{" "}
                          </p>
                        </div>

                        {/* <div className="mb-3">
                          <Label className="form-label">Password</Label>
                          <Input
                            className="form-control"
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            onChange={loginValueChange}
                            value={loginData.password}
                          />
                          {validation.touched.loginData?.password &&
                            validation?.errors?.loginData?.password ? (
                            <div style={{ color: "red" }}>
                              {validation?.errors?.loginData?.password}
                            </div>
                          ) : null}
                        </div>

                        <div className="text-end">
                          <Link to="/forgot-password" className="text-muted">
                            Forgot password?
                          </Link>
                        </div> */}

                        {/* ----------------- */}

                        <div className="mb-3">
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <Label className="form-label">Password</Label>
                            </div>
                          </div>

                          <div className="input-group auth-pass-inputgroup">
                            <Input
                              className="form-control"
                              type={passwordShow ? "text" : "password"}
                              placeholder="Enter Password"
                              name="password"
                              onChange={loginValueChange}
                              value={loginData.password}
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
                          {validation.touched.loginData?.password &&
                          validation?.errors?.loginData?.password ? (
                            <div style={{ color: "red" }}>
                              {validation?.errors?.loginData?.password}
                            </div>
                          ) : null}
                          <div className="text-end mt-2">
                            <Link to="/forgot-password" className="text-muted">
                              Forgot password?
                            </Link>
                          </div>
                        </div>

                        {/* --------------- */}

                        <div className="row mb-4">
                          <div className="col">
                            {/* <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="remember-check"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="remember-check"
                              >
                                Remember me
                              </label>
                            </div> */}

                            <div className="mt-3 d-grid">
                              <button
                                className="btn btn-primary btn-block"
                                type="submit"
                              >
                                Log In
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>

                      <div className="mt-5 text-center">
                        <p className="text-muted mb-0">
                          Don't have an account ?{" "}
                          <Link
                            to="/register-number"
                            className="text-primary fw-semibold"
                          >
                            {" "}
                            Signup now{" "}
                          </Link>{" "}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">
                        © {new Date().getFullYear()} InstaOne . Powered By
                        Nexapp Technologies Pvt Ltd.{" "}
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

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
