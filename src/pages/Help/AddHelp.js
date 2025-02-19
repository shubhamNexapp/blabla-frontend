import React, { useState } from "react";

import "../../assets/scss/pages/ticket.scss";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Button,
  Form,
  Input,
  CardHeader,
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  helpValidation,
  ticketIDValidation,
} from "../../customValidations/customValidations";
import loader from "../../assets/images/instaone-loader.svg";
import {
  errorStyle,
  LoaderHide,
  LoaderShow,
} from "../../helpers/common_constants";
import { postAPI } from "../../Services/Apis";
import { getUserDetails } from "../../common/utility";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const AddHelp = () => {
  document.title = "Instaone";

  const style = {
    maxHeight: "150px",
    minHeight: "100px",
    resize: "none",
    padding: "9px",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  const [value, setValue] = React.useState("engineer");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const validationType = useFormik({
    initialValues: {
      helpDescription: "",
      ticketID: "",
    },

    validationSchema: Yup.object().shape({
      helpDescription: helpValidation,
      ticketID:
        value === "engineer"
          ? Yup.string().required("Ticket ID is required")
          : Yup.string(),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const customerId = getUserDetails()?.userId;
        LoaderShow();

        const data = {
          role: "customer",
          customerId: customerId,
          ticketID: values.ticketID,
          helpDescription: values.helpDescription,
          isComplaintAgainst: value,
        };

        const response = await postAPI("help/add-help", data);
        if (response.statusCode === 200) {
          toast.success(response.message);
          resetForm();
          LoaderHide();
          setValue("engineer");
        }
      } catch (error) {
        toast.error(error.message);
        LoaderHide();
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Customer" breadcrumbItem="Add Help" />
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
                  <h4 className="card-title mb-2">
                    Help Line Number : <b>18002109991 / 020 6762 9999</b>
                  </h4>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validationType.handleSubmit();
                      //   return false;
                    }}
                  >
                    {value === "engineer" ? (
                      <Row className="mb-4">
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label>Add Ticket ID</Label>
                            <Input
                              id="ticketID"
                              name="ticketID"
                              type="number"
                              onChange={validationType.handleChange}
                              onBlur={validationType.handleBlur}
                              value={validationType.values.ticketID || ""}
                            />
                            {validationType.errors.ticketID ? (
                              <span style={errorStyle}>
                                {validationType.errors.ticketID}
                              </span>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                    ) : null}

                    <Row className="mb-4">
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label>Add Help Description</Label>
                          <Input
                            id="helpDescription"
                            name="helpDescription"
                            type="textarea"
                            style={style}
                            onChange={validationType.handleChange}
                            onBlur={validationType.handleBlur}
                            value={validationType.values.helpDescription || ""}
                          />
                          {validationType.errors.helpDescription ? (
                            <span style={errorStyle}>
                              {validationType.errors.helpDescription}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <FormControl>
                          <Label>Add complaint against :</Label>
                          <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={handleChange}
                          >
                            <FormControlLabel
                              value="engineer"
                              control={<Radio />}
                              label="ENGINEER"
                            />
                            <FormControlLabel
                              value="instaOne"
                              control={<Radio />}
                              label="INSTAONE"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Col>
                    </Row>
                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary">
                        Send
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

export default AddHelp;
