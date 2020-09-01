import React, {useState, useEffect} from 'react'
import {Row, Form, Button, Container, Alert, Col} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import Axios from 'axios';
import DatePicker from "react-datepicker";
import moment from "moment";
 
import "react-datepicker/dist/react-datepicker.css";
import EditPhase from '../phases/EditPhase';


const URL = process.env.REACT_APP_URL

function EditProject({user, setRedirect, setRedirectId}) {
  const { id } = useParams()
  let phaseSelect;
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
   setMembers(membersAlreadyInProject)
   setProject({...data, members: membersAlreadyInProject})
  //  if(projectPhases){
  //    projectPhases.forEach((phase, i) => {
  //      console.log('projectPhase', phase)
  //      console.log('activePhase', project.activePhase._id.toString())
  //      console.log('equal', phase._id.toString() == project.activePhase._id.toString())
  //      if(phase._id.toString() == project.activePhase._id.toString()){
  //        phaseSelect = phase._id.toString();
  //      }
  //    })
  //  }
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
     console.log('results phases', result)
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
        setError('End date must be after start date')
        return 
      } else if (info.title.trim() == "" || info.description.trim() == ""){
        setError('Title and description cannot be empty')
        return
      }  else if (info.activePhase == undefined ){
        setError("Please mark project's current phase")
        return
      } 
      let token = localStorage.getItem('token');
      setProject({...project, members: [...project.members, user._id]})
      let result = await Axios.put(`${URL}/projects/${id}`, info, {headers: {
        "x-auth-token": token,
      }});
      setRedirectId(id)
      setRedirect(true)
    } catch (error) {
      console.log(error)
    }
  };

  function verifyIfChecked(user){
    let findChecked = members.indexOf(user._id)
    if(findChecked == -1){
      return <Row key={user._id}>
        <Form.Check type='checkbox' name="members"
      value={user._id}
      label={`${user.firstname} ${user.lastname} (${user.email})`} onChange={handleInputChange} />
      </Row>
    } else {
      return <Row key={user._id}>
      <Form.Check type='checkbox' name="members"
      value={user._id}
      label={`${user.firstname} ${user.lastname} (${user.email})`} onChange={handleInputChange} checked={true}/>
      </Row>
    }
  }

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
         <div>
          {!isLoading && 
          <Container>
              <h1>Edit Project</h1>
              <Row>
                <Col md="6 offset-3">
                <Row>
                    <Form.Control name="title" type="text" onChange={changeHandler} placeholder="Title" defaultValue={project.title}/>
                  </Row>
                  <Row>
                    <Form.Control name="description" type="text" onChange={changeHandler} placeholder="Description" defaultValue={project.description}/>
                  </Row>
                  <Row>
                    <Form.Label>Project Members</Form.Label>
                    {users.count == 0 && <p>There are no other members in your organization</p>}
                  </Row>
                        {users.map((user, i) => {
                            return (<Row key={i}>
                              <Form.Check type='checkbox' name="members"
                            value={user._id}
                            label={`${user.firstname} ${user.lastname} (${user.email})`} onClick={handleInputChange} defaultChecked={members.indexOf(user._id.toString()) != -1 ? true : null}/>
                            </Row>)
                        })}
                  <Row>
                    <Form.Label>Start Date</Form.Label>
                    <DatePicker name="startDate" selected={moment(project.startDate).toDate()} onChange={handleStartDateChange} className="form-control"/>
                  </Row>
                  <Row>
                  <Form.Label>End Date</Form.Label>
                  <DatePicker name="endDate" selected={moment(project.endDate).toDate()} onChange={handleEndDateChange} className="form-control"/>
                  </Row>
                  <Row>
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
                      <Row>
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
                </Col>
              </Row>
          </Container>}
        </div>
      
    </div>
  )
}

export default EditProject
