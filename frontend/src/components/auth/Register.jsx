import React, {useState}  from 'react'
import {Row, Form, Button, Container} from 'react-bootstrap'



export default function Register ({ registerHandler }){
  const [userInfo, setUserInfo] = useState({firstname: '', lastname: '', email: '', password: ''})

  function changeHandler(e){
    setUserInfo({...userInfo, [e.target.name]: e.target.value})
  }
    return (
      <div>
         <h1>Register</h1>
         <div>
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
            <Button variant="primary" onClick={()=> registerHandler(userInfo)}>Register</Button>
          </Row>
          </Container>
        </div>
      </div>
    )
  }