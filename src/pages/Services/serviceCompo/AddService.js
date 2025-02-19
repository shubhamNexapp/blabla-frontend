import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
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
import { postAPI } from "../../../Services/Apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { errorStyle } from "../../../helpers/common_constants";

import { getUserDetails } from "../../../common/utility";

const AddService = () => {

    document.title = "Instaone";

    const navigate = useNavigate();


    const validationType = useFormik({
        initialValues: {
            serviceName: "",
            category: "",
            description: "",
            price: "",
        },

        validationSchema: Yup.object().shape({

            serviceName: Yup.string().required("This value is required"),
            category: Yup.string().required("This value is required"),
            description: Yup.string().required("This value is required"),
            price: Yup.string().required("This value is required")
                .matches(/^[0-9]+$/, "Must be a valid  number"),

        }),

        onSubmit: async (values, { resetForm }) => {
            try {

                const user = getUserDetails()

                const data = {
                    "serviceName": values.serviceName,
                    "category": values.category,
                    "description": values.description,
                    "price": values.price,

                    "userId": user?.userId,
                }


                const response = await postAPI("service/add-service", data);
                if (response.statusCode === 200) {

                    toast.success(response.message);
                    navigate("/admin/service");
                }
            } catch (error) {
                toast.error(error.message);
            }
        },
    });
    const gotoServicePage = () => {
        navigate("/admin/service");
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Service" breadcrumbItem="Add New Service" />

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-2">Add Service</h4>
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
                                            <h5 className="mb-2">Service Information</h5>

                                            <Col lg={6}>
                                                <div className="mb-3">
                                                    <Label>Service Name</Label>
                                                    <Input
                                                        id="serviceName"
                                                        name="serviceName"
                                                        type="text"
                                                        onChange={validationType.handleChange}
                                                        onBlur={validationType.handleBlur}
                                                        value={validationType.values.serviceName || ""}
                                                    />
                                                    {validationType.touched.serviceName &&
                                                        validationType.errors.serviceName ? (
                                                        <span style={errorStyle}>
                                                            {validationType.errors.serviceName}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </Col>

                                            <Col lg={6}>
                                                <div className="mb-3">

                                                    <label className="form-label">Service Category</label>
                                                    <select
                                                        className="form-select"
                                                        name="category"
                                                        onChange={validationType.handleChange}
                                                        value={validationType.values.category || ""}
                                                    >
                                                        <option value="">Select Category Type</option>
                                                        <option value="hardware">Hardware</option>
                                                        <option value="software">Software</option>
                                                    </select>
                                                    {validationType.touched.category &&
                                                        validationType.errors.category ? (
                                                        <span style={errorStyle}>
                                                            {validationType.errors.category}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </Col>

                                        </Row>

                                        <Row className="mb-4">
                                            {/* <h5 className="mb-2">Address Information</h5> */}


                                            <Col lg={6}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Unit Price</Label>
                                                    <Input
                                                        id="price"
                                                        name="price"
                                                        type="text"
                                                        onChange={validationType.handleChange}
                                                        onBlur={validationType.handleBlur}
                                                        value={validationType.values.price || ""}
                                                    />
                                                    {validationType.touched.price &&
                                                        validationType.errors.price ? (
                                                        <span style={errorStyle}>
                                                            {validationType.errors.price}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </Col>

                                            <Col lg={12}>
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="basicpill-description-input"
                                                        className="form-label"
                                                    >
                                                        Addition Description
                                                    </label>
                                                    <textarea
                                                        id="basicpill-description-input"
                                                        className="form-control"
                                                        rows="2"
                                                        name="description"
                                                        onChange={validationType.handleChange}
                                                        onBlur={validationType.handleBlur}
                                                        value={validationType.values.description || ""}
                                                        placeholder="Enter Your Address"
                                                    ></textarea>
                                                    {validationType.touched.description &&
                                                        validationType.errors.description ? (
                                                        <span style={errorStyle}>
                                                            {validationType.errors.description}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </Col>

                                        </Row>




                                        <div className="d-flex flex-wrap gap-2">
                                            <Button
                                                onClick={gotoServicePage}
                                                type="reset"
                                                color="secondary"
                                            >
                                                Cancel
                                            </Button>{' '}
                                            <Button type="submit" color="primary">
                                                Add Service
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
    )
}

export default AddService