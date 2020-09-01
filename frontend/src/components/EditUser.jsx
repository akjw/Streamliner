import React, {useState, useEffect} from 'react'
import {Alert, Container, Row, Col, InputGroup, FormControl, Button} from 'react-bootstrap'
import { Card, Tooltip, Popconfirm, Collapse } from 'antd';
import { EditOutlined, DeleteFilled, PlusSquareTwoTone } from '@ant-design/icons';
import Axios from 'axios';
import moment from 'moment'

const URL = process.env.REACT_APP_URL
const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function EditUser({user, setGlobalError, setRedirect}) {
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({firstname: '', lastname: '', email: '', password: ''})

  useEffect(() => {
    getUserProfile()
  }, [])
  
  async function getUserProfile(){
    try {
       //credentials will be an obj that takes email & password
       let token = localStorage.getItem('token');
      let result = await Axios.get(`${URL}/auth/user`, {
        headers: {
          "x-auth-token": token
        }
      })
      setUserInfo(result.data.user)
      setIsLoading(false)
      console.log('from get user', result.data.user)
    } catch (error) {
      // setGlobalError(error.response.data.message)
    }
  };

  function changeHandler(e){
    setUserInfo({...userInfo, [e.target.name]: e.target.value})
    console.log(userInfo)
  }

  async function submitHandler(credentials){
    try {
      if (credentials.firstname.trim() == "" || credentials.lastname.trim() == "" || credentials.email.trim() == "" || credentials.password == undefined){
        setGlobalError('Fields cannot be empty')
        return
      } else if (!emailPattern.test(credentials.email)){
        setGlobalError('Please enter valid email address')
        return
      } else if (credentials.password.length < 6){
        setGlobalError('Password must be at least 6 characters long')
        return
      }
      let token = localStorage.getItem('token');
      await Axios.put(`${URL}/users/edit`, credentials, {headers: {
        "x-auth-token": token,
      }});
      setGlobalError(null)
      setRedirect(true)
    } catch (error) {
      console.log(error)
      // setGlobalError(error.response.data.message)
    }
  };

  return (
   <div>
     {!isLoading && <Container className="mt-4">
    <h1>Edit Account</h1>
    <Row className="h-100">
      <Col md="6 offset-3" my="auto">
      <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">First Name</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                 defaultValue={userInfo.firstname}
                name="firstname"
                onChange={changeHandler}
              />
        </InputGroup>

        <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Last Name</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                defaultValue={userInfo.lastname}
                name="lastname"
                onChange={changeHandler}
              />
        </InputGroup>

        <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  defaultValue={userInfo.email}
                  name="email"
                  onChange={changeHandler}
                />
          </InputGroup>
        <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  type="password"
                  name="password"
                  onChange={changeHandler}
                />
          </InputGroup>
        <Button variant="primary" className="form-control mt-4" onClick={()=> submitHandler(userInfo)}>Submit</Button>
        </Col>
        </Row>
     </Container>}
    </div>
  )
}

export default EditUser
