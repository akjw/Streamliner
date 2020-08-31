import React, {useState} from 'react'
import {Row, Form, Button, Container} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import Axios from 'axios';

const URL = process.env.REACT_APP_URL

function AddPhase({setShowAddPhase, setError}) {
  // grab project id from url
  const { id } = useParams()
  const [phase, setPhase] = useState({})


  function changeHandler(e){
    setPhase({...phase, [e.target.name]: e.target.value})
    console.log('phase val', phase)
  }

  async function submitHandler(info){
    try {
      let token = localStorage.getItem('token');
      console.log('frontend phase', phase)
      let result = await Axios.post(`${URL}/projects/${id}/phases/new`, info, {headers: {
        "x-auth-token": token,
      }});
      setShowAddPhase(false)
      setError(null)
    } catch (error) {
      console.log(error)
      setError(error.response.data.message)
    }
  };

  return (
    <div>
      <h1>New Phase</h1>
         <div>
          <Container>
          <Row>
            <Form.Control name="name" type="text" onChange={changeHandler} placeholder="Name"/>
          </Row>
          <Row>
            <Button variant="primary" onClick={()=> submitHandler(phase)}>Save</Button>
          </Row>
          </Container>
        </div>
    </div>
  )
}

export default AddPhase
