import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';
import {Container, Row, Card, Col, Button, Alert} from 'react-bootstrap';
import Axios from 'axios';

const URL = process.env.REACT_APP_URL

function Dashboard({ user }) {
 const [projects, setProjects] = useState([])
 const [projectsNum, setProjectsNum] = useState(0)
 const [error, setError] = useState(null)

 async function getUserProjects(){
   try {
    let token = localStorage.getItem('token');
    let result = await Axios.get(`${URL}/projects`, {headers: {
      "x-auth-token": token,
    }})
    setProjects(result.data.projects)
    setProjectsNum(result.data.count)
   } catch (error) {
     setError(error.response.data.message)
   }
};

async function deleteProject(e) {
  try {
    await Axios.delete(`${URL}/items/${e.target.id}`)
    getUserProjects()
  } catch (error) {
    setError(error.response.data.message)
  }
}

useEffect(() => {
  getUserProjects();
})
  return (
    <div>
      <h1>Dashboard</h1>
      <Container fluid>
      {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            {projectsNum == 0 && <h4>No projects yet</h4>}
            {projects && projects.map(project => (
              <Col key={project._id} md="3">
                <Card>
                  <Card.Body>
                    <b>{project.title}</b>
                    {project.description}
                      <div>
                        <Link to={`/projects/${project._id}`}>View</Link>
                        {user._id.toString() == project.createdBy._id.toString() && <Button onClick={deleteProject} id={project._id} variant="danger">Delete</Button>}
                      </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
    </div>
  )
}

export default Dashboard