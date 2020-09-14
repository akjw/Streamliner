import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';
import {Container, Row,  Col, Button, Alert} from 'react-bootstrap';
import Axios from 'axios';
import { Switch, Card } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment-timezone'

const URL = process.env.REACT_APP_URL
// const today = new Date()
const now = new Date()

function Dashboard({ user, setIsLanding, setRedirect}) {
 const [projects, setProjects] = useState([])
 const [isLoading, setIsLoading] = useState(true)
 const [projectsNum, setProjectsNum] = useState(0)
 const [archive, setArchive] = useState([])
 const [archiveNum, setArchiveNum] = useState(0)
 const [showCurrent, setShowCurrent] = useState(true)
 const [error, setError] = useState(null)

 async function getUserProjects(){
   try {
    let token = localStorage.getItem('token');
    let result = await Axios.get(`${URL}/projects`, {headers: {
      "x-auth-token": token,
    }})
    setProjects(result.data.projects)
    setProjectsNum(result.data.count)
    setRedirect(false)
    setIsLoading(false);
   } catch (error) {
     console.log(error)
    //  setError(error.response.data.message)
   }
};

async function getArchive(){
  try {
   let token = localStorage.getItem('token');
   let result = await Axios.get(`${URL}/projects/archive`, {headers: {
     "x-auth-token": token,
   }})
   console.log('archive call', result)
   setArchive(result.data.projects)
   setArchiveNum(result.data.count)
   setIsLoading(false);
  } catch (error) {
    console.log(error)
   //  setError(error.response.data.message)
  }
};

function toggleProjects(){
  setShowCurrent(!showCurrent)
}

async function deleteProject(e) {
  try {
    await Axios.delete(`${URL}/projects/${e.target.id}`)
    getUserProjects()
  } catch (error) {
    setError(error.response.data.message)
  }
}

useEffect(() => {
    let mounted = true
    setIsLanding(false);
    getUserProjects();
    getArchive();
    return() => {
      mounted = false
    }
}, [])
console.log('archive', archive)
  return (
    <div className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Container>
      <Container fluid className="mt-4">
      {showCurrent ? <h1>Projects</h1> : <h1>Archive</h1>}
          <div className="d-flex justify-content-end">
            <div className="row">
              <div className="col">
              <Switch className="purple mb-4" checkedChildren="Current" unCheckedChildren="Archived" defaultChecked onClick={toggleProjects}/>
              </div>
            </div>
          </div>
          {showCurrent &&
          <Row>
            {(!isLoading && projectsNum == 0 && showCurrent) && <h4>No projects yet</h4>}
            {(!isLoading && projectsNum == 0 && !showCurrent) && <h4>No projects in archive</h4>}
            {projects && projects.map(project => (
              <Col key={project._id} md="3">
                <Card
                  title={project.title}
                  extra={ <h4><Link to={`/projects/${project._id}`}><EyeOutlined className="purple-outline" /></Link></h4>}
                  className="mt-2 mb-2"
                >
                  <p>{project.description}</p>
                  {(moment(project.endDate).tz('Asia/Singapore').diff(now, 'days') < 0 && !project.isComplete) ? <>
                  <p><b>Due {moment(project.endDate).fromNow()}</b></p>
                  <p className="red"><i>Overdue</i></p> </>
                                          : moment(project.endDate).tz('Asia/Singapore').diff(now, 'days') > 0 ? <p><b>Due in {moment(project.endDate).tz('Asia/Singapore').diff(now, 'days')} days</b></p> 
                                          : <p><b>Due today</b></p>}
                </Card>
              </Col>
            ))}
          </Row>}
          {!showCurrent &&
          <Row>
            {(!isLoading && archiveNum == 0 && !showCurrent) && <h4>No projects in archive</h4>}
            {archive && archive.map(project => (
              <Col key={project._id} md="3">
                <Card
                  title={project.title}
                  extra={ <h4><Link to={`/projects/${project._id}`}><EyeOutlined className="purple-outline"/></Link></h4>}
                  className="mt-2 mb-2 complete"
                >
                  <p>{project.description}</p>
                  <p><b>Due {moment(project.endDate).format('MMMM Do YYYY')}</b></p>
                </Card>
              </Col>
            ))}
          </Row>}
        </Container>
       </Container>
    </div>
  )
}

export default Dashboard