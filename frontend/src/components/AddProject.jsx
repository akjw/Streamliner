import React, {useState, useEffect} from 'react'
import {Row, Form, Button, Container, Alert} from 'react-bootstrap'
import Axios from 'axios';

const URL = process.env.REACT_APP_URL

function AddProject({user}) {
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [project, setProject] = useState(
      {
        title: '',
        description: '',
        organization: user.organization._id,
        createdBy: user.id,
        members: [],
        startDate: null,
        endDate: null
      }
    )
  
  useEffect(() => {
        getOrganizationUsers(user.organization._id);
  }, [])

  async function getOrganizationUsers(id){
    try {
      let token = localStorage.getItem('token');
      let result = await Axios.get(`${URL}/users/all/${id}`, {headers: {
        "x-auth-token": token,
      }});
      setUsers(result.data.users)
    } catch (error) {
      setError(error.response.data.message)
    }
  };

  function changeHandler(e){
    setProject({...project, [e.target.name]: e.target.value})
  }

  async function submitHandler(info){
    try {
      let token = localStorage.getItem('token');
      setProject({...project, members: project.members.push(user.id)})
      let result = await Axios.post(`${URL}/projects/new`, info, {headers: {
        "x-auth-token": token,
      }});
    } catch (error) {
      setError(error.response.data.message)
    }
  };
  
  return (
    <div>
       {error && <Alert variant="danger">{error}</Alert>}
      <h1>New Project</h1>
         <div>
          <Container>
          <Row>
            <Form.Control name="title" type="text" onChange={changeHandler} placeholder="Title"/>
          </Row>
          <Row>
            <Form.Control name="description" type="text" onChange={changeHandler} placeholder="Description"/>
          </Row>
          <Row>
            <Form.Control name="members"  onChange={changeHandler} />
          </Row>
          <Row>
            <Form.Control name="startDate" type="date" onChange={changeHandler} />
          </Row>
          <Row>
            <Form.Control name="endDate" type="date" onChange={changeHandler} />
          </Row>
          <Row>
            <Button variant="primary" onClick={()=> submitHandler(project)}>Save</Button>
          </Row>
          </Container>
        </div>
      
    </div>
  )
}

export default AddProject