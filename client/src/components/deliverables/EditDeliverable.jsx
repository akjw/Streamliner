import React, {useState, useEffect} from 'react'
import {Row, Form, Button, Alert, Col, Card, Container} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import Axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone'
import { Popconfirm } from 'antd';
import { DeleteFilled} from '@ant-design/icons';

const URL = process.env.REACT_APP_URL;
const now = moment();

function EditDeliverable({user, setRedirectId, setRedirect, setGlobalError, setIsLanding}) {
  const { id } = useParams()
  const [deliverable, setDeliverable] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setIsLanding(false)
    getDeliverable(id)
    return() => {
      mounted = false
    }
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
      setGlobalError('Name and description cannot be empty')
      return
    } 
    // else if (moment(info.deadline).isBefore(now)){
    //   setGlobalError('Deadline cannot be in the past')
    //   return 
    // } 
    let token = localStorage.getItem('token');
    let result = await Axios.put(`${URL}/deliverables/${id}`, info, {headers: {
      "x-auth-token": token,
    }});
    setGlobalError(null)
    setRedirect(true)
  } catch (error) {
    console.log(error)
  }
};

function cancel(){
  console.log('cancelled!')
}

async function deleteDeliverable(id) {
  try {
    await Axios.delete(`${URL}/deliverables/${id}`)
    setGlobalError(null)
    setRedirect(true)
  } catch (error) {
    console.log(error)
  }
}
 
  return (
    <div>
       {error && <Alert variant="danger">{error}</Alert>}
      {!isLoading && 
      <Container>
        <Card className="p-4">
           <div className="d-flex justify-content-end">
             <h3>
           <Popconfirm
                    title="Are you sure you want to delete this?"
                    onConfirm={()=> deleteDeliverable(id)}
                    onCancel={cancel}
                    id={id}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteFilled id={id} className="mx-2"/>
              </Popconfirm>
              </h3>
           </div>
        <h1>Edit Information</h1>
        <Row>
        <Col md="8 offset-2">
          <Form>
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
          <DatePicker name="deadline" className="mb-2 form-control" selected={moment(deliverable.deadline).toDate()} onChange={handleDeadlineChange}/>
          </Row>
          <Row>
            <Form.Label>Mark as Complete</Form.Label>
          </Row>
          <Row>
            <select onChange={changeHandler} className="form-control" name="isComplete" defaultValue={deliverable.isComplete ? true : false}>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
            </select>
          </Row>
          <Row>
            <Button variant="primary" className="form-control my-4 purple" onClick={()=> submitHandler(deliverable)}>Save</Button>
          </Row>
          {/* <Row className="mt-3">
            <Button variant="danger" className="form-control" onClick={()=> deleteDeliverable(id)}>Delete</Button>
          </Row> */}
        </Form>
        </Col>
        </Row>
        </Card>
        </Container>
        }
    </div>
  )
}

export default EditDeliverable