import React, {useState, useEffect} from 'react'
import {Row, Form, Button, Container, Alert, Col, InputGroup, FormControl, Card} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import Axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone'

const URL = process.env.REACT_APP_URL
const now = moment().format('MM DD YYYY');

function AddDeliverable({user, setRedirect, setRedirectId, setGlobalError, setIsLanding}) {
  // grab project id from url
  const { id } = useParams()
  const today = new Date()
  const [phase, setPhase] = useState({})
  const [deliverable, setDeliverable] = useState({name: '', description: ''})
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setIsLanding(false)
    getPhase(id)
    return() => {
      mounted = false
    }
  }, [])


  async function getPhase(id){
    try {
      let result = await Axios.get(`${URL}/phases/${id}`)
      setPhase(result.data.phase)
      setIsLoading(false);
     } catch (error) {
       console.log(error)
       // setError(error.response.data.message)
     }
  }

  function handleDeadlineChange(date){
    setDeliverable({...deliverable, deadline: date})
  }

  function changeHandler(e){
    setDeliverable({...deliverable, [e.target.name]: e.target.value})
    // console.log('deliverable val', deliverable)
  }

  async function submitHandler(info){
    try {
      setDeliverable({...deliverable, createdBy: user._id})
     if (info.name.trim() == "" || info.description.trim() == ""){
        setGlobalError('Name and description cannot be empty')
        return
     } else {
        let token = localStorage.getItem('token');
        // console.log('frontend deliverable', deliverable)
        let result = await Axios.post(`${URL}/phases/${id}/deliverables/new`, info, {headers: {
          "x-auth-token": token,
        }});
        setGlobalError(null)
        setRedirectId(phase.project)
        setRedirect(true)
      }
    } catch (error) {
      console.log(error)
      // setError(error.response.data.message)
    }
  };

 

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Container>
      <Card className="p-4">
      <h1>New {phase.subheader}</h1>
      <Row>
      <Col md="8 offset-2">
        <Form>
        <Form.Group>
          <Row>
          <Form.Label>Name</Form.Label>
          </Row>
          <Row>
          <Form.Control
            placeholder="Proofread article"
            name="name"
            type="text" 
            onChange={changeHandler}
          />
          </Row>
        </Form.Group>
        <Form.Group>
          <Row>
          <Form.Label>Description</Form.Label>
          </Row>
          <Row>
          <Form.Control
            placeholder="Last read-through of Heather Love's article before publication"
            name="description"
            type="text" 
            onChange={changeHandler}
          />
          </Row>
        </Form.Group>
        <Form.Group>
          <Row>
        <Form.Label>Deadline</Form.Label>
        </Row>
        <Row>
        <DatePicker name="deadline" selected={deliverable.deadline != null ? deliverable.deadline : today} onChange={handleDeadlineChange} className="form-control"/>
        </Row>
        <Row>
        <Button variant="primary" className="form-control my-4 purple" onClick={()=> submitHandler(deliverable)}>Save</Button>
        </Row>
        </Form.Group>
        </Form>
      </Col>
      </Row>
      </Card>
      </Container>
    </div>
  )
}

export default AddDeliverable