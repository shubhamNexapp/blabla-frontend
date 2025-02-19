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

import { Link, useLocation, useNavigate } from "react-router-dom";

// import images
import logo from "../../assets/images/Instaone.png";

import CarouselPage from "../AuthenticationInner/CarouselPage";
import { postAPI } from "../../Services/Apis";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  //meta title
  document.title = "Instaone";
  // let verify = false

  const params = useParams();
  let navigate = useNavigate();

  const numbervalidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      userId: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^[6-9][0-9]{9}$/,
          "Mobile Number must start with 6-9 and be 10 digits"
        )
        .length(10, "Mobile Number must be exactly 10 digits"),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const data = {
          userId: params?.id,
          password: values.password,
        };

        const response = await postAPI("auth/reset-password", data);

        if (response.statusCode === 200) {
          toast.success(response.message);

          resetForm();
          navigate("/login");
        }
      } catch (error) {
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
                        <h5 className="mb-0">Set New Password</h5>
                      </div>

                      <form
                        className="needs-validation custom-form mt-4 pt-2"
                        onSubmit={Formhandle}
                      >
                        {/* <div className="mb-3">
                          <label
                            htmlFor="basicpill-userId-input"
                            className="form-label"
                          >
                            UserID
                          </label>
                          <input
                            type="text"
                            name="userId"
                            onChange={numbervalidation.handleChange}
                            onBlur={numbervalidation.handleBlur}
                            value={numbervalidation.values.userId}
                            className="form-control"
                            id="basicpill-userId-input"
                            placeholder="Enter userId"
                          />
                          {numbervalidation.touched.userId &&
                          numbervalidation?.errors?.userId ? (
                            <span style={{ color: "red" }}>
                              {numbervalidation?.errors?.userId}
                            </span>
                          ) : null}
                        </div> */}

                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-password-input"
                            className="form-label"
                          >
                            New Password
                          </label>
                          <input
                            type="text"
                            name="password"
                            onChange={numbervalidation.handleChange}
                            onBlur={numbervalidation.handleBlur}
                            value={numbervalidation.values.password}
                            className="form-control"
                            id="basicpill-password-input"
                            placeholder="Enter New Password"
                          />
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
                            Confirm New Password
                          </label>
                          <input
                            type="text"
                            name="confirmPassword"
                            onChange={numbervalidation.handleChange}
                            onBlur={numbervalidation.handleBlur}
                            value={numbervalidation.values.confirmPassword}
                            className="form-control"
                            id="basicpill-confirmPassword-input"
                            placeholder=" confirm New Password"
                          />
                          {numbervalidation.touched.confirmPassword &&
                          numbervalidation?.errors?.confirmPassword ? (
                            <span style={{ color: "red" }}>
                              {numbervalidation?.errors?.confirmPassword}
                            </span>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <button
                            className="btn btn-primary w-100 waves-effect waves-light"
                            type="submit"
                          >
                            Confirm
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">
                        © {new Date().getFullYear()} InstaOne . Created By
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
      </div>
    </React.Fragment>
  );
};

export default ResetPassword;
