import React, {useState, useEffect} from 'react'
import {Row, Form, Button, Container, Alert, Col, Card} from 'react-bootstrap'
import Axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import { Select } from 'antd';


const { Option } = Select;
const URL = process.env.REACT_APP_URL

function AddProject({user, setRedirect, setGlobalError}) {
  let usersList;
  const [error, setError] = useState(null)
  const today = new Date()
  const [users, setUsers] = useState([])
  const [project, setProject] = useState(
      {
        title: '',
        description: '',
        organization: user.organization._id,
        createdBy: user._id,
        members: [],
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
      // usersList = result.data.users.map(user => {
      //   return {
      //     value: user._id,
      //     label: `${user.firstname} ${user.lastname} (${user.email})`
      //   }
      // })
      console.log('users list', usersList)
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

  function handleMembers(value){
    setProject({...project, members: value})  
  //   console.log('value', value)
  //   // console.log('index', index)
  //   let membersList = [...project.members]
  //   let index = membersList.indexOf(value)
  //   console.log('index', index)
  //   if(index == -1){
  //     console.log('not present')
  //     let newList = membersList.concat(value)
  //     setProject({...project, members: newList})   
  //   }else{
  //   membersList.splice(index, 1)
  //   setProject({...project, members: membersList})  
  //   }  
  // console.log('proj val', project)
    
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
      if (moment(info.endDate).isBefore(info.startDate)){
        setGlobalError('End date must be after start date')
        return 
      } else if (info.title.trim() == "" || info.description.trim() == ""){
        setGlobalError('Title and description cannot be empty')
        return
      } 
        let token = localStorage.getItem('token');
        console.log('front proj', project)
        let result = await Axios.post(`${URL}/projects/new`, info, {headers: {
          "x-auth-token": token,
        }});
        setGlobalError(null)
        setRedirect(true)
      
    } catch (error) {
      console.log(error)
      // setError(error.response.data.message)
    }
  };

  return (
    <div>
    {error && <Alert variant="danger">{error}</Alert>}
    <Card className="p-4">
      <h1>New Project</h1>
      <Row>
      <Col md="8 offset-2">
        <Form>
          <Row className="mt-2">
            <Form.Label>Title</Form.Label>
          </Row>
          <Row>
            <Form.Control name="title" type="text" onChange={changeHandler} placeholder="Title"/>
          </Row>
          <Row className="mt-2">
            <Form.Label>Description</Form.Label>
          </Row>
          <Row>
            <Form.Control name="description" type="text" onChange={changeHandler} placeholder="Description"/>
          </Row>
          <Row className="mt-2">
            <Form.Label>Project Members</Form.Label>
             {users.count == 0 && <p>There are no other members in your organization</p>}
          </Row>
                <Select
                  name="members"
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Add members to project"
                  onChange={handleMembers}
                  optionLabelProp="label"
                  size="large"
                  className="pr-2"
                >
                     {users.map((user, i) => (
                      <Option key={i}   value={user._id} label={`${user.firstname} ${user.lastname} (${user.email})`}>
                        {`${user.firstname} ${user.lastname} (${user.email})`}
                      </Option>
                  ))}
               </Select>
          <Row className="mt-2">
            <Form.Label>Start</Form.Label>
          </Row>
          <Row>
            <DatePicker name="startDate" selected={project.startDate != null ? project.startDate : today} onChange={handleStartDateChange} className="form-control"/>
          </Row>
          <Row className="mt-2">
            <Form.Label>End</Form.Label>
          </Row>
          <Row>
          <DatePicker name="endDate" selected={project.endDate != null ? project.endDate : today} onChange={handleEndDateChange} className="form-control"/>
          </Row>
          <Row>
            <Button variant="primary" className="form-control my-4" onClick={()=> submitHandler(project)}>Save</Button>
          </Row>
          </Form>
          </Col>
          </Row>
          </Card>
        </div>
  
  )}


export default AddProject