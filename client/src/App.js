import React, {useState, useEffect} from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { Switch, BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Navigation from './components/Navigation';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import UserProfile from './components/UserProfile'
import AddProject from './components/projects/AddProject'
import {Alert, Container} from 'react-bootstrap'
import Axios from 'axios';
import {decode} from 'jsonwebtoken'
import Project from './components/projects/Project'
import EditProject from './components/projects/EditProject';
import EditPhase from './components/phases/EditPhase';
import AddDeliverable from './components/deliverables/AddDeliverable';
import EditDeliverable from './components/deliverables/EditDeliverable';
import EditUser from './components/EditUser';
import AddOrganization from './components/organizations/AddOrganization';

const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const URL = process.env.REACT_APP_URL
function App() {
  const [ redirectId, setRedirectId] = useState('')
  const [globalError, setGlobalError] = useState(null)
  const [user, setUser] = useState(null)
  const [isAuth, setIsAuth] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [isLanding, setIsLanding] = useState(false)

  useEffect(() => {
    let mounted = true
    let token = localStorage.getItem('token');
    //if token exists
    if(!(token == null)) {
      let decodedToken = decode(token);
      //if token could not be verified
      if(!decodedToken){
        localStorage.removeItem('token')
      } else {
        getUserProfile(token)
        setIsAuth(true)
      }
    }
    setRedirect(false)
    return() => {
      mounted = false;
    }
  }, [redirect, isAuth])

  function logoutHandler(e){
    e.preventDefault();
    console.log('logged out')
    // setProjects([]);
    setGlobalError(null);
    setIsAuth(false);
    setUser(null);
    localStorage.removeItem("token");
  }

  async function loginHandler(credentials){
    try {
      let result = await Axios.post(`${URL}/auth/login`, credentials)
      localStorage.setItem('token', result.data.token)
      getUserProfile(result.data.token);
      setIsAuth(true)
      setGlobalError(null)
      
    } catch (error) {
      setIsAuth(false);
      setGlobalError(error.response.data.message)
    }
  }

  async function registerHandler(credentials){
    try {
      if(credentials.organization == ''){
        setGlobalError('Please select organization')
        return
      } else if (credentials.firstname.trim() == "" || credentials.lastname.trim() == "" || credentials.email.trim() == "" || credentials.password.trim() == ""){
        setGlobalError('Fields cannot be empty')
        return
      } else if (!emailPattern.test(credentials.email)){
        setGlobalError('Please enter valid email address')
        return
      } else if (credentials.password.length < 6){
        setGlobalError('Password must be at least 6 characters long')
        return
      }
      let result = await Axios.post(`${URL}/auth/register`, credentials);
      localStorage.setItem('token', result.data.token);
      setIsAuth(true);
      setGlobalError(null)
    } catch (error) {
      setIsAuth(false);
      setGlobalError(error.response.data.message)
    }
  };


  async function getUserProfile(token){
    try {
       //credentials will be an obj that takes email & password
      let result = await Axios.get(`${URL}/auth/user`, {
        headers: {
          "x-auth-token": token
        }
      })
      setIsAuth(true);
      // if(result.data.user.isAdmin){
      //   setIsAdmin(true)
      // }
      setUser(result.data.user)
    } catch (error) {
      // setGlobalError(error.response.data.message)
    }
  };
 
  

  return (
      <div className={isLanding ? `App purple` : `App main-theme`}>
       <Router>
          <Navigation user={user} logoutHandler={logoutHandler} isLanding={isLanding}/>
          {globalError && <Alert variant="danger">{globalError}</Alert>}
            <Switch>
            <Route exact path="/" exact render={() => <LandingPage setIsLanding={setIsLanding}/>} />
              {/* <Route exact path="/" exact render={() => isAuth ? <Redirect to="/dashboard"/> : <LandingPage setIsLanding={setIsLanding}/>} /> */}
              <Route exact path="/dashboard" render={() => isAuth ? <Dashboard user={user} setIsLanding={setIsLanding}/> : <Redirect to="/login"/>}/>
              <Route exact path="/profile" render={() => isAuth? <UserProfile user={user} setIsLanding={setIsLanding}/> : <Redirect to="/login"/>} /> 

              <Route path="/users/edit" exact render={() => 
                isAuth && redirect ? <Redirect to="/profile" /> 
                : isAuth ? <EditUser user={user} setRedirect={setRedirect} setGlobalError={setGlobalError} setIsLanding={setIsLanding}/> 
                : <Redirect to="/login"/>
              }/>
            
              <Route path="/projects/new" exact render={() => 
                isAuth && redirect ? <Redirect to="/dashboard" /> 
                : isAuth ? <AddProject user={user} setRedirect={setRedirect} setGlobalError={setGlobalError} setIsLanding={setIsLanding}/> 
                : <Redirect to="/login"/>
              }/>

               <Route path="/phases/:id" exact render={() => 
                redirect ? <Redirect to={`/projects/${redirectId}`}/>
                : isAuth ? <EditPhase user={user} setRedirect={setRedirect} setRedirectId={setRedirectId} setGlobalError={setGlobalError} setIsLanding={setIsLanding}/> 
                : <Redirect to="/login"/>
              }/>

                <Route path="/phases/:id/deliverables/new" exact render={() => 
                redirect ? <Redirect to={`/projects/${redirectId}`}/>
                : isAuth ? <AddDeliverable user={user} setRedirect={setRedirect} setRedirectId={setRedirectId} setGlobalError={setGlobalError} setIsLanding={setIsLanding}/> 
                : <Redirect to="/login"/>
              }/>

                <Route path="/organizations/new" exact render={() => 
                redirect ? <Redirect to="/organizations"/>
                : (isAuth && isAdmin) ? <AddOrganization user={user} setRedirect={setRedirect} setGlobalError={setGlobalError} setIsLanding={setIsLanding}/> 
                : <Redirect to="/login"/>
              }/>
             
              <Route path="/projects/:id/edit" exact render={() => 
                redirect ? <Redirect to={`/projects/${redirectId}`}/> 
                : isAuth ? <EditProject user={user} setRedirect={setRedirect} setRedirectId={setRedirectId} setGlobalError={setGlobalError} setIsLanding={setIsLanding}/>
                : <Redirect to="/login"/>
              }/>
               

              <Route path="/projects/:id" exact render={() => 
                isAuth && redirect ? <Redirect to="/dashboard" /> 
                : isAuth ? <Project user={user} setRedirect={setRedirect} setGlobalError={setGlobalError} setIsLanding={setIsLanding}/>
                : <Redirect to="/login"/>
              }/>

              <Route path="/deliverables/:id" exact render={() => 
                redirect ? <Redirect to={`/projects/${redirectId}`}/>
                : isAuth ? <EditDeliverable user={user} setRedirect={setRedirect} setRedirectId={setRedirectId} setGlobalError={setGlobalError} setIsLanding={setIsLanding}/> 
                : <Redirect to="/login"/>
              }/>

              <Route path="/register" exact render={() => isAuth ? <Redirect to="/dashboard"/> : <Register registerHandler={registerHandler} setGlobalError={setGlobalError} setIsLanding={setIsLanding}/>} />
              <Route path="/login" exact render={() => isAuth ? <Redirect to="/dashboard" /> : <Login loginHandler={loginHandler} setIsLanding={setIsLanding}/>} />
            </Switch>
       
        </Router>
    </div>
  );
}

export default App;
