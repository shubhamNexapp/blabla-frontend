import React, { useState } from "react";
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

const AddTeam = () => {
  // meta title
  document.title = "Instaone";

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
      username: "",
      name: "",
      email: "",
      localname: "",
      work: "",
      phonenumber: "",
      service: "",
      status: "",
      assign: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("This value is required"),
      name: Yup.string().required("This value is required"),
      localname: Yup.string().required("This value is required"),
      email: Yup.string().required("This value is required"),
      work: Yup.string().required("This value is required"),
      status: Yup.string().required("This value is required"),
      phonenumber: Yup.string().required("This value is required"),
      service: Yup.string().required("This value is required"),
      assign: Yup.string().required("This value is required"),
    }),
    onSubmit: (values) => {
      console.log("values", values);
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Team Memebers" breadcrumbItem="Add Team Members" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-2">Add Team Members</h4>
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
                      <h5 className="mb-2">Team Information</h5>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Name</Label>
                          <Input
                            name="username"
                            placeholder=""
                            readOnly
                            type="text"
                            onChange={validationType.handleChange}
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Mail ID</Label>
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
                          <Label>Mobile No.</Label>
                          <Input
                            name="name"
                            type="text"
                            placeholder=""
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.name || ""}
                            invalid={
                              validationType.touched.name &&
                                validationType.errors.name
                                ? true
                                : false
                            }
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


                    <Row>
                      <h5 className="mb-2">Job Information</h5>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Work
                          </Label>
                          <Input
                            name="work"
                            placeholder=""
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.work || ""}
                            invalid={
                              validationType.touched.work &&
                                validationType.errors.work
                                ? true
                                : false
                            }
                          />
                          {validationType.touched.work &&
                            validationType.errors.work ? (
                            <FormFeedback type="invalid">
                              {validationType.errors.work}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Status
                          </Label>
                          <Input
                            name="status"
                            placeholder=""
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.status || ""}
                            invalid={
                              validationType.touched.status &&
                                validationType.errors.status
                                ? true
                                : false
                            }
                          />
                          {validationType.touched.status &&
                            validationType.errors.status ? (
                            <FormFeedback type="invalid">
                              {validationType.errors.status}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                    </Row>


                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary">
                        Add Team
                      </Button>
                      <Button type="reset" color="secondary">
                        Cancel
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

export default AddTeam;
