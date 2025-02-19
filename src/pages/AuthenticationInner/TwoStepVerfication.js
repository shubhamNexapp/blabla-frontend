import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Form, Label, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";

//Verification code package
import AuthCode from "react-auth-code-input";

//import images
import logo from "../../assets/images/Instaone.png";
import CarouselPage from "./CarouselPage";
import { postAPI } from "../../Services/Apis";
import { toast } from "react-toastify";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";
import loader from "../../assets/images/instaone-loader.svg";

const TwoStepVerfication = () => {
  //meta title
  document.title = "Two Step Verification";
  let navigate = useNavigate();
  const digit1Ref = useRef(null);
  const digit2Ref = useRef(null);
  const digit3Ref = useRef(null);
  const digit4Ref = useRef(null);
  const digit5Ref = useRef(null);
  const digit6Ref = useRef(null);

  const [load, setLoad] = useState(false);
  const [timer, setTimer] = useState(60); // Initial timer value (e.g., 30 seconds)
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const getPhoneNumber = JSON.parse(localStorage?.getItem("loginMobile"));

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

  function moveToNext(index, event) {
    const target = event.target;
    if (target.value.length === 1) {
      switch (index) {
        case 1:
          digit2Ref.current?.focus();
          break;
        case 2:
          digit3Ref.current?.focus();
          break;
        case 3:
          digit4Ref.current?.focus();
          break;
        case 4:
          digit5Ref.current?.focus();
          break;
        case 5:
          digit6Ref.current?.focus();
          break;
        case 6:
          digit6Ref.current?.blur();
          break;
        default:
          break;
      }
    }
  }

  function getCombinedValue() {
    const digit1 = digit1Ref.current.value;
    const digit2 = digit2Ref.current.value;
    const digit3 = digit3Ref.current.value;
    const digit4 = digit4Ref.current.value;
    const digit5 = digit5Ref.current.value;
    const digit6 = digit6Ref.current.value;

    const otp = digit1 + digit2 + digit3 + digit4 + digit5 + digit6;
    return otp;
  }

  useEffect(() => {
    const scriptLoaded = () => {
      const callback = (userinfo) => {
        // const emailMap = userinfo.identities.find(
        //   (item) => item.identityType === "EMAIL"
        // );

        // const mobileMap = userinfo.identities.find(
        //   (item) => item.identityType === "MOBILE"
        // )?.identityValue;

        // const token = userinfo.token;
        // const email = emailMap?.identityValue;
        // const mobile = mobileMap?.identityValue;
        // const name = emailMap?.name || mobileMap?.name;

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

  // Simulate OTP sending
  const sendOtp = async () => {
    try {
      LoaderShow();
      setTimer(60); // Reset the timer
      setIsResendDisabled(true); // Disable the resend button
      window.OTPlessSignin.initiate({
        channel: "PHONE",
        phone: getPhoneNumber.mobile,
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
    const otpInput = getCombinedValue();
    if (otpInput.length === 6) {
      try {
        LoaderShow();
        const response = await window.OTPlessSignin.verify({
          channel: "PHONE",
          phone: getPhoneNumber.mobile,
          otp: otpInput,
          countryCode: "+91",
        });
        console.log(response);

        if (response.success) {
          LoaderHide();
          setLoad(true);
          OTPfetch();

          // toast.success("OTP Verified");
        } else if (
          response?.response?.errorMessage == "Request error: OTP expired"
        ) {
          toast.error("OTP Expired");
          navigate("/login");
          LoaderHide();
        } else {
          toast.error("Wrong OTP entered");
          LoaderHide();
        }
      } catch (err) {
        console.error("Verification failed:", err);
        LoaderHide();
      }
    } else {
      toast.error("Please enter verification code");
    }
  };

  const OTPfetch = async () => {
    try {
      LoaderShow();
      const data = {
        verify: true,
      };

      const response = await postAPI("auth/verify-login-otp", data);

      if (response.statusCode === 200) {
        LoaderHide();
        console.log(response);
        // toast.success(response.message);
        const authUser = {
          role: response.user.role,
          tokenNumber: response.tokenData,
          userId: response.user.userId,
        };
        localStorage.setItem("authUser", JSON.stringify(authUser));

        toast.success(response.message);

        if (response.user.role == "customer") {
          LoaderHide();
          navigate("/customer/dashboard");
          window.location.reload(true);
        } else if (response.user.role == "individual") {
          LoaderHide();
          navigate("/individual/dashboard");
          window.location.reload(true);
        } else if (response.user.role == "admin") {
          LoaderHide();
          navigate("/admin/dashboard");
          window.location.reload(true);
        } else {
          LoaderHide();
          navigate("/company/dashboard");
          window.location.reload(true);
        }
      }
    } catch (error) {
      LoaderHide();
      toast.error(error.message);
    }
  };

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
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={logo} alt="" height={55} width={150} />
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <div className="avatar-lg mx-auto">
                          <div className="avatar-title rounded-circle bg-light">
                            <i className="bx bxs-envelope h2 mb-0 text-primary"></i>
                          </div>
                        </div>
                        <div className="p-2 mt-4">
                          <h4>Verify your Mobile No.</h4>
                          <p className="mb-5">
                            Please enter the 6 digit code sent to{" "}
                            <span className="fw-bold"></span>
                          </p>

                          <form>
                            <Row>
                              <Col>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="digit1-input"
                                    className="visually-hidden"
                                  >
                                    1
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control form-control-lg text-center two-step"
                                    placeholder="0"
                                    onKeyUp={(event) => moveToNext(1, event)}
                                    maxLength={1}
                                    id="digit1-input"
                                    ref={digit1Ref}
                                  />
                                </div>
                              </Col>

                              <Col>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="digit2-input"
                                    className="visually-hidden"
                                  >
                                    2
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control form-control-lg text-center two-step"
                                    placeholder="0"
                                    onKeyUp={(event) => moveToNext(2, event)}
                                    maxLength={1}
                                    id="digit2-input"
                                    ref={digit2Ref}
                                  />
                                </div>
                              </Col>

                              <Col>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="digit3-input"
                                    className="visually-hidden"
                                  >
                                    3
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control form-control-lg text-center two-step"
                                    placeholder="0"
                                    onKeyUp={(event) => moveToNext(3, event)}
                                    maxLength={1}
                                    id="digit3-input"
                                    ref={digit3Ref}
                                  />
                                </div>
                              </Col>

                              <Col>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="digit4-input"
                                    className="visually-hidden"
                                  >
                                    4
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control form-control-lg text-center two-step"
                                    placeholder="0"
                                    onKeyUp={(event) => moveToNext(4, event)}
                                    maxLength={1}
                                    id="digit4-input"
                                    ref={digit4Ref}
                                  />
                                </div>
                              </Col>
                              <Col>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="digit5-input"
                                    className="visually-hidden"
                                  >
                                    5
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control form-control-lg text-center two-step"
                                    placeholder="0"
                                    onKeyUp={(event) => moveToNext(5, event)}
                                    maxLength={1}
                                    id="digit5-input"
                                    ref={digit5Ref}
                                  />
                                </div>
                              </Col>
                              <Col>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="digit6-input"
                                    className="visually-hidden"
                                  >
                                    6
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control form-control-lg text-center two-step"
                                    placeholder="0"
                                    onKeyUp={(event) => moveToNext(6, event)}
                                    maxLength={1}
                                    id="digit6-input"
                                    ref={digit6Ref}
                                  />
                                </div>
                              </Col>
                            </Row>

                            <div className="mt-4">
                              <div
                                onClick={verifyOTP}
                                className="btn btn-primary w-100"
                              >
                                Confirm
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>

                      <div className="mt-5 text-center">

                        {isResendDisabled ? (
                          < div >
                            {/* Didn't receive an OTP ?{" "} */}
                            < span className="text-primary fw-semibold" disabled> Resend</span>{" "}
                            <span>OTP in {timer} seconds</span>
                          </div>
                        ) : (
                          <div

                          >
                            <span>Didn't receive OTP ?</span>

                            {" "}
                            <span onClick={sendOtp}
                              className="text-primary fw-semibold" >Resend</span>

                          </div>
                          // <p className="text-muted mb-0">
                          //   <button onClick={sendOtp}>Resend OTP</button>
                          // </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">
                        © {new Date().getFullYear()} InstaOne . Powered By
                        Nexapp Technologies Pvt Ltd.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <CarouselPage />
          </Row>
        </Container>
      </div >
    </React.Fragment >
  );
};

export default TwoStepVerfication;
