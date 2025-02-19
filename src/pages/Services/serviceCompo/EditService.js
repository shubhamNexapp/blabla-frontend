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
import { errorStyle } from "../../../helpers/common_constants";

import dayjs from "dayjs";


const EditService = () => {



    const { id } = useParams(); // Fetch the id parameter from the route
    const location = useLocation(); // Access the location object to get state
    const navigate = useNavigate();
    const { state } = location;
    console.log(state.row)
    if (!state || !state.row) {
        return <div>No data available for editing</div>;
    }


    document.title = "Instaone";



    const [initialValues, setInitialValues] = useState({
        serviceName: "",
        serviceID: "",
        category: "",
        description: "",
        price: "",


    });

    useEffect(() => {
        //     // Convert dateRange strings to Dayjs objects


        if (state?.row) {
            setInitialValues({
                serviceID: state.row?.serviceID || "",
                serviceName: state.row?.serviceName || "",
                category: state.row?.category || "",
                description: state.row?.description || "",
                price: state.row?.price || "",


            });
        }
    }, [state]);

    const validationType = useFormik({
        initialValues: initialValues,
        enableReinitialize: true, // This is important to update form values after initialization
        validationSchema: Yup.object().shape({

        }),
        onSubmit: async (values) => {
            try {
                const response = await postAPI("service/update-service", values);
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
                    <Breadcrumbs title="Service" breadcrumbItem="Edit Service" />

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-2">Edit Service</h4>
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
                                                    <Label className="form-label">Service ID</Label>
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
                                            </Button>
                                            <Button type="submit" color="primary">
                                                Edit Service
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

export default EditService