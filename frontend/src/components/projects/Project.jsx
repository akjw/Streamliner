import React, {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom';
import {Container, Row, Card, Col, Button, Alert, Badge} from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion'
import AddPhase from '../phases/AddPhase'
import Axios from 'axios';
import moment from 'moment'

const URL = process.env.REACT_APP_URL

function Project({ user }) {
 const { id } = useParams()
 const [showAddPhase, setShowAddPhase] = useState(false)
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
}, [isLoading, showAddPhase])

console.log('rpoj', project)
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
                   <div>
                    <p>Status: {project.isComplete ? 'Completed' : 'In-Progress'}</p>
                  </div> 
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
            <div className="my-2">
            <Button onClick={()=>setShowAddPhase(!showAddPhase)} variant="primary">Add Phase</Button>
            </div>
            {/* <Link to={`/projects/${id}/phases/new`} className="btn btn-primary">Add Phase</Link> */}
          </Row>
          <Row>
          {showAddPhase && <AddPhase setShowAddPhase={setShowAddPhase} setError={setError}/>}
          </Row>
          <Row>
            <Col>
              <Accordion defaultActiveKey={project.activePhase._id} animation="false">
                {project.phases.map((phase, i) => (
                      <Card key={i}>
                        <Accordion.Toggle as={Card.Header} eventKey={phase._id} animation="false">
                          {phase.name}
                          {(phase._id.toString() == project.activePhase._id.toString()) && <div><Badge pill variant="success">Active</Badge></div>}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={phase._id} animation="false">
                          <Card.Body>
                            <h4>Deliverables</h4>
                            This is a list
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>}
    </div>
  )
}

export default Project
