import React, {useState, useEffect} from 'react'
import {Row, Form, Button, Container, Alert} from 'react-bootstrap'
import Axios from 'axios';
import DatePicker from "react-datepicker";
import moment from "moment";
 
import "react-datepicker/dist/react-datepicker.css";


const URL = process.env.REACT_APP_URL

function AddProject({user, setRedirect}) {
  const [error, setError] = useState(null)
  const today = new Date()
  const [users, setUsers] = useState([])
  const [project, setProject] = useState(
      {
        title: '',
        description: '',
        organization: user.organization._id,
        createdBy: user._id,
        members: [user._id],
        startDate: today,
        endDate: today
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
      console.log(error)
      // setError(error.response.data.message)
    }
  };

  function changeHandler(e){
    setProject({...project, [e.target.name]: e.target.value})
    console.log('proj val', project)
  }

  function handleStartDateChange(date){
    setProject({...project, startDate: date})
  }


  function handleEndDateChange(date){
    setProject({...project, endDate: date})
  }

 
  function handleInputChange(e){
    if(e.target.checked){
        setProject({...project, members: [...project.members, e.target.value]})   
    }else{
      let membersList = [...project.members]
      let index = membersList.indexOf(e.target.value)
      membersList.splice(index, 1)
      setProject({...project, members: membersList})  
    }  
    console.log('proj val', project)
}

  async function submitHandler(info){
    try {
      let token = localStorage.getItem('token');
      console.log('front proj', project)
      let result = await Axios.post(`${URL}/projects/new`, info, {headers: {
        "x-auth-token": token,
      }});
      setRedirect(true)
    } catch (error) {
      console.log(error)
      // setError(error.response.data.message)
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
            <Form.Label>Project Members</Form.Label>
             {users.count == 0 && <p>There are no other members in your organization</p>}
             {/* <Form.Control as="select" multiple name="members" onChange={handleInputChange}>
             {users.map((user, i) => (
                    <option key={i} value={user._id}>{`${user.firstname} ${user.lastname} (${user.email})`}</option>
                  ))} 
             </Form.Control> */}
          </Row>
             {users.map((user, i) => (
                    <Row key={i}>
                      <Form.Check type='checkbox' name="members"
                    value={user._id}
                    label={`${user.firstname} ${user.lastname} (${user.email})`} onChange={handleInputChange} multiple/>
                    </Row>
                  ))}
          <Row>
            <Form.Label>Start Date</Form.Label>
            <DatePicker name="startDate" selected={project.startDate != null ? project.startDate : today} onChange={handleStartDateChange}/>
          </Row>
          <Row>
          <Form.Label>End Date</Form.Label>
          <DatePicker name="endDate" selected={project.endDate != null ? project.endDate : today} onChange={handleEndDateChange}/>
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