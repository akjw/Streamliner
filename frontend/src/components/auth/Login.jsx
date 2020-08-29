import React, { useState } from 'react'
import {Row, Form, Button, Container} from 'react-bootstrap'

export default function Login({ loginHandler }){
  const [loginInfo, setLoginInfo] = useState(
    { email: "",
      password: ""
    }
    )
 
  function changeHandler(e){
    console.log(e.target.value)
    setLoginInfo({...loginInfo, [e.target.name]: e.target.value})
  }

  function login(){
    console.log('login info here', loginInfo)
    loginHandler(loginInfo)
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
            <Button variant="primary" block onClick={login}>Login</Button>
          </Row>
          </Container>
        </div>
      </div>
    )
  }
