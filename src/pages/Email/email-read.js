import React from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col, Card, CardBody } from "reactstrap"

//Import Image
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img4 from "../../assets/images/small/img-4.jpg";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//Import Email Sidebar
import EmailSideBar from "./email-sidebar"

//Import Email Topbar
import EmailToolbar from "./email-toolbar"

const EmailRead = () => {
  //meta title
  document.title = "Read Email | Minia - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Email" breadcrumbItem="Read Email" />

          <Row>
            <Col xs="12">
              {/* Render Email SideBar */}
              <EmailSideBar />

              <div className="email-rightbar mb-3">
                <Card>
                  {/* Render Email Top Tool Bar */}
                  <EmailToolbar />

                  <CardBody>
                    <div className="d-flex align-items-center mb-4">
                      <div className="flex-shrink-0 me-3">
                          <img className="rounded-circle avatar-sm" src={avatar2} alt="Generic placeholder image1" />
                      </div>
                      <div className="flex-grow-1">
                          <h5 className="font-size-14 mb-0">Humberto D. Champion</h5>
                          <small className="text-muted">support@domain.com</small>
                      </div>
                    </div>

                    <h4 className="font-size-16">This Week's Top Stories</h4>

                    <p>Dear Lorem Ipsum,</p>
                    <p>Praesent dui ex, dapibus eget mauris ut, finibus vestibulum enim. Quisque arcu leo, facilisis in fringilla id, luctus in tortor. Nunc vestibulum est quis orci varius viverra. Curabitur dictum volutpat massa vulputate molestie. In at felis ac velit maximus convallis.
                    </p>
                    <p>Sed elementum turpis eu lorem interdum, sed porttitor eros commodo. Nam eu venenatis tortor, id lacinia diam. Sed aliquam in dui et porta. Sed bibendum orci non tincidunt ultrices. Vivamus fringilla, mi lacinia dapibus condimentum, ipsum urna lacinia lacus, vel tincidunt mi nibh sit amet lorem.</p>
                    <p>Sincerly,</p>
                    <hr/>

                    <Row>
                      <Col xl="2" xs="6">
                        <Card className="border shadow-none">
                          <img
                            className="card-img-top img-fluid"
                            src={img3}
                            alt="Samply"
                          />
                          <div className="py-2 text-center">
                            <a download="img-3.jpg" href={img3} className="fw-medium">Download</a>
                          </div>
                        </Card>
                      </Col>
                      <Col xl="2" xs="6">
                        <Card className="border shadow-none">
                          <img
                            className="card-img-top img-fluid"
                            src={img4}
                            alt="Samply"
                          />
                          <div className="py-2 text-center">
                            <a download="img-4.jpg" href={img4} className="fw-medium">Download</a>
                          </div>
                        </Card>
                      </Col>
                    </Row>

                    <Link to="#" className="btn btn-secondary waves-effect mt-4">
                      <i className="mdi mdi-reply me-1"></i> Reply
                    </Link>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default EmailRead
