import React, {useState, useEffect} from 'react'
import {Row, Form, Button, Alert} from 'react-bootstrap'
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


  // function toggleEditForm(e){
  //   setIsLoading(true)
  //   if(e.target.value == ""){
  //     return
  //   }
  //   console.log("index", e.target.value)
  //   setPhase(projectPhases[e.target.value])
  //   console.log('new phase', phase)
  //   setIsLoading(false)
  // }

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
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {!isLoading && 
        <div>
            <h2>Edit Phase</h2>
          <Row>
            <Form.Label>Name (e.g. Phase 1: 3 March - 14 April)</Form.Label>
          </Row>
          <Row>
            <Form.Control name="name" type="text" onChange={changeHandler} defaultValue={phase.name}/>
          </Row>
          <Row>
            <Form.Label>Subheader (e.g. Tasks)</Form.Label>
          </Row>
          <Row>
            <Form.Control name="subheader" type="text" onChange={changeHandler} defaultValue={phase.subheader}/>
          </Row>
          <Row>
            <Button variant="primary" onClick={()=> submitHandler(phase)}>Save</Button>
          </Row>
        </div>
        }
    </div>
  )
}

export default EditPhase
