import React, {useState, useEffect} from 'react'
import {Alert} from 'react-bootstrap'
import Axios from 'axios';

const URL = process.env.REACT_APP_URL

export default function UserProfile({user}) {
  const [organization, setOrganization] = useState({})
  const [error, setError] = useState(null)

  // useEffect(() => {
  //   let mounted = true
  //   getUserOrganization(user.organization)
  //   return () => {
  //     mounted = false
  //   }
  // }, [])

  // async function getUserOrganization(id){
  //   try {
  //     let token = localStorage.getItem('token');
  //      //credentials will be an obj that takes email & password
  //     let result = await Axios.get(`${URL}/organizations/${id}`, {
  //       headers: {
  //         "x-auth-token": token
  //       }
  //     })
  //     setOrganization(result.data.organization)
  //   } catch (error) {
  //     setError(error.response.data.message)
  //   }
  // };
  return (
    <div className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <h1>User Profile</h1>
        Name: {user.firstname} {user.lastname}<br />
        Organization: {user.organization.name}
    </div>
  )
}
