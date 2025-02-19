import React, { useState } from "react";
import styled from "styled-components";
import { Col, Row } from "reactstrap";
import { postAPI } from "../../../Services/Apis";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";

import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import { toast } from "react-toastify";
const Container = styled.div`
  .section-title {
    margin-bottom: 70px;
    .h2 {
      position: relative;

      padding-top: 32px;
      margin-bottom: 15px;
      padding-bottom: 15px;
      &::after {
        position: absolute;
        content: "";
        background: linear-gradient(to right, #333a40 0%, #fdfcfb 100%);

        height: 3px;
        width: 250px;
        bottom: 0;
        margin-left: -32px;
        left: 35%;
      }
    }
  }
`;

export const Contact = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Live validation for phone field
    if (name === "phone") {
      if (!/^\d*$/.test(value)) {
        return; // Ignore non-numeric input
      }
      if (value.length > 10) {
        return; // Limit to 10 digits
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let formErrors = {};

    // Validate email
    if (!formData.email) {
      formErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      formErrors.email = "Invalid email address.";
    }

    // Validate phone
    if (!formData.phone) {
      formErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      formErrors.phone = "Phone number must be exactly 10 digits.";
    }

    setErrors(formErrors);

    // Return true if no errors
    return Object.keys(formErrors).length === 0;
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors.");
      return;
    }
    try {
      const response = await postAPI("auth/send-request", formData);

      if (response.statusCode === 200) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        toast.success(response?.message);
      }
    } catch (error) {
      toast.error("An error occurred while sending the email.");
    }
  };

  const [tcmodal, settcModal] = useState(false);

  const toggletcModal = () => settcModal(!tcmodal);
  const [pvmodal, setpvModal] = useState(false);

  const togglepvModal = () => setpvModal(!pvmodal);

  const [rtmodal, setrtModal] = useState(false);

  const togglertModal = () => setrtModal(!rtmodal);

  return (
    <div>
      <div id="contact">
        <Container className="container">
          <Row>
            <Col className=" col-md-7">
              <div className="section-title">
                <h2 className="h2">Get In Touch</h2>
                <p>
                  Please fill out the form below to send us an email and we will
                  get back to you as soon as possible.
                </p>
              </div>
              <form onSubmit={sendEmail}>
                <Row className="row mb-4">
                  <Col className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </Col>
                  <Col className="col-md-6">
                    <div className="form-group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {errors.email && (
                        <p className="help-block text-danger">{errors.email}</p>
                      )}
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <input
                        type="number"
                        id="phone"
                        name="phone"
                        className="form-control"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                      {errors.phone && (
                        <p className="help-block text-danger">{errors.phone}</p>
                      )}
                    </div>
                  </Col>
                </Row>
                <div className="form-group">
                  <textarea
                    name="message"
                    id="message"
                    className="form-control"
                    rows="4"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <p className="help-block text-danger"></p>
                </div>
                {/* <div id="success"></div> */}
                <button type="submit" className="btn btn-custom btn-lg">
                  Send Message
                </button>
              </form>
            </Col>
            <Col></Col>
            <Col className="col-md-4 col-md-offset-1 contact-info">
              <div className="contact-item">
                <h3 className="h3">Contact Info</h3>
                <p>
                  <span>
                    <i className="fa fa-map-marker"></i> Address
                  </span>
                  {props.data ? props.data.address : "loading"}
                </p>
              </div>
              <div className="contact-item">
                <p>
                  <span>
                    <i className="fa fa-phone"></i> Phone
                  </span>{" "}
                  {props.data ? props.data.phone : "loading"}
                </p>
              </div>
              <div className="contact-item">
                <p>
                  <span>
                    <i className="fa fas fa-envelope"></i> Email
                  </span>{" "}
                  {props.data ? props.data.email : "loading"}
                </p>
              </div>
            </Col>

            <Row
              style={{
                display: "flex",
                maxWidth: "500px",
                alignItems: "center",
                margin: "0px auto",
                textAlign: "center",
              }}
            >
              <Col onClick={toggletcModal} style={{ cursor: "pointer" }}>
                Terms and Condition
              </Col>
              <Col onClick={togglepvModal} style={{ cursor: "pointer" }}>
                Privacy Policy
              </Col>
              <Col onClick={togglertModal} style={{ cursor: "pointer" }}>
                Return Policy
              </Col>
            </Row>
          </Row>
          {/* <Row style={{ display: 'flex', maxWidth: '500px', justifyContent: 'center' }}>
            <Col>Terms and Condition</Col>
            <Col>Privacy Policy</Col>
            <Col>Return Policy</Col>
          </Row> */}
          <Col className="col-md-12">
            <div className="row">
              <div className="social">
                <ul>
                  <li style={{ width: "50px" }}>
                    <a
                      href={props.data ? props.data.facebook : "/"}
                      target="_blank"
                    >
                      {/* <i className="fas fa-facebook"></i>F */}
                      {/* <i style={{ color: 'blue', backgroundColor: 'white' }} className="mdi mdi-24px mdi-facebook"></i> */}
                      {/* <img /> */}
                      <MDBBtn
                        outline
                        color="light"
                        floating
                        className="m-1 text-white"
                        role="button"
                      >
                        <MDBIcon fab icon="facebook-f" />
                      </MDBBtn>
                    </a>
                  </li>
                  <li>
                    <a
                      href={props.data ? props.data.twitter : "/"}
                      target="_blank"
                    >
                      {/* <i className="fas fa-twitter"></i> */}

                      {/* <i style={{ color: 'black' }} className="mdi mdi-24px mdi-twitter"></i> */}
                      <MDBBtn
                        outline
                        color="light"
                        floating
                        className="m-1 text-white"
                        role="button"
                      >
                        <MDBIcon fab icon="twitter" />
                      </MDBBtn>
                    </a>
                  </li>
                  {/* <li>
                    <a href={props.data ? props.data.twitter : "/"}>
                      <MDBBtn outline color="light" floating className='m-1 text-white' role='button'>
                        <MDBIcon fab icon='github' />
                      </MDBBtn>
                    </a>
                  </li> */}

                  <li>
                    <a
                      href={props.data ? props.data.linkedln : "/"}
                      target="_blank"
                    >
                      {/* <i className="fas fa-youtube"></i> */}
                      {/* <i style={{ color: 'red' }} className="mdi mdi-24px mdi-youtube"></i> */}
                      <MDBBtn
                        outline
                        color="light"
                        floating
                        className="m-1 text-white"
                        role="button"
                      >
                        <MDBIcon fab icon="linkedin-in" />
                      </MDBBtn>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Container>
      </div>

      <div>
        <Modal isOpen={tcmodal} toggle={toggletcModal}>
          <ModalHeader toggle={toggletcModal}>Terms and Conditions</ModalHeader>
          <ModalBody>
            <p>
              1. Introduction Welcome to Nexapp Technologies Private limited .
              By accessing or using our services, you agree to be bound by these
              Terms and Conditions. Please read them carefully.
            </p>
            <p>
              {" "}
              2. Services Offered We provide services such as router
              installation, PC setup, printer installation, and other technical
              support. Our services are available only within specified service
              areas. All bookings are subject to technician availability.
            </p>
            <p>
              3. Booking and Payments Customers must book services through our
              portal and provide accurate contact and address details. Full
              payment is required at the time of booking. We accept payments via
              [mention your payment methods, e.g., Razorpay, UPI, credit/debit
              cards].
            </p>
            <p>
              4. Cancellations and Rescheduling Cancellations must be made at
              least 24 hours before the scheduled service time. Rescheduling is
              allowed free of charge if requested 24 hours in advance. Failure
              to cancel or reschedule on time will result in the booking being
              marked as completed, with no refund provided.
            </p>
            <p>
              5. No Refund Policy As our services are performed on-site and
              completed upon delivery, no refunds will be issued once the
              service is provided. In rare cases, if the service is not
              delivered due to our fault or remains incomplete despite
              rectification attempts, a partial refund or reattempt may be
              offered at the management’s discretion.
            </p>
            <p>
              6. Service Conditions Customers must ensure access to the site and
              provide necessary equipment and information for service
              completion. If our technician is unable to perform the service due
              to the customer’s fault (e.g., denied access), the booking will be
              marked as completed, and no refund will be provided.
            </p>
            <p>
              7. Liability We are not responsible for any pre-existing issues
              with equipment or systems being serviced. Our liability is limited
              to the service provided.
            </p>
            <p>
              8. Changes to Terms and Conditions We reserve the right to modify
              these terms at any time. Any changes will be updated on our
              portal, and continued use of our services implies acceptance of
              the updated terms.
            </p>
          </ModalBody>
        </Modal>
      </div>

      <div>
        <Modal isOpen={pvmodal} toggle={togglepvModal}>
          <ModalHeader toggle={togglepvModal}>Privacy Policy</ModalHeader>
          <ModalBody>
            <p>
              At Nexapp Technologies Private Limited. we value your privacy and
              are committed to protecting your personal data. This Privacy
              Policy outlines how we collect, use, store, and protect your
              information when you use our services.
            </p>

            <h6>1. Information We Collect</h6>
            <p>
              {" "}
              We collect the following types of information to provide and
              improve our services{" "}
            </p>
            <ol>
              <li>
                Personal Information: Name, address, email, phone number, and
                payment details.
              </li>
              <li>
                Service-Related Information: Information regarding your service
                bookings, including dates, times, and service addresses.
              </li>
              <li>
                Technical Information: IP address, browser type, and device
                information when accessing our website.
              </li>
            </ol>

            <h6>2. How We Use Your Information</h6>
            <p> We use your data to: </p>
            <ol>
              <li>Process bookings and provide requested services.</li>
              <li>Improve our website and service offerings.</li>
              <li>
                Send notifications about your service appointments and status
                updates.
              </li>
              <li>Respond to customer inquiries and provide support.</li>
              <li>
                Process payments securely through third-party payment gateways
                like Razor-pay.
              </li>
              <li>Send promotional offers (only if you otp-in).</li>
            </ol>

            <h6>3. Sharing Your Information</h6>
            <p>
              {" "}
              We do not sell or share your personal information with third
              parties, except in the following cases:{" "}
            </p>
            <ol>
              <li>
                With payment gateway providers for transaction processing.
              </li>
              <li>
                With technicians or service providers to fulfil your booking.
              </li>
              <li>
                If required by law or to protect the rights and safety of our
                business and customers.
              </li>
            </ol>

            <h6>4. Data Security </h6>
            <p>
              {" "}
              We take reasonable measures to secure your personal information
              from un-authorized access, disclosure, or misuse. However, no
              method of transmission over the Internet is completely secure.
            </p>

            <h6>5. Cookies</h6>
            <p>
              {" "}
              We use cookies to enhance your browsing experience and analyse
              site traffic. You can choose to disable cookies in your browser
              settings, though some features of our website may not function
              properly.
            </p>

            <h6>6. Your Rights</h6>
            <p> You have the right to : </p>
            <ol>
              <li>Access, update, or delete your personal information.</li>
              <li>Opt-out of receiving promotional emails at any time.</li>
              <li>Request a copy of the data we hold about you. </li>
            </ol>

            <h6>7. Third-Party Links </h6>
            <p>
              {" "}
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices of these sites, and we
              encourage you to read their privacy policies.
            </p>

            <h6>8. Changes to This Privacy Policy </h6>
            <p>
              {" "}
              We reserve the right to update this policy from time to time.
              Changes will be posted on this page, and your continued use of our
              services constitutes acceptance of the updated policy.
            </p>
            <h6>9. Contact Us</h6>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at ' no-reply@instaone.net ' By using our
              services, you agree to the collection and use of your information
              as outlined in this policy
            </p>
          </ModalBody>
        </Modal>
      </div>

      <div>
        <Modal isOpen={rtmodal} toggle={togglertModal}>
          <ModalHeader toggle={togglertModal}>Return Policy</ModalHeader>
          <ModalBody>
            <p>
              At Instaone Nexapp Technologies Private Limited, we take pride in
              providing high-quality services such as router installation, PC
              installation, printer installation, and other technical support
              services. Due to the nature of these services, we do not offer
              refunds once the service has been provided.
            </p>

            <h6>Cancellations and Rescheduling</h6>

            <ol>
              <li>
                {" "}
                Cancellations: {"  "}
                If you need to cancel a booking, please notify us at least 24
                hours in advance. Cancellations made within this time frame will
                not incur any penalty, and the service can be rescheduled free
                of charge.
              </li>
              <li>
                Missed Appointments: If you fail to cancel or reschedule before
                the service appointment, or if our technician is unable to
                access your premises, the booking will be marked as completed,
                and no refund will be provided.
              </li>
            </ol>

            <h6>Exceptions</h6>
            <p>
              {" "}
              Refunds or adjustments may only be considered under the following
              exceptional circumstances:{" "}
            </p>
            <ol>
              <li>
                The service was not delivered at the scheduled time due to a
                fault on our side (e.g., technician unavailability).{" "}
              </li>
              <li>
                The service provided was incomplete or incorrect, and our
                attempts to rectify the issue were unsuccessful.
              </li>
            </ol>
            <p>
              In such rare cases, a partial refund or free service reattempt may
              be offered at the sole discretion of our management.
            </p>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};
