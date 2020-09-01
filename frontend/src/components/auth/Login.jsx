import React, { useState } from 'react'
import {Row, FormControl, Button, Container, Col, InputGroup} from 'react-bootstrap'

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
        <div>
          <Container className="mt-4">
          <h1>Login</h1>
          <Row>
            <Col md="6 offset-3">
            <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="amylee@email.com"
                      name="email"
                      onChange={changeHandler}
                    />
              </InputGroup>
            <InputGroup className>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="********"
                      type="password"
                      name="password"
                      onChange={changeHandler}
                    />
              </InputGroup>
              <Button variant="primary" className="form-control mt-4" onClick={login}>Login</Button>
            </Col>
            {/* <Form.Control name="email" type="email" onChange={changeHandler} />
          </Row>
          <Row>
            <Form.Control name="password" type="password" onChange={changeHandler}/>
          </Row>
          <Row> */}
          </Row>
          </Container>
        </div>
      </div>
    )
  }
