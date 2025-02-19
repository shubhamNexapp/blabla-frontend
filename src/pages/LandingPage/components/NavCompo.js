import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logoSvg from '../../../assets/images/Instaone.png'






const NavCompo = () => {
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" fixed="top">
            <Container style={{ marginLeft: '50px', marginRight: '80px', maxWidth: '100%' }}>
                <Navbar.Brand href="#home">
                    <img
                        alt=""
                        src={logoSvg}
                        // width="30"
                        height="50"
                        className="d-inline-block align-top"
                    />{' '}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">

                    </Nav>
                    <Nav id='landingNav' >
                        <Nav.Link href="#header" >Home</Nav.Link>
                        <Nav.Link href="#features" >client</Nav.Link>
                        <Nav.Link href="#about">Capability</Nav.Link>
                        <Nav.Link href="#services">Services</Nav.Link>
                        {/* <Nav.Link href="#gallery">Gallery</Nav.Link> */}
                        {/* <Nav.Link href="#testimonials">Testimonials</Nav.Link> */}
                        <Nav.Link href="#team">Team</Nav.Link>
                        <Nav.Link href="#contact">contact</Nav.Link>


                    </Nav>
                    <div className='navcompo'>
                        <a href="/login" className="btn btn-custom btn-lg page-scroll">
                            Sign In
                        </a>

                    </div>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    )
}

export default NavCompo