import React, {useState, useEffect} from 'react'
import {Row, Form, Button} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import Axios from 'axios';

const URL = process.env.REACT_APP_URL

function EditPhase({projectPhases, setPhasesLoading, phasesLoading, setError, phasesNum, setPhasesNum, getProjectPhases}) {
  const { id } = useParams()
  const [phase, setPhase] = useState({})

  // useEffect(() => {
  //   getProjectPhases(id);
  // }, [])
  

//   async function getProjectPhases(){
//     try {
//      let token = localStorage.getItem('token');
//      let result = await Axios.get(`${URL}/projects/${id}/phases`, {headers: {
//        "x-auth-token": token,
//      }})
//      setProjectPhases(result.data.projects)
//      setPhasesNum(result.data.count)
//      setPhasesLoading(false);
//     } catch (error) {
//       if(error.response){
//         setError(error.response.data.message)
//       } 
//       console.log(error)
//     }
//  };

 async function submitHandler(info){
  try {
    let token = localStorage.getItem('token');
    setPhase({...phase})
    let result = await Axios.put(`${URL}/phases/${phase._id}`, info, {headers: {
      "x-auth-token": token,
    }});
    // setToggleEditView(false)
  } catch (error) {
    console.log(error)
  }
};
 
 async function deletePhase(e) {
   try {
     await Axios.delete(`${URL}/phases/${e.target.id}`)
     getProjectPhases()
   } catch (error) {
    if(error.response){
      setError(error.response.data.message)
    } 
    console.log(error)
   }
 }


  return (
    <div>
      {!phasesLoading && 
        <div>
          <Row>
            <Form.Label>Edit Phase</Form.Label>
            <Button variant="primary" onClick={()=> submitHandler(phase)}>Save</Button>
          </Row>
        </div>
        }
      
    </div>
  )
}

export default EditPhase
