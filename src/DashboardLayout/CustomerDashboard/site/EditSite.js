import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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
import { toast } from "react-toastify";
import { postAPI } from "../../../Services/Apis";
import { useNavigate } from "react-router-dom";
import {
  errorStyle,
  LoaderHide,
  LoaderShow,
} from "../../../helpers/common_constants";
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

const EditSite = (props) => {
  const { id } = useParams(); // Fetch the id parameter from the route
  const location = useLocation(); // Access the location object to get state
  const navigate = useNavigate();
  const { state } = location;
  console.log(state.row);
  if (!state || !state.row) {
    return <div>No data available for editing</div>;
  }

  document.title = "Instaone";

  const [initialValues, setInitialValues] = useState({
    siteID: "",
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
  });

  useEffect(() => {
    if (state?.row) {
      setInitialValues({
        siteID: state.row?.siteID || "",
        pincode: state.row?.pincode || "",
        city: state.row?.city || "",
        state: state.row?.state || "",
        legalCode: state.row?.legalCode || "",
        localContactName: state.row?.localContactName || "",
        localContactPhone: state.row?.localContactPhone || "",
        siteName: state.row?.siteName || "",
        address: state.row?.address || "",
        companyName: state.row?.companyName || "",
        streetAddress: state.row?.streetAddress || "",
        landMark: state.row?.landMark || "",
        colonyName: state.row?.colonyName || "",
      });
    }
  }, [state]);

  const validationType = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // This is important to update form values after initialization
    validationSchema: Yup.object().shape({
      siteName: siteNameValidation,
      legalCode: legalCodeValidation,
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
    onSubmit: async (values) => {
      try {
        LoaderShow();
        const response = await postAPI("site/update-site", values);
        if (response.statusCode === 200) {
          toast.success(response.message);
          const basePath = location.pathname.split("/").slice(0, 3).join("/");
          if (basePath === "/admin/update-site") {
            navigate("/admin/customer");
          } else if (basePath === "/customer/update-site") {
            navigate("/customer/allsite");
          }
          LoaderHide();
        }
      } catch (error) {
        LoaderHide();
        toast.error(error.message);
      }
    },
  });

  const gotoSitePage = () => {
    const basePath = location.pathname.split("/").slice(0, 3).join("/");
    if (basePath === "/admin/update-site") {
      navigate("/admin/customer");
    } else if (basePath === "/customer/update-site") {
      navigate("/customer/allsite");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Site" breadcrumbItem="Edit Site" />
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
                  <h4 className="card-title mb-2">Edit Site</h4>
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
                          <Label className="form-label">Site ID</Label>
                          <Input
                            name="username"
                            placeholder={id}
                            readOnly
                            type="text"
                            onChange={validationType.handleChange}
                          />
                        </div>
                      </Col>
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
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.address || ""}
                          />
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
                            value={validationType.values.pincode || ""}
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
                          <Label className="form-label">Company Name</Label>
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
                          <Label className="form-label">Street Address</Label>
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
                          <Label className="form-label">Land Mark</Label>
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
                          <Label className="form-label">Map Location (optional)</Label>
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
                      </Col>
                      <Col lg={6}>
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
                      </Col>
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
                        Save
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

export default EditSite;
