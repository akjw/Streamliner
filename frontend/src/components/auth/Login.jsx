import React, { useState } from 'react'
import {Row, Form, Button, Container} from 'react-bootstrap'

export default function Login({ loginHandler }){
  const [loginInfo, setLoginInfo] = useState({email: '', password: ''})
 
  function changeHandler(e){
    setLoginInfo({[e.target.name]: e.target.value})
  }

    return (
      <div>
        <h1>Login</h1>
        <div>
          <Container>
          <Row>
            <Form.Control name="email" type="email" onChange={changeHandler} />
          </Row>
          <Row>
            <Form.Control name="password" type="password" onChange={changeHandler}/>
          </Row>
          <Row>
            <Button variant="primary" block onClick={()=> loginHandler(loginInfo)}>Login</Button>
          </Row>
          </Container>
        </div>
      </div>
    )
  }
