import React, {useState} from 'react'
import {Row, Form, Button, Container, Col, InputGroup, FormControl} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import Axios from 'axios';
import moment from 'moment'

const URL = process.env.REACT_APP_URL

function AddPhase({setShowAddPhase, setError, getProject, setGlobalError}) {
  // grab project id from url
  const { id } = useParams()
  const [phase, setPhase] = useState({name: ''})


  function changeHandler(e){
    setPhase({...phase, [e.target.name]: e.target.value})
    console.log('phase val', phase)
  }

  async function submitHandler(info){
    try {
      if (info.name.trim() == ""){
        setGlobalError('Name cannot be empty')
        return
      } 
      let token = localStorage.getItem('token');
      console.log('frontend phase', phase)
      let result = await Axios.post(`${URL}/projects/${id}/phases/new`, info, {headers: {
        "x-auth-token": token,
      }});
      setShowAddPhase(false)
      setGlobalError(null)
      getProject(id)
    } catch (error) {
      console.log(error)
      // setGlobalError(error.response.data.message)
    }
  };

  return (
    <div className="d-flex justify-content-end">
    <Row>
      <Col>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>New Phase</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Phase 1: Wireframing"
            name="name"
            onChange={changeHandler}
          />
        </InputGroup>
        <Button variant="primary" className="form-control my-4 purple" onClick={()=> submitHandler(phase)}>Save</Button>
      </Col>
    </Row>
  </div>
  )
}

export default AddPhase
