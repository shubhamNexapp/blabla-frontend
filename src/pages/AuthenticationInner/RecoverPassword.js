import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

// import images
import logo from "../../assets/images/Instaone.png";
import CarouselPage from './CarouselPage';

const RecoverPassword = () => {
    //meta title
    document.title = "Recover Password | Minia - React Admin & Dashboard Template";
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
                                                <h5 className="mb-0">Reset Password</h5>
                                                <p className="text-muted mt-2">Reset Password with InstaOne.</p>
                                            </div>
                                            <div className="alert alert-success text-center my-4" role="alert">
                                                Enter your Email and instructions will be sent to you!
                                            </div>
                                            <form className="custom-form mt-4">
                                                <div className="mb-3">
                                                    <label className="form-label">Email</label>
                                                    <input type="email" className="form-control" id="email" placeholder="Enter Email Id" />
                                                </div>
                                                <div className="mb-3 mt-4">
                                                    <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Reset</button>
                                                </div>
                                            </form>

                                            <div className="mt-5 text-center">
                                                <p className="text-muted mb-0">Remember It ?  <Link to="/login"
                                                    className="text-primary fw-semibold"> Sign In </Link> </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 mt-md-5 text-center">
                                            <p className="mb-0">© {new Date().getFullYear()} InstaOne   . Powered By Nexapp Technologies Pvt Ltd.</p>
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

export default RecoverPassword;