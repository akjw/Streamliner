import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';
import {Container, Row,  Col, Button, Alert} from 'react-bootstrap';
import Axios from 'axios';
import { Switch, Card } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment'

const URL = process.env.REACT_APP_URL

function Dashboard({ user }) {
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

    getUserProjects();
    getArchive();
}, [])
console.log('archive', archive)
  return (
    <div className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Container fluid className="mt-4">
      {showCurrent ? <h1>Projects</h1> : <h1>Archive</h1>}
          <div className="d-flex justify-content-end">
            <div className="row">
              <div className="col">
              <Switch checkedChildren="Current" unCheckedChildren="Archived" defaultChecked onClick={toggleProjects}/>
              {/* <Button variant="info" onClick={toggleProjects}>{showCurrent ? 'Show Completed Projects' : 'Show Current Projects'}</Button> */}
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
                  extra={ <Link to={`/projects/${project._id}`}><EyeOutlined /></Link>}
                  className="mt-2 mb-2"
                >
                  <p>{project.description}</p>
                  <p><b>Start</b> {moment(project.startDate).format('MMMM Do YYYY')}</p>
                  <p><b>End</b> {moment(project.endDate).format('MMMM Do YYYY')}</p>
                </Card>
                {/* <Card>
                  <Card.Body>
                    <b>{project.title}</b>
                    <p>{project.description}</p>
                      <div>
                        <Link to={`/projects/${project._id}`}>View</Link>
                      </div>
                  </Card.Body>
                </Card> */}
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
                  extra={ <Link to={`/projects/${project._id}`}><EyeOutlined /></Link>}
                  className="mt-2 mb-2"
                >
                  <p>{project.description}</p>
                  <p><b>Start</b> {moment(project.startDate).format('MMMM Do YYYY')}</p>
                  <p><b>End</b> {moment(project.endDate).format('MMMM Do YYYY')}</p>
                </Card>
                {/* <Card className={project.isComplete ? 'complete' : '' }>
                  <Card.Body>
                    <b>{project.title}</b>
                    <p>{project.description}</p>
                      <div>
                        <Link to={`/projects/${project._id}`}>View</Link> */}
                        {/* {user._id.toString() == project.createdBy._id.toString() && <Button onClick={deleteProject} id={project._id} variant="danger">Delete</Button>} */}
              </Col>
            ))}
          </Row>}
        </Container>
    </div>
  )
}

export default Dashboard