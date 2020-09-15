import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from 'react-router-dom';
import {Container, Row, Col, Button, Alert, Badge, Card} from 'react-bootstrap';
import { Card as AnCard, Tooltip, Popconfirm, Collapse } from 'antd';
import { EditOutlined, DeleteFilled, PlusSquareTwoTone, CheckOutlined, CheckCircleOutlined, RightOutlined, DownOutlined} from '@ant-design/icons';
import Accordion from 'react-bootstrap/Accordion'
import AddPhase from '../phases/AddPhase'
import Axios from 'axios';
import moment from 'moment-timezone'

const { Panel } = Collapse;
const now = new Date()
const URL = process.env.REACT_APP_URL

function Project({ user, setRedirect, redirect, setGlobalError, setIsLanding }) {
 const { id } = useParams()
 let history = useHistory()
 const [showAddPhase, setShowAddPhase] = useState(false)
 const [project, setProject] = useState({})
 const [isLoading, setIsLoading] = useState(true)
 const [error, setError] = useState(null)
 const [members, setMembers] = useState([])
 const [markComplete, setMarkComplete] = useState({isComplete: true})
 const [markInProgress, setMarkInProgress] = useState({isComplete: false})
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

function toggleForm(){
  setShowAddPhase(!showAddPhase)
  setGlobalError(null)
}

async function toggleComplete(dId, info){
  try {
    console.log(info)
    let token = localStorage.getItem('token');
    await Axios.put(`${URL}/deliverables/${dId}/complete`, info, {headers: {
      "x-auth-token": token,
    }});
    getProject(id)
  } catch (error) {
    console.log(error)
    // setError(error.response.data.message)
  }
}

async function deleteProject() {
  try {
    await Axios.delete(`${URL}/projects/${id}`)
    setRedirect(true)
  } catch (error) {
    setError(error.response.data.message)
  }
}

async function deletePhase(phaseid) {
  try {
    await Axios.delete(`${URL}/phases/${phaseid}`)
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
  let mounted = true
  setIsLanding(false)
  if(isLoading){
    getProject(id);
  }
  return() => {
    mounted = false
  }
}, [isLoading, showAddPhase, project, redirect])


  return (
    <div className="mt-4">
       {error && <Alert variant="danger">{error}</Alert>}
       {!isLoading && 
       <Container>
       <Container fluid className="mt-4">
       <Row>
              <Col>
              <AnCard
              className="mt-2 mb-2"
                  extra={
                    <h4> 
                       <Tooltip title="New Project Phase">
                        <PlusSquareTwoTone className="mx-2" onClick={toggleForm} />
                      </Tooltip>
                      {user ? (project && (user._id.toString() == project.createdBy._id.toString())) &&
                      <>
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
                      </>
                      : ''}</h4>}>
                  {showAddPhase && <AddPhase setGlobalError={setGlobalError} setShowAddPhase={setShowAddPhase} getProject={getProject} setError={setError}/>}
                  <h1>{project.title}</h1>
                  <p>{project.description}</p>
                  <p><b>Start</b> {moment(project.startDate).format('MMMM Do YYYY')}</p>
                  <p><b>End</b> {moment(project.endDate).format('MMMM Do YYYY')}</p>
                  <div>
                    <p>Members</p>
                    {members && members.map((member,i) => (
                    <li key={i}>{member.firstname} {member.lastname}
                      {members && ((member._id.toString() == project.createdBy._id.toString()) && <span className="ml-2">(Creator)</span>)}
                    </li>
                  ))}</div> 
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
                          <div className="d-flex justify-content-start">
                            <h4>{phase.name}
                            {(project.activePhase && phase._id.toString() == project.activePhase.toString()) && <Badge pill variant="primary" className="mx-2 purple">Active</Badge>}
                            </h4>
                          </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={phase._id}>
                          <Card.Body>
                          <h4>{phase.subheader}</h4>
                          <div className="d-flex justify-content-end">
                          <h4> 
                            <Tooltip title={`New ${phase.subheader}`}>
                            <Link to={`/phases/${phase._id}/deliverables/new`}>
                                <PlusSquareTwoTone className="mx-2"/>
                            </Link>
                          </Tooltip>
                          {user ? (project && (user._id.toString() == project.createdBy._id.toString())) &&
                          <>
                          <Tooltip title="Edit Phase">
                            <Link to={`/phases/${phase._id}`} className="mx-2"><EditOutlined  /></Link>
                          </Tooltip>
                          <Popconfirm
                                title="Are you sure you want to delete this phase?"
                                onConfirm={()=>deletePhase(phase._id)}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                              >
                               <DeleteFilled id={phase._id} className="mx-2"/>
                          </Popconfirm>
                          </>
                         : ''}
                         </h4>
                          </div>
                                <Container fluid className="mt-4">
                                <Row>
                                  {(!isLoading && !phase.deliverables.length) && <p>No {phase.subheader} yet</p>}
                                  {(!isLoading && phase.deliverables ) && phase.deliverables.map(d => {
                                    return <Col key={d._id} md="3">
                                      <AnCard className={d.isComplete ? 'complete' : '' }
                                      extra={!d.isComplete ? <Tooltip title="Mark as complete">
                                      <CheckOutlined onClick={()=>toggleComplete(d._id, markComplete)}/>
                                    </Tooltip> : <Tooltip title="Mark as in-progress">
                                      <CheckCircleOutlined onClick={()=>toggleComplete(d._id, markInProgress)}/>
                                    </Tooltip>}
                                      >
                                          <b>{d.name}</b>
                                          <p>{d.description}</p>
                                          <div>
                                            <p>Deadline: {moment(d.deadline).format('MMMM Do YYYY')}</p>
                                          </div>
                                          <div>
                                            <p>Status: {d.isComplete? 'Complete' : 'In-Progress'}</p>
                                          </div>
                                          {(moment(d.deadline).tz('Asia/Singapore').diff(now, 'days') < 0 && !d.isComplete) ? <p className="red"><i>Overdue</i></p>
                                          : moment(d.deadline).tz('Asia/Singapore').diff(now, 'days') > 1 ? <p><b>Due in {moment(d.deadline).tz('Asia/Singapore').diff(now, 'days')} days</b></p> 
                                          : moment(d.deadline).tz('Asia/Singapore').diff(now, 'days') > 0 ? <p><b>Due in {moment(d.deadline).tz('Asia/Singapore').diff(now, 'days')} day</b></p> 
                                          : moment(d.deadline).tz('Asia/Singapore').diff(now, 'days') < -1 ? <p><b>Due {moment(now).tz('Asia/Singapore').diff(d.deadline, 'days')} days ago</b></p> 
                                          :  moment(d.deadline).tz('Asia/Singapore').diff(now, 'days') < 0 ? <p><b>Due {moment(now).tz('Asia/Singapore').diff(d.deadline, 'days')} day ago</b></p> 
                                          : <p><b>Due today</b></p>}
                                            <div>
                                              <Link to={`/deliverables/${d._id}`}>Edit</Link>
                                            </div>
                                      </AnCard>
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
          </Container>
        </Container>}
    </div>
  )
}

export default Project
