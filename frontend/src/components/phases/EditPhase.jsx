import React, {useState, useEffect} from 'react'
import {Row, Form, Button, Alert, Col, InputGroup, FormControl} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import Axios from 'axios';

const URL = process.env.REACT_APP_URL

function EditPhase({user, setRedirectId, setRedirect}) {
  const { id } = useParams()
  const [phase, setPhase] = useState({})
  // const [toggleForm, setToggleForm] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPhase(id)
  }, [isLoading])

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

  function changeHandler(e){
    setPhase({...phase, [e.target.name]: e.target.value})
    console.log('phase val', phase)
  }

 async function submitHandler(info){
  try {
    if (info.name.trim() == ""){
      setError('Name cannot be empty')
      return
    } 
    else if (info.subheader.trim() == ""){
      setError('Subheader cannot be empty')
      return
    } 
    let token = localStorage.getItem('token');
    let result = await Axios.put(`${URL}/phases/${phase._id}`, info, {headers: {
      "x-auth-token": token,
    }});
    setRedirectId(phase.project)
    setRedirect(true)
  } catch (error) {
    console.log(error)
  }
};
 


  return (
    <div className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <h1>Phase Details</h1>
      {!isLoading && 
      <Row>
        <Col md="6 offset-3">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Name</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            defaultValue={phase.name}
            name="name"
            onChange={changeHandler}
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Subheader</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            defaultValue={phase.subheader}
            name="subheader"
            onChange={changeHandler}
          />
        </InputGroup>
        <Button variant="primary" className="form-control mt-4" onClick={()=> submitHandler(phase)}>Save</Button>
        </Col>
      </Row>
        }
    </div>
  )
}

export default EditPhase
