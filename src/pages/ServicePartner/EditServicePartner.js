import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import Select from "react-select";
import "../../assets/scss/pages/ticket.scss";
import makeAnimated from "react-select/animated";
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
import Breadcrumbs from "../../components/Common/Breadcrumb";


const EditServicePartner = () => {
    const { id } = useParams(); // Fetch the id parameter from the route
    const location = useLocation(); // Access the location object to get state
    const { state } = location
    console.log('State in EditTicket:', state);
    // console.log(state.row.assign); // Check what is being passed in state

    if (!state || !state.row) {
        return <div>No data available for editing</div>;
    }

    // Example of accessing data fields

    document.title = "Service Company ";

    const [selectedFiles, setselectedFiles] = useState([]);
    const [siteAddress, setSiteAddress] = useState("");
    const animatedComponents = makeAnimated();

    const optionGroup = [
        {
            // label: "Group 1",
            options: [
                { label: "67835", value: "site1", siteId: "123", siteAddress: "Nexapp Tech,Pune" },
                { label: "64815", value: "site2", siteId: "124", siteAddress: "Nano Stuff, Pune" },
            ],
        },
        {
            // label: "Group 2",
            options: [
                { label: "56734", value: "site3", siteId: "125", siteAddress: "Bank Of India, Kolhapur" },
                { label: "98765", value: "site4", siteId: "126", siteAddress: "TCS, Pune" },
            ],
        },
    ];

    const handleSelectGroup = (selectedGroup) => {
        if (selectedGroup) {
            setSiteAddress(selectedGroup.siteAddress);
        } else {
            setSiteAddress("");
        }
    };

    function handleAcceptedFiles(files) {
        files.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        );
        setselectedFiles(files);
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    const validationType = useFormik({
        enableReinitialize: true,

        initialValues: {
            companyName: "Jio",
            gstNumber: "",
            sourceofSupply: "",
            gst1: "",
            msme: "",
            msmeFile: "",
            phonenumber: "",
            service: "",
            email: "",
            state: "",
            city: "",
        },
        validationSchema: Yup.object().shape({

            companyName: Yup.string().required("This value is required"),
            gstNumber: Yup.string().required("This value is required"),
            sourceofSupply: Yup.string().required("This value is required"),
            gst1: Yup.string().required("This value is required"),
            msme: Yup.string().required("This value is required"),
            email: Yup.string().required("This value is required"),
            state: Yup.string().required("This value is required"),
            phonenumber: Yup.string().required("This value is required"),
            service: Yup.string().required("This value is required"),
            city: Yup.string().required("This value is required"),
        }),
        onSubmit: (values) => {
            console.log("values", values);
        },
    });


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Ticket" breadcrumbItem={`service partner`} />

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-2"></h4>
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
                                            <h5 className="mb-2">Company Information</h5>

                                            <Col lg={6}>
                                                <div className="mb-3">
                                                    <Label>Company Name</Label>
                                                    <Input
                                                        name="companyName"
                                                        type="text"
                                                        placeholder=""
                                                        onChange={validationType.handleChange}
                                                        onBlur={validationType.handleBlur}
                                                        value={validationType.values.companyName || ""}
                                                        invalid={
                                                            validationType.touched.name &&
                                                                validationType.errors.companyName
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validationType.touched.companyName &&
                                                        validationType.errors.companyName ? (
                                                        <FormFeedback type="invalid">
                                                            {validationType.errors.companyName}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>

                                            <Col lg={6}>
                                                <div className="mb-3">
                                                    <Label>GST Number</Label>
                                                    <Input
                                                        name="gstnumber"
                                                        type="text"
                                                        placeholder=""
                                                        onChange={validationType.handleChange}
                                                        onBlur={validationType.handleBlur}
                                                        value={validationType.values.gstNumber || ""}
                                                        invalid={
                                                            validationType.touched.gstNumber &&
                                                                validationType.errors.gstNumber
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validationType.touched.gstNumber &&
                                                        validationType.errors.gstNumber ? (
                                                        <FormFeedback type="invalid">
                                                            {validationType.errors.gstNumber}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>

                                            <Col lg={6}>
                                                <div className="mb-3">
                                                    <Label>Source of Supply</Label>
                                                    <Input
                                                        name="sourceofSupply"
                                                        type="text"
                                                        placeholder=""
                                                        onChange={validationType.handleChange}
                                                        onBlur={validationType.handleBlur}
                                                        value={validationType.values.sourceofSupply || ""}
                                                        invalid={
                                                            validationType.touched.sourceofSupply &&
                                                                validationType.errors.sourceofSupply
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validationType.touched.sourceofSupply &&
                                                        validationType.errors.sourceofSupply ? (
                                                        <FormFeedback type="invalid">
                                                            {validationType.errors.sourceofSupply}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <h5 className="mb-2">Contact Information</h5>
                                            <Col lg={6}>
                                                <div className="mb-3">
                                                    <Label>email</Label>
                                                    <Input
                                                        name="email"
                                                        type="text"
                                                        placeholder=""
                                                        onChange={validationType.handleChange}
                                                        onBlur={validationType.handleBlur}
                                                        value={validationType.values.email || ""}
                                                        invalid={
                                                            validationType.touched.email &&
                                                                validationType.errors.email
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validationType.touched.email &&
                                                        validationType.errors.email ? (
                                                        <FormFeedback type="invalid">
                                                            {validationType.errors.email}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>


                                            <Col lg={6}>
                                                <div className="mb-3">
                                                    <Label className="form-label">Mobile Number</Label>
                                                    <Input
                                                        name="phonenumber"
                                                        placeholder=""
                                                        type="text"
                                                        readOnly
                                                        value={siteAddress}
                                                        onChange={validationType.handleChange}
                                                        onBlur={validationType.handleBlur}
                                                        invalid={
                                                            validationType.touched.phonenumber &&
                                                                validationType.errors.phonenumber
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validationType.touched.phonenumber &&
                                                        validationType.errors.phonenumber ? (
                                                        <FormFeedback type="invalid">
                                                            {validationType.errors.phonenumber}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <h5 className="mb-2">Service Coverage Information</h5>
                                            <Col lg={6}>
                                                <div className="mb-3">
                                                    <label htmlFor="choices-multiple-default" className="form-label font-size-13 text-muted">State</label>
                                                    <Select
                                                        isMulti
                                                        value={selectedOptions}
                                                        options={StateOption}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"

                                                    />
                                                </div>
                                            </Col>

                                            <Col lg={6}>
                                                <div className="mb-3">
                                                    <Label className="form-label">City</Label>
                                                    <Input
                                                        name="city"
                                                        label="city"
                                                        type="tel"
                                                        onChange={validationType.handleChange}
                                                        onBlur={validationType.handleBlur}
                                                        value={validationType.values.city || ""}
                                                        invalid={
                                                            validationType.touched.city &&
                                                                validationType.errors.city
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validationType.touched.city &&
                                                        validationType.errors.city ? (
                                                        <FormFeedback type="invalid">
                                                            {validationType.errors.city}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="d-flex flex-wrap gap-2">
                                            <Button type="reset" color="secondary">
                                                Cancel
                                            </Button>{' '}
                                            <Button type="submit" color="primary">
                                                Save Changes
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

export default EditServicePartner