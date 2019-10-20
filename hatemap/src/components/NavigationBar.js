import React from 'react';
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import styled from 'styled-components';
const Styles = styled.div`
  .navbar { background-color: #222; }
  a, .navbar-nav, .navbar-light .nav-link {
    color: #26b3ff;
    &:hover { color: white; }
  }
  .navbar-brand {
    font-size: 1.4em;
    color: #26b3ff;
    &:hover { color: white; }
  }
  .form-right {
    position: absolute !important;
    top: 10px;
    right: 1380px;
    width: 200px;
  }
  form-left {
    position: absolute !important;
      top: 10px;
    right: 1600px;
    width: 200px;
  }
`;
export const NavigationBar = () => (
    <Styles>
        <Navbar expand="lg" className='navbar-front'>
            <Navbar.Brand href="/">HateMap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Item><Nav.Link href="/about">About</Nav.Link></Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </Styles>
)
