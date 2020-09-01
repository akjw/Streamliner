import React, {useState, useEffect} from 'react'
import {Row, Form, Button, Alert} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import Axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const URL = process.env.REACT_APP_URL;
const now = moment();

function EditDeliverable({user, setRedirectId, setRedirect}) {
  const { id } = useParams()
  const [deliverable, setDeliverable] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDeliverable(id)
  }, [isLoading])


  async function getDeliverable(id){
    try {
      let result = await Axios.get(`${URL}/deliverables/${id}`)
      console.log('deliver', result.data.deliverable)
      setDeliverable(result.data.deliverable)
      setRedirectId(deliverable.project)
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
    console.log('d val', deliverable)
  }

 async function submitHandler(info){
  try {
    if (info.name.trim() == "" || info.description.trim() == ""){
      setError('Name and description cannot be empty')
      return
    } else if (moment(info.deadline).isBefore(now)){
      setError('Deadline cannot be in the past')
      return 
    } 
    let token = localStorage.getItem('token');
    let result = await Axios.put(`${URL}/deliverables/${id}`, info, {headers: {
      "x-auth-token": token,
    }});
    console.log('put', result)
    setRedirect(true)
  } catch (error) {
    console.log(error)
  }
};

async function deleteDeliverable(id) {
  try {
    await Axios.delete(`${URL}/deliverables/${id}`)
    setRedirect(true)
  } catch (error) {
    console.log(error)
  }
}
 
console.log(deliverable)


  return (
    <div>
       {error && <Alert variant="danger">{error}</Alert>}
      {!isLoading && 
        <div>
            <h2>Edit Deliverable</h2>
          <Row>
            <Form.Label>Name</Form.Label>
          </Row>
          <Row>
            <Form.Control name="name" type="text" onChange={changeHandler} defaultValue={deliverable.name}/>
          </Row>
          <Row>
            <Form.Label>Description</Form.Label>
          </Row>
          <Row>
            <Form.Control name="description" type="text" onChange={changeHandler} defaultValue={deliverable.description}/>
          </Row>
          <Row>
          <Form.Label>Deadline</Form.Label>
          </Row>
          <Row>
          <DatePicker name="deadline" selected={moment(deliverable.deadline).toDate()} onChange={handleDeadlineChange}/>
          </Row>
          <Row>
            <Form.Label>Mark as Complete</Form.Label>
          </Row>
          <Row>
            <select onChange={changeHandler} name="isComplete" defaultValue={deliverable.isComplete ? true : false}>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
            </select>
          </Row>
          <Row>
            <Button variant="primary" onClick={()=> submitHandler(deliverable)}>Save</Button>
          </Row>
          <Row className="mt-3">
            <Button variant="danger" onClick={()=> deleteDeliverable(id)}>Delete</Button>
          </Row>
        </div>
        }
    </div>
  )
}

export default EditDeliverable