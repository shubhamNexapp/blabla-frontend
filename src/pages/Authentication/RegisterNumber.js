import React, { useEffect } from "react";
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

//redux
import { Link, useNavigate } from "react-router-dom";

// import { Link } from "react-router-dom"

// import images
import logo from "../../assets/images/Instaone.png";
import CarouselPage from "../AuthenticationInner/CarouselPage";
import { toast } from "react-toastify";
import { postAPI } from "../../Services/Apis";
import loader from "../../assets/images/instaone-loader.svg";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";

const RegisterNumber = () => {
  localStorage?.removeItem("registerNumber");
  localStorage?.removeItem("registerPassword");
  document.title = "Register | InstaOne ";
  let navigate = useNavigate();

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
    const mobileInput = numbervalidation?.values?.phone;
    console.log(mobileInput);
    window.OTPlessSignin.initiate({
      channel: "PHONE",
      phone: mobileInput,
      countryCode: "+91", // Adjust country code as necessary
      expiry: 60,
    });
  };

  const numbervalidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      phone: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required("Mobile Number is required")
        .matches(/^[0-9]{10}$/, "Must be a valid 10-digit mobile number"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        LoaderShow();
        console.log("values===", values);
        const data = {
          phone: values.phone,
        };
        const response = await postAPI("auth/send-otp-register", data);
        if (response.statusCode === 200) {
          const registerNumber = {
            phone: values.phone,
          };

          localStorage.setItem(
            "registerNumber",
            JSON.stringify(registerNumber)
          );
          localStorage.setItem("sandboxToken", response.sandboxToken);
          phoneAuth();
          // console.log('after phoneauth')
          toast.success(response.message);
          resetForm();
          navigate("/register");
          LoaderHide();
        }
      } catch (error) {
        LoaderHide();
        toast.error(error.message);
      }
    },
  });

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
                        <h5 className="mb-0">Join Our Network</h5>
                        <p className="text-muted mt-2">
                          Get your free InstaOne account now.
                        </p>
                      </div>

                      <form
                        className="needs-validation custom-form mt-4 pt-2"
                        onSubmit={Formhandle}
                      >
                        {/* {user && user ? (
                                                    <Alert color="success">
                                                        Register User Successfully
                                                    </Alert>
                                                ) : null}

                                                {registrationError && registrationError ? (
                                                    <Alert color="danger">{registrationError}</Alert>
                                                ) : null} */}

                        {/* <div className="mb-3">
                                                    <Label className="form-label"> Mobile No.</Label>
                                                    <Input
                                                        id="number"
                                                        name="mobile"
                                                        className="form-control"
                                                        placeholder="Enter Mobile No."
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.mobile || ""}
                                                        invalid={
                                                            validation.touched.mobile && validation.errors.mobile ? true : false
                                                        }
                                                    />
                                                    {validation.touched.mobile && validation.errors.mobile ? (
                                                        <FormFeedback type="invalid">{validation.errors.mobile}</FormFeedback>
                                                    ) : null}
                                                </div> */}

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
                            onChange={numbervalidation.handleChange}
                            onBlur={numbervalidation.handleBlur}
                            value={numbervalidation.values.phone}
                            className="form-control"
                            id="basicpill-phoneno-input"
                            placeholder="Enter Your Phone No"
                          />
                          {numbervalidation.touched.phone &&
                            numbervalidation?.errors?.phone ? (
                            <span style={{ color: "red" }}>
                              {numbervalidation?.errors?.phone}
                            </span>
                          ) : null}
                        </div>

                        <div className="mb-3 mt-3">
                          <button
                            className="btn btn-primary w-100 waves-effect waves-light"
                            type="submit"
                          >
                            Continue
                          </button>
                        </div>
                      </form>

                      <div className="mt-5 text-center">
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
                        © {new Date().getFullYear()} InstaOne . Powered By Nexapp Technologies Pvt Ltd.
                        <span style={{ color: '#ed8d21' }} >T&C</span>
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

export default RegisterNumber;
