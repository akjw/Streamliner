import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from 'react-router-dom';
import {Container, Row, Col, Button, Alert, Badge, Card} from 'react-bootstrap';
import { Card as AnCard, Tooltip, Popconfirm, Collapse } from 'antd';
import { EditOutlined, DeleteFilled, PlusSquareTwoTone } from '@ant-design/icons';
import Accordion from 'react-bootstrap/Accordion'
import AddPhase from '../phases/AddPhase'
import Axios from 'axios';
import moment from 'moment'
const { Panel } = Collapse;
const now = moment();
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

function cancel(){
  console.log('cancelled!')
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
              <AnCard
                  extra={user ? (project && (user._id.toString() == project.createdBy._id.toString())) &&
                    <h4> 
                       <Tooltip title="New Project Phase">
                        <PlusSquareTwoTone className="mx-2" onClick={()=>setShowAddPhase(!showAddPhase)} />
                      </Tooltip>
                      <Tooltip title="Edit Project">
                        <Link to={`/projects/${id}/edit`} className="mx-2"><EditOutlined  /></Link>
                      </Tooltip>
                      <Popconfirm
                            title="Are you sure you want to delete this project?"
                            onConfirm={deleteProject}
                            onCancel={cancel}
                            id={id}
                            okText="Yes"
                            cancelText="No"
                          >
                           <DeleteFilled id={id} className="mx-2"/>
                      </Popconfirm>
                    </h4> : ''}
                  className="mt-2 mb-2"
                >
                  {showAddPhase && <AddPhase setShowAddPhase={setShowAddPhase} getProject={getProject} setError={setError}/>}
                  <h1>{project.title}</h1>
                  <p>{project.description}</p>
                  <p><b>Start</b> {moment(project.startDate).format('MMMM Do YYYY')}</p>
                  <p><b>End</b> {moment(project.endDate).format('MMMM Do YYYY')}</p>
                </AnCard>
              </Col>
          </Row>
          <Row>
          </Row>
          <Row className="mt-4">
            <Col>
                 {project.phases.length ?
                <Accordion defaultActiveKey={project.activePhase ? project.activePhase : project.phases[0]._id}>
                {project.phases.map((phase, i) => (
                      <Card key={i}>
                        <Accordion.Toggle as={Card.Header} eventKey={phase._id} className="accordion-theme">
                        <div className="d-flex justify-content-between">
                          <h4>{phase.name}
                          {(project.activePhase && phase._id.toString() == project.activePhase.toString()) && <Badge pill variant="primary" className="mx-2">Active</Badge>}
                          </h4>
                          {user ? (project && (user._id.toString() == project.createdBy._id.toString())) &&
                          <h4> 
                            <Tooltip title={`New ${phase.subheader}`}>
                            <Link to={`/phases/${phase._id}/deliverables/new`}>
                                <PlusSquareTwoTone className="mx-2"/>
                            </Link>
                          </Tooltip>
                          <Tooltip title="Edit Phase">
                            <Link to={`/phases/${phase._id}`} className="mx-2"><EditOutlined  /></Link>
                          </Tooltip>
                          <Popconfirm
                                title="Are you sure you want to delete this phase?"
                                onConfirm={deletePhase}
                                onCancel={cancel}
                                id={phase._id}
                                okText="Yes"
                                cancelText="No"
                              >
                               <DeleteFilled id={id} className="mx-2"/>
                          </Popconfirm>
                          </h4>: ''}
                          </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={phase._id}>
                          <Card.Body>
                          <h4>{phase.subheader}</h4>
                                <Container fluid className="mt-4">
                                <Row>
                                  {(!isLoading && !phase.deliverables.length) && <p>No {phase.subheader} yet</p>}
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
                                          <p><b>Due {moment(d.deadline).fromNow()}</b></p>
                                          {moment(d.deadline).isBefore(now) && !d.isComplete ? <p className="red"><i>Overdue</i></p> : ''}
                                            <div>
                                              <Link to={`/deliverables/${d._id}`}>Edit</Link>
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
              </Accordion> 
              : <p>No phases to show</p>}
            </Col>
          </Row>
        </Container>}
    </div>
  )
}

export default Project
