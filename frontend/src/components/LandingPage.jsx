import React, {useEffect} from 'react'
import Wave from '../wave.png'


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
      <div className="nav-landing">
        <h1>Hello.</h1>
      </div>
    </div>
  )
}
