import React, { useState, useEffect } from 'react'
import {Row, FormControl, Button, Container, Col, InputGroup, Card} from 'react-bootstrap'

export default function Login({ loginHandler, setIsLanding }){
  const [loginInfo, setLoginInfo] = useState(
    { email: "",
      password: ""
    }
    )

    useEffect(() => {
      let mounted = true
      setIsLanding(false)
      return() => {
        mounted = false
      }
    })
 
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
                  <Button variant="primary" className="form-control my-4 purple" onClick={login}>Login</Button>
                </Col>
              </Row>
         
          </Container>
        </div>
      </div>
    )
  }
