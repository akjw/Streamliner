import React, {useState, useEffect}  from 'react'
import {Row, Form, Button, Container} from 'react-bootstrap'
import Axios from 'axios';

const URL = process.env.REACT_APP_URL



export default function Register ({ registerHandler }){
  const [userInfo, setUserInfo] = useState({firstname: '', lastname: '', email: '', password: '', organization: ''})
  const [organizations, setOrganizations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getOrganizations();
    setIsLoading(false)
  }, [])

  function changeHandler(e){
    setUserInfo({...userInfo, [e.target.name]: e.target.value})
  }

  async function getOrganizations(){
    try {
      let result = await Axios.get(`${URL}/organizations`);
      setOrganizations(result.data.organizations)
    } catch (error) {
      console.log(error)
      // setError(error.response.data.message)
    }
  };
    return (
      <div>
         <h1>Register</h1>
         <div>
          {!isLoading &&     
          <Container>
          <Row>
            <Form.Control name="firstname" type="text" onChange={changeHandler} placeholder="First Name"/>
          </Row>
          <Row>
            <Form.Control name="lastname" type="text" onChange={changeHandler} placeholder="Last Name"/>
          </Row>
          <Row>
            <Form.Control name="email" type="email" onChange={changeHandler} placeholder="Email"/>
          </Row>
          <Row>
            <Form.Control name="password" type="password" onChange={changeHandler} placeholder="Password"/>
          </Row>
          <Row>
              <select onChange={changeHandler} name="organization">
                <option value="">Select Organization</option>
                  {organizations.map((organization, i) => (
                    <option key={i} value={organization._id}>{organization.name}</option>
                  ))}
              </select>
          </Row>
          <Row>
            <Button variant="primary" onClick={()=> registerHandler(userInfo)}>Register</Button>
          </Row>
          </Container>}
        </div>
      </div>
    )
  }