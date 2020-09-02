import React from 'react'
import {Navbar, Nav} from 'react-bootstrap'
import { Link } from "react-router-dom";

export default function Navigation({user, logoutHandler, isLanding}) {
  return (
    <Navbar bg="dark" expand="lg" variant="dark" className={isLanding ? `nav-landing` : `nav`}>
    <Navbar.Brand href="/" className={isLanding ? `nav-landing brand` : `nav brand`}>Streamliner</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Link className={isLanding ? `nav-link nav-landing` : `nav-link nav`} to="/dashboard">
            Dashboard
          </Link>
      <Link className={isLanding ? `nav-link nav-landing` : `nav-link nav`}  to="/profile">
        Profile
      </Link>
      <Link className={isLanding ? `nav-link nav-landing` : `nav-link nav`}  to="/projects/new">
        New Project
      </Link>
    </Nav>
    <Nav className={isLanding ? `nav-landing` : `nav`} >
      {user ? (
      <>
      <Nav.Link href="#user" className={isLanding ? `nav-landing` : `nav`}>
        Hello, {user.firstname}!
      </Nav.Link> 
      <Link to="/logout" onClick={logoutHandler} className={isLanding ? `nav-link nav-landing` : `nav-link nav`}>
        Logout
      </Link> 
      </>)
      : (
        <>
          <Link to="/login" className={isLanding ? `nav-link nav-landing` : `nav-link nav`}>
            Login
          </Link>
          <Link to="/register" className={isLanding ? `nav-link nav-landing` : `nav-link nav`}>
            Register
          </Link>
        </>
      ) }
    </Nav>
    </Navbar.Collapse>
  </Navbar>
  )
}