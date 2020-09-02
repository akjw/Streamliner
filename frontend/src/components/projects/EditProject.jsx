import React, {useState, useEffect} from 'react'
import {Row, Form, Button, Card, Alert, Col} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import Axios from 'axios';
import DatePicker from "react-datepicker";
import moment from "moment";
import { Select } from 'antd';

import "react-datepicker/dist/react-datepicker.css";
import EditPhase from '../phases/EditPhase';

const { Option } = Select;
const URL = process.env.REACT_APP_URL

function EditProject({user, setRedirect, setRedirectId, setGlobalError}) {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [members, setMembers] = useState([])
  const [project, setProject] = useState({})
  const [projectPhases, setProjectPhases] = useState([])
  const [phasesNum, setPhasesNum] = useState(0)
  const [phasesLoading, setPhasesLoading] = useState(true)
  
  useEffect(() => {
    getOrganizationUsers(user.organization._id);
    getProjectPhases(id);
    getProject(id);
  }, [])


 async function getProject(id){
  try {
   let result = await Axios.get(`${URL}/projects/${id}`)
   let data = result.data.project
   let membersAlreadyInProject = result.data.project.members.map(member => { return member._id})
   console.log('user id', user._id)
   console.log('all members', membersAlreadyInProject)
   let minusUser = membersAlreadyInProject.filter(memberId => memberId.toString() != user._id.toString())
   console.log('minus user', minusUser)
   setMembers(minusUser)
   setProject({...data, members: minusUser})
   setIsLoading(false);
  } catch (error) {
    console.log(error)
    // setError(error.response.data.message)
  }
};

  async function getOrganizationUsers(orgId){
    try {
      let token = localStorage.getItem('token');
      let result = await Axios.get(`${URL}/users/all/${orgId}`, {headers: {
        "x-auth-token": token,
      }});
      setUsers(result.data.users)
      // console.log('all users', users)
    } catch (error) {
      console.log(error)
      // setError(error.response.data.message)
    }
  };


  async function getProjectPhases(id){
    try {
     let token = localStorage.getItem('token');
     let result = await Axios.get(`${URL}/projects/${id}/phases`, {headers: {
       "x-auth-token": token,
     }})
     setProjectPhases(result.data.phases)
     setPhasesNum(result.data.count)
     setPhasesLoading(false);
    } catch (error) {
      if(error.response){
        setError(error.response.data.message)
      } 
      console.log(error)
    }
 };

  function changeHandler(e){
    setProject({...project, [e.target.name]: e.target.value})
    console.log('proj val', project)
  }


  function handleMembers(value){
    setProject({...project, members: value})    
  }

  function handleStartDateChange(date){
    setProject({...project, startDate: date})
  }


  function handleEndDateChange(date){
    setProject({...project, endDate: date})
  }
  
  function handleInputChange(e){
    console.log(e.target.checked)
    if(e.target.checked){
        setProject({...project, members: [...project.members, e.target.value]})   
    }else{
      let membersList = [...project.members]
      let index = membersList.indexOf(e.target.value)
      membersList.splice(index, 1)
      setProject({...project, members: membersList})  
    }  
    // console.log('proj val', project)
}

  async function submitHandler(info){
    try {
      if (moment(info.endDate).isBefore(info.startDate)){
        setGlobalError('End date must be after start date')
        return 
      } else if (info.title.trim() == "" || info.description.trim() == ""){
        setGlobalError('Title and description cannot be empty')
        return
      }  else if (phasesNum != 0 && info.activePhase == undefined ){
        setGlobalError("Please mark project's current phase")
        return
      } 
      let token = localStorage.getItem('token');
      // setProject({...project, members: [...project.members, user._id]})
      let result = await Axios.put(`${URL}/projects/${id}`, info, {headers: {
        "x-auth-token": token,
      }});
      setGlobalError(null)
      setRedirectId(id)
      setRedirect(true)
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
        {!isLoading && 
          <Card className="p-4">
            <h1>Edit Project</h1>
              <Row>
                <Col md="8 offset-2">
                  <Form>
                  <Row className="mt-2">
                    <Form.Label>Title</Form.Label>
                  </Row>
                    <Row>
                        <Form.Control name="title" type="text" onChange={changeHandler} placeholder="Title" defaultValue={project.title}/>
                    </Row>
                    <Row className="mt-2">
                      <Form.Label>Description</Form.Label>
                    </Row>
                    <Row>
                        <Form.Control name="description" type="text" onChange={changeHandler} placeholder="Description" defaultValue={project.description}/>
                    </Row>
                    <Row className="mt-2">
                        <Form.Label>Project Members</Form.Label>
                        {users.count == 0 && <p>There are no other members in your organization</p>}
                    </Row>
                        {/* {users.map((user, i) => {
                            return (<Row key={i}>
                              <Form.Check type='checkbox' name="members" 
                            value={user._id}
                            label={`${user.firstname} ${user.lastname} (${user.email})`} onClick={handleInputChange} defaultChecked={members.indexOf(user._id.toString()) != -1 ? true : null}/>
                            </Row>)
                        })} */}
                                    <Select
                            name="members"
                            mode="multiple"
                            style={{ width: '100%' }}
                            defaultValue={project.members}
                            onChange={handleMembers}
                            optionLabelProp="label"
                          >
                                {users.map((user, i) => (
                                <Option key={i}   value={user._id} label={`${user.firstname} ${user.lastname} (${user.email})`}>
                                  {`${user.firstname} ${user.lastname} (${user.email})`}
                                </Option>
                            ))}
                          </Select>
                      <Row className="mt-2">
                        <Form.Label>Start Date</Form.Label>
                      </Row>
                      <Row>
                        <DatePicker name="startDate" selected={moment(project.startDate).toDate()} onChange={handleStartDateChange} className="form-control"/>
                      </Row>
                      <Row className="mt-2">
                        <Form.Label>End Date</Form.Label>
                      </Row>
                      <Row>
                      <DatePicker name="endDate" selected={moment(project.endDate).toDate()} onChange={handleEndDateChange} className="form-control"/>
                      </Row>
                      <Row className="mt-2">
                        <Form.Label>Mark as Complete</Form.Label>
                      </Row>
                      <Row>
                        <select onChange={changeHandler} name="isComplete" defaultValue={project.isComplete ? true : false} className="form-control">
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                        </select>
                      </Row>
                      <div>
                          {(!phasesLoading && phasesNum != 0) && 
                          <>
                          <Row className="mt-2">
                            <Form.Label>Set Active Phase</Form.Label>
                          </Row>
                          <Row>
                            <select onChange={changeHandler} name="activePhase" defaultValue={project.activePhase ? project.activePhase : ''} className="form-control">
                              <option value={""}>Phase</option>
                            {projectPhases.map((phase, i) => {
                              return <option key={i} value={phase._id}>{phase.name}</option>
                              })}
                              </select>
                          </Row>
                        </>
                        }
                  </div>
                  <Row>
                    <Button variant="primary" onClick={()=> submitHandler(project)} className="form-control mt-4">Save</Button>
                  </Row>
            </Form>
          </Col>
        </Row>
      </Card>}
    </div>
  )
}

export default EditProject
