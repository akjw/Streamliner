import React from 'react'
import {Navbar, Nav} from 'react-bootstrap'
import { Link } from "react-router-dom";

export default function Navigation({user, logoutHandler}) {
  return (
    <Navbar bg="dark" expand="lg" variant="dark" className="nav">
    <Navbar.Brand href="/">Streamliner</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
      <Link className="nav-link" to="/profile">
        Profile
      </Link>
      <Link className="nav-link" to="/projects/new">
        New Project
      </Link>
    </Nav>
    <Nav>
      {user ? (
      <>
      <Nav.Link href="#user">
        Hello, {user.firstname}!
      </Nav.Link> 
      <Link to="/logout" onClick={logoutHandler} className="nav-link">
        Logout
      </Link> 
      </>)
      : (
        <>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </>
      ) }
    </Nav>
    </Navbar.Collapse>
  </Navbar>
  )
}