import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";
import { errorStyle } from "../../helpers/common_constants";

const EditCustomer = () => {
  const { id } = useParams(); // Fetch the id parameter from the route
  const location = useLocation(); // Access the location object to get state
  const { state } = location;
  console.log("State in EditCustomer:", state);
  const navigate = useNavigate();

  // console.log(state.row.assign); // Check what is being passed in state

  if (!state || !state.row) {
    return <div>No data available for editing</div>;
  }

  // Example of accessing data fields

  document.title = "Edit Customer ";

  const [selectedFiles, setselectedFiles] = useState([]);
  const [siteAddress, setSiteAddress] = useState("");
  const animatedComponents = makeAnimated();

  const optionGroup = [
    {
      // label: "Group 1",
      options: [
        {
          label: "67835",
          value: "site1",
          siteId: "123",
          siteAddress: "Nexapp Tech,Pune",
        },
        {
          label: "64815",
          value: "site2",
          siteId: "124",
          siteAddress: "Nano Stuff, Pune",
        },
      ],
    },
    {
      // label: "Group 2",
      options: [
        {
          label: "56734",
          value: "site3",
          siteId: "125",
          siteAddress: "Bank Of India, Kolhapur",
        },
        {
          label: "98765",
          value: "site4",
          siteId: "126",
          siteAddress: "TCS, Pune",
        },
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

  const [initialValues, setInitialValues] = useState({
    customerName: "",
    location: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (state?.row) {
      setInitialValues({
        customerName:
          `${state?.row?.firstName} ${state?.row?.firstName} ` || "",
        location: state?.row?.location || "",
        email: state?.row?.email || "",
        phone: state?.row?.phone || "",
      });
    }
  }, [state]);

  const validationType = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // This is important to update form values after initialization

    initialValues: {
      customerName: state.row.customerName,
      location: state.row.location,
      email: state.row.email,
      phone: state.row.phone,
    },
    validationSchema: Yup.object().shape({
      customerName: Yup.string().required("This value is required"),
      location: Yup.string().required("This value is required"),
      email: Yup.string().required("This value is required"),
      phone: Yup.string().required("This value is required"),
    }),
    onSubmit: (values) => {
      console.log("values===", values);
    },
  });

  const goToCustomerPage = () => {
    navigate("/admin/customer");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Customer" breadcrumbItem="Edit Customer" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-2">Edit Customer</h4>
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
                      {/* <h5 className="mb-2">Customer Information</h5> */}
                      <Col>
                        <div className="mb-3">
                          <Label>Customer Name</Label>
                          <Input
                            id="customerName"
                            name="customerName"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.customerName || ""}
                          />
                          {validationType.touched.customerName &&
                            validationType.errors.customerName ? (
                            <span style={errorStyle}>
                              {validationType.errors.customerName}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col>
                        <div className="mb-3">
                          <Label>Location</Label>
                          <Input
                            id="location"
                            name="location"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.location || ""}
                          />
                          {validationType.touched.location &&
                            validationType.errors.location ? (
                            <span style={errorStyle}>
                              {validationType.errors.location}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-">
                      {/* <h5 className="mb-2">Contact Information</h5> */}
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Email Id</Label>
                          <Input
                            id="email"
                            name="email"
                            type="text"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.email || ""}
                          />
                          {validationType.touched.email &&
                            validationType.errors.email ? (
                            <span style={errorStyle}>
                              {validationType.errors.email}
                            </span>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Mobile Number</Label>
                          <Input
                            name="phone"
                            label="phone"
                            id="phone"
                            type="number"
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.phone || ""}
                          />
                          {validationType.touched.phone &&
                            validationType.errors.phone ? (
                            <span style={errorStyle}>
                              {validationType.errors.phone}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        onClick={goToCustomerPage}
                        type="reset"
                        color="secondary"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" color="primary">
                        Edit Customer
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

export default EditCustomer;
