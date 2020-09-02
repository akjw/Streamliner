import React, {useEffect} from 'react'
import Wave from '../wave.png'
import { Link } from "react-router-dom";
import {Button} from 'react-bootstrap'


export default function LandingPage({setIsLanding}) {
useEffect(() => {
  let mounted = true
  setIsLanding(true)
  return() => {
    mounted = false
  }
}, [])
  return (
    <div className="landing-div">
      <img src={Wave} className="wave"/>
      <div className="nav-landing mt-12 mx-4">
        <div className="d-flex justify-content-end mt-4">
          <div className="row mt-4">
            <div className="col mt-4">
               <p className="landing-header mt-6">We keep things smooth.</p>
               <p className="landing-text">Manage all your projects at every stage — right here.</p>
               <Link to="/register" className="btn btn-outline-light btn-lg nav-landing">
                  Sign up
                </Link>
               {/* <Button variant="outline-light" size="lg" className="nav-landing">Sign up</Button> */}
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
