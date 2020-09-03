import React, {useState, useEffect} from 'react'
import {Row, Form, Button, Container, Alert, Col, InputGroup, FormControl, Card} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import Axios from 'axios';

const URL = process.env.REACT_APP_URL

function AddOrganization({user, setRedirect, setGlobalError, setIsLanding}) {
  const [organization, setOrganization] = useState({name: ''})

  useEffect(() => {
    let mounted = true
    setIsLanding(false)
    return() => {
      mounted = false
    }
  }, [])

  function changeHandler(e){
    setOrganization({...organization, [e.target.name]: e.target.value})
    console.log('org val', organization)
  }

  async function submitHandler(info){
    try {
     if (info.name.trim() == ""){
        setGlobalError('Name cannot be empty')
        return
     } else {
        let token = localStorage.getItem('token');
        let result = await Axios.post(`${URL}/organizations/new`, info, {headers: {
          "x-auth-token": token,
        }});
        setGlobalError(null)
        setRedirect(true)
      }
    } catch (error) {
      console.log(error)
      // setError(error.response.data.message)
    }
  };
  return (
    <div>
      <Container>
      <Card className="p-4">
      <h1>New Organization</h1>
      <Row>
      <Col md="8 offset-2">
        <Form>
        <Form.Group>
          <Row>
          <Form.Label>Name</Form.Label>
          </Row>
          <Row>
          <Form.Control
            placeholder="Organization A"
            name="name"
            type="text" 
            onChange={changeHandler}
          />
          </Row>
        </Form.Group>
        <Form.Group>
        <Row>
        <Button variant="primary" className="form-control my-4 purple" onClick={()=> submitHandler(organization)}>Save</Button>
        </Row>
        </Form.Group>
        </Form>
      </Col>
      </Row>
      </Card>
      </Container>
    </div>
  )
}

export default AddOrganization
