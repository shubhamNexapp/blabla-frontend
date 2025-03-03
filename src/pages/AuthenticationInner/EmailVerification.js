import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

//import images 
import logo from "../../assets/images/Instaone.png";
import CarouselPage from './CarouselPage';

const EmailVerification = () => {
    //meta title
    document.title = "Email Verification | InstaOne - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="auth-page">
                <Container fluid className="p-0">
                    <Row className="g-0">
                        <Col lg={4} md={5} className="col-xxl-4">
                            <div className="auth-full-page-content d-flex p-sm-5 p-4">
                                <div className="w-100">
                                    <div className="d-flex flex-column h-100">
                                        <div className="mb-4 mb-md-5 text-center">
                                            <Link to="/" className="d-block auth-logo">
                                                <img src={logo} alt="" height={55} width={150} />
                                            </Link>
                                        </div>
                                        <div className="auth-content my-auto">
                                            <div className="text-center">
                                                <div className="avatar-lg mx-auto">
                                                    <div className="avatar-title rounded-circle bg-light">
                                                        <i className="bx bxs-envelope h2 mb-0 text-primary"></i>
                                                    </div>
                                                </div>
                                                <div className="p-2 mt-4">
                                                    <h4>Verify your email</h4>
                                                    <p>We have sent you verification email <span className="fw-bold">example@abc.com</span>, Please check it</p>
                                                    <div className="mt-4">
                                                        <Link to="/" className="btn btn-primary w-10">Verify email</Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-5 text-center">
                                                <p className="text-muted mb-0">Didn't receive an email ? <Link to="#"
                                                    className="text-primary fw-semibold"> Resend </Link> </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 mt-md-5 text-center">
                                            <p className="mb-0">© {new Date().getFullYear()}InstaOne . Powered By Nexapp Technologies Pvt Ltd.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <CarouselPage />
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EmailVerification;