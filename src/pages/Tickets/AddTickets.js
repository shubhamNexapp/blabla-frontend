import React from "react";
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
    CardHeader
  } from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";


const AddTickets = () => {

  //meta title
  document.title = "Add Tickets ";
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
        firstname: "Mark" || '',
        lastname: "Otto" || '',
        city: '',
        state: '',
        zip: '',
    },
    validationSchema: Yup.object({
        firstname: Yup.string().required("Please Enter Your First Name"),
        lastname: Yup.string().required("Please Enter Your Last Name"),
        city: Yup.string().required("Please Enter Your City"),
        state: Yup.string().required("Please Enter Your State"),
        zip: Yup.string().required("Please Enter Your Zip"),
    }),
    onSubmit: (values) => {
        console.log("values", values);
    }
});

    // Form validation 
  const validationType = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: '',
      password: '',
      password1: '',
      email: '',
      digits: '',
      number: '',
      alphanumeric: '',
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required(
        "This value is required"
      ),
      password: Yup.string().required(
        "This value is required"
      ),
      password1: Yup.string().when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Both password need to be the same"
        ),
      }),
      email: Yup.string()
        .email("Must be a valid Email")
        .max(255)
        .required("Email is required"),
      url: Yup.string()
        .matches(
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
          "Enter correct url!"
        )
        .required("Please enter correct Url"),
      digits: Yup.number().required(
        "Please Enter Your Digits"
      ),
      number: Yup.number().required(
        "Please Enter Your Number"
      ),
      alphanumeric: Yup.string()
        .matches(
          /^[a-z0-9]+$/i,
          "Enter correct Alphanumeric!"
        )
        .required("Please Enter Your Alphanumeric"),
      textarea: Yup.string().required(
        "Please Enter Your Textarea"
      ),
    }),
    onSubmit: (values) => {
      console.log("values", values);
    }
  });

  // Form validation 
  const rangeValidation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      min_Length: '',
      max_Length: '',
      min_Value: '',
      max_Value: '',
      range_Value: '',
      regular_Exp: '',
    },
    validationSchema: Yup.object().shape({
      min_Length: Yup.string()
        .min(6, "Must be exactly 6 digits")
        .required("Min 6 chars"),
      max_Length: Yup.string()
        .max(6, "Must be exactly 6 digits")
        .required("Max 6 chars"),
      min_Value: Yup.string().required("Min Value 6").test('val', 'This value should be greater than or equal to 6', (val) => val >= 6),
      max_Value: Yup.string().required("Max Value 6").matches(/^[0-6]+$/, "This value should be lower than or equal to 6."),
      range_Value: Yup.string().required(
        "range between 5 to 10"
      ).min(5, "This value should be between 5 and 10")
        .max(10, "This value should be between 5 and 10"),
      regular_Exp: Yup.string()
        .matches(
          /^[#0-9]+$/,
          "Only Hex Value"
        )
        .required("Only Hex Value"),
    }),
    onSubmit: (values) => {
      console.log("values", values);
    }
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Tickets" breadcrumbItem="Add Tickets" />

          <Row>
            {/* import NormalValidation */}
            
            {/* import TooltipsValidation */}
            <Col xl={12}>
                <Card>
                    {/* <CardHeader>
                        <h4 className="card-title">React Validation - Normal</h4>
                        <p className="card-title-desc">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
                    </CardHeader> */}
                    <CardBody>
                        <Form className="needs-validation"
                            onSubmit={(e) => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                            }}
                        >
                            <Row>
                                <Col md="6">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom01">First name</Label>
                                        <Input
                                            name="firstname"
                                            placeholder="First name"
                                            type="text"
                                            className="form-control"
                                            id="validationCustom01"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.firstname || ""}
                                            invalid={
                                                validation.touched.firstname && validation.errors.firstname ? true : false
                                            }
                                        />
                                        {validation.touched.firstname && validation.errors.firstname ? (
                                            <FormFeedback type="invalid">{validation.errors.firstname}</FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom02">Last name</Label>
                                        <Input
                                            name="lastname"
                                            placeholder="Last name"
                                            type="text"
                                            className="form-control"
                                            id="validationCustom02"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.lastname || ""}
                                            invalid={
                                                validation.touched.lastname && validation.errors.lastname ? true : false
                                            }
                                        />
                                        {validation.touched.lastname && validation.errors.lastname ? (
                                            <FormFeedback type="invalid">{validation.errors.lastname}</FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="4">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom03">City</Label>
                                        <Input
                                            name="city"
                                            placeholder="City"
                                            type="text"
                                            className="form-control"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.city || ""}
                                            invalid={
                                                validation.touched.city && validation.errors.city ? true : false
                                            }
                                        />
                                        {validation.touched.city && validation.errors.city ? (
                                            <FormFeedback type="invalid">{validation.errors.city}</FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom04">State</Label>
                                        <Input
                                            name="state"
                                            placeholder="State"
                                            type="text"
                                            className="form-control"
                                            id="validationCustom04"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.state || ""}
                                            invalid={
                                                validation.touched.state && validation.errors.state ? true : false
                                            }
                                        />
                                        {validation.touched.state && validation.errors.state ? (
                                            <FormFeedback type="invalid">{validation.errors.state}</FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom05">Zip</Label>
                                        <Input
                                            name="zip"
                                            placeholder="Zip"
                                            type="text"
                                            className="form-control"
                                            id="validationCustom05"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.zip || ""}
                                            invalid={
                                                validation.touched.zip && validation.errors.zip ? true : false
                                            }
                                        />
                                        {validation.touched.zip && validation.errors.zip ? (
                                            <FormFeedback type="invalid">{validation.errors.zip}</FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="12">
                                    <FormGroup className="mb-3">
                                        <div className="form-check">
                                            <Input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="invalidCheck"
                                            />
                                            <Label
                                                className="form-check-label"
                                                htmlFor="invalidCheck"
                                            >
                                                {" "}
                                                Agree to terms and conditions
                                            </Label>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Button color="primary" type="submit">
                                Submit form
                            </Button>
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

export default AddTickets;
