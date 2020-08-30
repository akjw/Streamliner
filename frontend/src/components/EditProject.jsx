import React, {useState, useEffect} from 'react'
import {Row, Form, Button, Container, Alert} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import Axios from 'axios';
import DatePicker from "react-datepicker";
import moment from "moment";
 
import "react-datepicker/dist/react-datepicker.css";


const URL = process.env.REACT_APP_URL

function EditProject({user, setRedirect, setRedirectId}) {
  const { id } = useParams()
  let checkedMembers = []
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [members, setMembers] = useState([])
  const [project, setProject] = useState({})
  
  useEffect(() => {
    getOrganizationUsers(user.organization._id);
    getProject(id)
  }, [])

  // useEffect(() => {
  //   setMembers(...members)
   
  // }, [project])





 async function getProject(id){
  try {
   let result = await Axios.get(`${URL}/projects/${id}`)
   let data = result.data.project
  //  console.log('data info', data)
  //  console.log('axios results', result)
  //  setProject(data)
  //  console.log('set proj details', project)
   let membersAlreadyInProject = result.data.project.members.map(member => { return member._id})
   setMembers(membersAlreadyInProject)
   setProject({...data, members: membersAlreadyInProject})
  
  //  console.log('checked members', membersAlreadyInProject)
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

  function changeHandler(e){
    console.log(e)
    console.log(e.target.name)
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
      <h1>Edit Project</h1>
         <div>
          <Container>
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
            <DatePicker name="startDate" selected={moment(project.startDate).toDate()} onChange={handleStartDateChange}/>
          </Row>
          <Row>
          <Form.Label>End Date</Form.Label>
          <DatePicker name="endDate" selected={moment(project.endDate).toDate()} onChange={handleEndDateChange}/>
          </Row>
          <Row>
            <Button variant="primary" onClick={()=> submitHandler(project)}>Save</Button>
          </Row>
          </Container>
        </div>
      
    </div>
  )
}

export default EditProject
