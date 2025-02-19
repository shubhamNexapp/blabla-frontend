import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';

const FooterCompo = () => {
    return (
        <Container fluid style={{ backgroundColor: '#333a40', color: '#fff', marginTop: '80px', paddingBottom: '10px' }}>
            <Row className='footer-row-wrapper'>
                <Col className='' style={{ maxWidth: '231px' }}>
                    <div className='footer-heading'>For Customer</div>
                    <ul>
                        <li>UC reviews</li>
                        <li>Categories near you</li>
                        <li>Blog</li>
                    </ul>
                </Col>
                <Col className='' style={{ maxWidth: '210px' }}>
                    <div className='footer-heading'>Company</div>
                    <ul>
                        <li>About us</li>
                        <li>Terms & conditions</li>
                        <li>Privacy Policy</li>
                    </ul>

                </Col>
                <Col className='' style={{ maxWidth: '150px' }}>
                    <div className='footer-heading'>For Partner</div>
                    <ul>
                        <li>Resister as a
                            Vender</li>

                    </ul>

                </Col>
                <Col className='' style={{ maxWidth: '244px' }}>
                    <div className='footer-heading'>Get in Touch</div>
                    <ul>
                        <li>020 67629999</li>
                        <li>no-reply@instaone.net</li>
                        <li>Toll Free Number:
                            18002109991
                            (For sales enquiries
                            only)</li>

                    </ul>
                </Col>
                <Col className='' style={{ maxWidth: '305px' }}>
                    <div className='footer-heading'>Social</div>

                </Col>
            </Row>
            <div>    <button className='body-btn' style={{ margin: '30px 40px' }}>Contact us</button></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px 40px' }}>
                <span>Consumer Health Privacy</span>
                <span>Site Map</span>
                <span>Contact us</span>
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Cookie Policy</span>

                <span>InstaOne 2024</span>
            </div>
        </Container >
    )
}

export default FooterCompo