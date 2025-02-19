import PropTypes from "prop-types";
import React from "react";
import {
  Row,
  Col,
  Alert,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
} from "reactstrap";
import { toast } from "react-toastify";
import loader from "../../assets/images/instaone-loader.svg";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../store/actions";

// import images
import logo from "../../assets/images/Instaone.png";
import CarouselPage from "../AuthenticationInner/CarouselPage";
import { createSelector } from "reselect";
import { postAPI } from "../../Services/Apis";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";

const ForgetPasswordPage = (history) => {
  //meta title
  document.title =
    "Instaone";

  const dispatch = useDispatch();

  const forgetData = createSelector(
    (state) => state.ForgetPassword,
    (state) => ({
      forgetError: state.forgetError,
      forgetSuccessMsg: state.forgetSuccessMsg,
    })
  );
  // Inside your component
  const { forgetError, forgetSuccessMsg } = useSelector(forgetData);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: async (values, { resetForm }) => {
      dispatch(userForgetPassword(values, history));
      try {
        LoaderShow();
        const data = { email: values?.email };
        const response = await postAPI("auth/forgot-password", data);
        if (response.statusCode === 200) {
          toast.success(response?.message);
          LoaderHide();
          resetForm();
        }
      } catch (error) {
        toast.error(error.message);
        LoaderHide();
      }
    },
  });

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
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={logo} alt="" height={55} width={150} />
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h5 className="mb-0">Reset Password</h5>
                        <p className="text-muted mt-2">
                          Reset Password with InstaOne.
                        </p>
                      </div>

                      {/* {forgetError && forgetError ? (
                        <Alert color="danger" style={{ marginTop: "13px" }}>
                          {forgetError}
                        </Alert>
                      ) : null}
                      {forgetSuccessMsg ? (
                        <Alert color="success" style={{ marginTop: "13px" }}>
                          {forgetSuccessMsg}
                        </Alert>
                      ) : null} */}

                      <Form
                        className="custom-form mt-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <div className="mb-3">
                          <Label className="form-label">Email</Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <Row className="mb-3">
                          <Col className="text-end">
                            <button
                              className="btn btn-primary w-100 waves-effect waves-light"
                              type="submit"
                            >
                              Reset
                            </button>
                          </Col>
                        </Row>
                      </Form>

                      <div className="mt-5 text-center">
                        <p className="text-muted mb-0">
                          Remember It ?
                          <Link
                            to="/login"
                            className="text-primary fw-semibold"
                          >
                            Sign In
                          </Link>
                          {/* <a href="auth-login.html"
                          className=""> Sign In </a>  */}
                        </p>
                      </div>
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

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default ForgetPasswordPage;
