import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select, { components } from "react-select";
import "../../assets/scss/pages/ticket.scss";
import makeAnimated from "react-select/animated";
import {
  Container,
  Row,
  Col,
  Card,
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

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const AddService = () => {
  // Meta title
  document.title = "Instaone";

  const [selectedFiles, setselectedFiles] = useState([]);
  const [siteAddress, setSiteAddress] = useState("");
  const [serviceImage, setServiceImage] = useState(null);
  const animatedComponents = makeAnimated();

  const optionGroup = [
    {
      options: [
        { label: "67835", value: "site1", siteId: "123", siteAddress: "Nexapp Tech,Pune" },
        { label: "64815", value: "site2", siteId: "124", siteAddress: "Nano Stuff, Pune" },
      ],
    },
    {
      options: [
        { label: "56734", value: "site3", siteId: "125", siteAddress: "Bank Of India, Kolhapur" },
        { label: "98765", value: "site4", siteId: "126", siteAddress: "TCS, Pune" },
      ],
    },
  ];

  const serviceoptionGroup = [
    {
      options: [
        { label: "Hardware", value: "Hardware" },
        { label: "Software", value: "Software" },
        { label: "Service", value: "Service" },
      ],
    },
  ];

  const categoryOptionGroup = [
    {
      options: [
        { label: "Cyber Security", value: "Hardware", color: "#FF5630" },
        { label: "SD-WAN", value: "Software", color: "#36B37E" },
        { label: "M2M", value: "Service", color: "#00875A" },
      ],
    },
  ];

  const gstoptionGroup = [
    {
      options: [
        { label: "18.0%", value: "18.0%" },
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
      username: "",
      name: "",
      localname: "",
      phonenumber: "",
      service: "",
      assign: "",
      serviceDescription:""
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("This value is required"),
      name: Yup.string().required("This value is required"),
      localname: Yup.string().required("This value is required"),
      phonenumber: Yup.string().required("This value is required"),
      service: Yup.string().required("This value is required"),
      assign: Yup.string().required("This value is required"),
    }),
    onSubmit: (values) => {
      console.log("values", values);
    },
  });

  const customOption = (props) => (
    <components.Option {...props}>
      <span
        style={{
          height: "11px",
          width: "11px",
          backgroundColor: props.data.color,
          borderRadius: "50%",
          display: "inline-block",
          marginRight: "10px",
        }}
      ></span>
      {props.data.label}
    </components.Option>
  );

  const customSingleValue = (props) => (
    <components.SingleValue {...props}>
      <span
        style={{
          height: "11px",
          width: "11px",
          backgroundColor: props.data.color,
          borderRadius: "50%",
          display: "inline-block",
          marginRight: "10px",
        }}
      ></span>
      {props.data.label}
    </components.SingleValue>
  );

  const handleServiceImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setServiceImage({
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      });
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Service" breadcrumbItem="Add Service" />

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
                    <Row className="mb-2">
                      <h5 className="mb-2">Service Information</h5>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Service Name</Label>
                          <Input
                            name="username"
                            placeholder=""
                            type="text"
                            onChange={validationType.handleChange}
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Service Group</Label>
                          <Select
                            options={categoryOptionGroup}
                            classNamePrefix="select2-selection"
                            components={{
                              Option: customOption,
                              SingleValue: customSingleValue,
                            }}
                          />
                          {validationType.touched.name &&
                            validationType.errors.name ? (
                            <FormFeedback type="invalid">
                              {validationType.errors.name}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-">
                      {/* <h5 className="mb-2">Site Information</h5> */}
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Service Category
                          </Label>
                          <Select
                            components={animatedComponents}
                            options={serviceoptionGroup}
                            classNamePrefix="select2-selection"
                          />
                        </div>
                        {validationType.touched.localname &&
                          validationType.errors.localname ? (
                          <FormFeedback type="invalid">
                            {validationType.errors.localname}
                          </FormFeedback>
                        ) : null}
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Service Description</Label>
                          <textarea
                          id="basicpill-address-input"
                          className="form-control"
                          rows="2"
                          placeholder=""
                        ></textarea>
                          {validationType.touched.serviceDescription &&
                            validationType.errors.serviceDescription ? (
                            <FormFeedback >
                              {validationType.errors.serviceDescription}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Service Image</Label>
                          <Input
                            type="file"
                            onChange={handleServiceImageChange}
                          />
                          {serviceImage && (
                            <div className="mt-3">
                              <img
                                src={serviceImage.preview}
                                alt="Service Preview"
                                height="100"
                                className="rounded"
                              />
                              <p>{serviceImage.formattedSize}</p>
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Unit Price</Label>
                          <Input
                            name="assign"
                            label="assign"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.assign || ""}
                            invalid={
                              validationType.touched.assign &&
                              validationType.errors.assign
                                ? true
                                : false
                            }
                          />
                          {validationType.touched.assign &&
                            validationType.errors.assign ? (
                            <FormFeedback type="invalid">
                              {validationType.errors.assign}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                    <h5 className="mb-2">GST Information</h5>

                      <Col lg={6}>
                      <div className="mb-3">
                          <Label>Taxable</Label>
                          <br></br>
                          <Input type="checkbox" />

                          {validationType.touched.name &&
                            validationType.errors.name ? (
                            <FormFeedback type="invalid">
                              {validationType.errors.name}
                            </FormFeedback>
                          ) : null}
                        </div>
                        
                      </Col>
                      <Col lg={6}>
                      <div className="mb-3">
                          <Label>GST</Label>
                          <Select
                            options={gstoptionGroup}
                            classNamePrefix="select2-selection"
                            onChange={(e) => {
                              console.log(e);
                            }}
                          />
                          {validationType.touched.name &&
                            validationType.errors.name ? (
                            <FormFeedback type="invalid">
                              {validationType.errors.name}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col lg={12}>
                        <div className="hstack gap-2 justify-content-end">
                          <Link to="/services">
                            <Button
                              type="button"
                              color="primary"
                              className="btn btn-primary"
                            >
                              Back
                            </Button>
                          </Link>
                          <Button
                            type="submit"
                            color="primary"
                            className="btn btn-primary"
                          >
                            Save
                          </Button>
                        </div>
                      </Col>
                    </Row>
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

export default AddService;
