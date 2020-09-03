import React, {useState, useEffect}  from 'react'
import {Row, FormControl, Card, Button, Container, InputGroup, Col} from 'react-bootstrap'
import Axios from 'axios';

const URL = process.env.REACT_APP_URL;
console.log("HERE =================",URL);



export default function Register ({setIsLanding, registerHandler}){
  const [userInfo, setUserInfo] = useState({firstname: '', lastname: '', email: '', password: '', organization: ''})
  const [organizations, setOrganizations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    getOrganizations();
    setIsLanding(false);
    setIsLoading(false);

    return()=>{
      mounted= false;
    }
   
  }, [isLoading])

  function changeHandler(e){
    setUserInfo({...userInfo, [e.target.name]: e.target.value})
    console.log(userInfo)
  }

  async function getOrganizations(){
    try {
      let result = await Axios.get(`${URL}/organizations`);
      setOrganizations(result.data.organizations)
    } catch (error) {
      console.log(error)
      // setError(error.response.data.message)
    }
  };
    return (
      <div>
         <div>
          {!isLoading &&     
          <Container className="mt-4">
    
              <h1>Register</h1>
                <Row className="h-100">
                  <Col md="6 offset-3" my="auto">
                  <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">First Name</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder="Amy"
                        name="firstname"
                        onChange={changeHandler}
                      />
                </InputGroup>
                <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Last Name</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder="Lee"
                        name="lastname"
                        onChange={changeHandler}
                      />
                </InputGroup>
                <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                          placeholder="amylee@email.com"
                          name="email"
                          onChange={changeHandler}
                        />
                  </InputGroup>
                <InputGroup className>
                        <InputGroup.Prepend>
                          <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                          placeholder="********"
                          type="password"
                          name="password"
                          onChange={changeHandler}
                        />
                  </InputGroup>
                <InputGroup className>
                        <InputGroup.Prepend>
                          <InputGroup.Text>Organization</InputGroup.Text>
                        </InputGroup.Prepend>
                        <select
                          name="organization"
                          onChange={changeHandler} className="form-control">
                          <option value="">Select your organization</option>
                        {organizations.map((organization, i) => (
                        <option key={i} value={organization._id}>{organization.name}</option>
                      ))}
                        </select>
                  </InputGroup>
                <Button variant="primary" className="form-control my-4 purple" onClick={()=> registerHandler(userInfo)}>Submit</Button>
                  </Col>
                </Row>
         
          </Container>}
        </div>
      </div>
    )
  }