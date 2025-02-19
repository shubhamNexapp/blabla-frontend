import React, { useState } from 'react';
import styled from 'styled-components';
import { Container, Col, Row } from "reactstrap";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,

  NavbarText,
} from 'reactstrap';
// Styled Components for the Navigation styles
const Navbarstyle = styled.nav`
  padding: 15px;
  transition: all 0.8s;

  &.navbar-default {
    background-color: #fff;
    border-color: rgba(231, 231, 231, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  }

  .navbar-brand {
    font-family: "Raleway", sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #333;
    text-transform: uppercase;
  }

  .navbar-nav > li > a {
    font-family: "Lato", sans-serif;
    text-transform: uppercase;
    color: #555;
    font-size: 15px;
    font-weight: 400;
    padding: 8px 2px;
    border-radius: 0;
    margin: 9px 20px 0;
    position: relative;

    &:after {
      display: block;
      position: absolute;
      left: 0;
      bottom: -1px;
      width: 0;
      height: 2px;
      background: linear-gradient(to right, #6372ff 0%, #5ca9fb 100%);
      content: '';
      transition: width 0.2s;
    }

    &:hover:after {
      width: 100%;
    }
  }

  .navbar-toggle {
    border-radius: 0;
  }

  .navbar-toggle:hover,
  .navbar-toggle:focus {
    background-color: #fff;
    border-color: #608dfd;
  }

  .navbar-toggle:hover > .icon-bar {
    background-color: #608dfd;
  }

  .navbar-nav .active > a {
    background-color: transparent;

    &:after {
      width: 100% !important;
    }
  }
    a {
    color: #608dfd;
    font-weight: 400;
  }

  a:hover,
  a:focus {
    text-decoration: none;
    color: #608dfd;
  }
    ul,
ol {
  list-style: none;
}

ul,
ol {
  padding: 0;
  webkit-padding: 0;
  moz-padding: 0;
}
`;

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <Navbar id="menu" className="navbar navbar-default navbar-fixed-top">
      <Container>
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle "
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand page-scroll" href="#page-top">
            React Landing Page
          </a>
        </div>

        <div

          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right" style={{ display: 'flex' }}>
            <li>
              <a href="#features" className="page-scroll">
                Features
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll">
                Services
              </a>
            </li>
            <li>
              <a href="#portfolio" className="page-scroll">
                Gallery
              </a>
            </li>
            <li>
              <a href="#testimonials" className="page-scroll">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#team" className="page-scroll">
                Team
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </Navbar>


  );
};