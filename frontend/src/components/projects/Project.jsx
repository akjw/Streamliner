import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from 'react-router-dom';
import {Container, Row, Card, Col, Button, Alert, Badge} from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion'
import AddPhase from '../phases/AddPhase'
import Axios from 'axios';
import moment from 'moment'

const URL = process.env.REACT_APP_URL

function Project({ user, setRedirect, redirect }) {
 const { id } = useParams()
 let history = useHistory()
 const [showAddPhase, setShowAddPhase] = useState(false)
 const [project, setProject] = useState({})
 const [isLoading, setIsLoading] = useState(true)
 const [error, setError] = useState(null)
 const [members, setMembers] = useState([])
//  const [completeDeliverables]
 const [dcount, setDCount] = useState(0)

 async function getProject(id){
  try {
   let result = await Axios.get(`${URL}/projects/${id}`)
   setProject(result.data.project)
   setMembers(result.data.project.members)
   setDCount(result.dcount)
   setIsLoading(false);
  } catch (error) {
    console.log(error)
    // setError(error.response.data.message)
  }
};


async function deleteProject() {
  try {
    await Axios.delete(`${URL}/projects/${id}`)
    setRedirect(true)
  } catch (error) {
    setError(error.response.data.message)
  }
}

async function deletePhase(e) {
  try {
    await Axios.delete(`${URL}/phases/${e.target.id}`)
    getProject(id);
  } catch (error) {
   if(error.response){
     setError(error.response.data.message)
   } 
   console.log(error)
  }
}

useEffect(() => {
  if(isLoading){
    getProject(id);
  }
}, [isLoading, showAddPhase, project, redirect])

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
          </Row>
          <Row>
          {showAddPhase && <AddPhase setShowAddPhase={setShowAddPhase} getProject={getProject} setError={setError}/>}
          </Row>
          <Row>
            <Col>
              {project.phases.length ?
                <Accordion defaultActiveKey={project.activePhase ? project.activePhase : project.phases[0]._id}>
                {project.phases.map((phase, i) => (
                      <Card key={i}>
                        <Accordion.Toggle as={Card.Header} eventKey={phase._id}>
                          {phase.name}
                          {(project.activePhase && phase._id.toString() == project.activePhase.toString()) && <div><Badge pill variant="success">Active</Badge></div>}
                          {user ? (project && (user._id.toString() == project.createdBy._id.toString())) &&
                          <div> 
                            <Link to={`/phases/${phase._id}`}>Edit</Link>
                            <Button onClick={deletePhase} id={phase._id} variant="danger">Delete</Button>
                          </div> : ''}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={phase._id}>
                          <Card.Body>
                          <h4>{phase.subheader}</h4>
                            <div>
                            <Link to={`/phases/${phase._id}/deliverables/new`} className="btn btn-primary">Add {phase.subheader}</Link>
                            </div>

                                <Container fluid className="mt-4">
                                <Row>
                                  {(!isLoading && phase.deliverables == undefined) && <h4>No {phase.subheader} yet</h4>}
                                  {(!isLoading && phase.deliverables ) && phase.deliverables.map(d => {
                                    return <Col key={d._id} md="3">
                                      <Card className={d.isComplete ? 'complete' : '' }>
                                        <Card.Body>
                                          <b>{d.name}</b>
                                          <p>{d.description}</p>
                                          <div>
                                            <p>Deadline: {moment(d.deadline).format('MMMM Do YYYY')}</p>
                                          </div>
                                          <div>
                                            <p>Status: {d.isComplete? 'Complete' : 'In-Progress'}</p>
                                          </div>
                                            <div>
                                              <Link to={`/deliverables/${d._id}`}>Edit</Link>
                                              {/* {user._id.toString() == project.createdBy._id.toString() && <Button onClick={deleteProject} id={project._id} variant="danger">Delete</Button>} */}
                                            </div>
                                        </Card.Body>
                                      </Card>
                                    </Col>
                                  })}
                                </Row>
                              </Container>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                ))}
              </Accordion> : <p>No phases to show</p>}
            </Col>
          </Row>
        </Container>}
    </div>
  )
}

export default Project
