import React, {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom';
import {Container, Row, Card, Col, Button, Alert} from 'react-bootstrap';
import Axios from 'axios';
import moment from 'moment'

const URL = process.env.REACT_APP_URL

function Project({ user }) {
  const { id } = useParams()
  const [project, setProject] = useState({})
 const [isLoading, setIsLoading] = useState(true)
 const [error, setError] = useState(null)
 const [members, setMembers] = useState([])

 async function getProject(id){
  try {
   let result = await Axios.get(`${URL}/projects/${id}`)
   setProject(result.data.project)
   setMembers(result.data.project.members)
  //  console.log('proj details', project)
   setIsLoading(false);
  //  console.log('members', members)
  } catch (error) {
    console.log(error)
    // setError(error.response.data.message)
  }
};


async function deleteProject() {
  try {
    await Axios.delete(`${URL}/projects/${id}`)
  } catch (error) {
    setError(error.response.data.message)
  }
}

useEffect(() => {
  if(isLoading){
    getProject(id);
  }
}, [isLoading])
console.log('members', members)
console.log('user', user)

  return (
    <div className="mt-4">
       {error && <Alert variant="danger">{error}</Alert>}
       {!isLoading && <Container fluid className="mt-4">
       <Row>
              <Col>
              <Card>
                <Card.Body>
                  <h1>{project && project.title}</h1>
                  <div>{project && project.description}</div>
                  <div>
                    <p>Start Date: {moment(project.startDate).format('MMMM Do YYYY')}</p>
                  </div>
                  <div>
                    <p>End Date: {moment(project.endDate).format('MMMM Do YYYY')}</p>
                  </div>
                  <div>
                    <p>Members</p>
                    {members && members.map((member,i) => (
                    <li key={i}>{member.firstname} {member.lastname}
                      {members && ((member._id.toString() == project.createdBy._id.toString()) && <span className="ml-2">(Creator)</span>)}
                    </li>
                  ))}</div>  
                </Card.Body>
                {user ? (project && (user._id.toString() == project.createdBy._id.toString())) &&
                <div> 
                  <Link to={`/projects/${id}/edit`} className="btn btn-warning">Edit</Link>
                  <Button onClick={deleteProject} id={id} variant="danger">Delete</Button>
                </div> : ''}
              </Card>
              </Col>
          </Row>
          <Row>
            <Link to={`/projects/${id}/phases/new`} className="btn btn-primary">Add Phase</Link>
          </Row>
        </Container>}
       
    </div>
  )
}

export default Project
