import React, {useState, useEffect} from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { Switch, BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Navigation from './components/Navigation';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import UserProfile from './components/UserProfile'
import {Alert} from 'react-bootstrap'
import Axios from 'axios';
import {decode} from 'jsonwebtoken'

const URL = process.env.REACT_APP_URL
function App() {
  // const [projects, setProjects] = useState([])
  const [globalError, setGlobalError] = useState(null)
  const [user, setUser] = useState(null)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
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
  }, [])

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
      setUser(result.data.user)
    } catch (error) {
      setGlobalError(error.response.data.message)
    }
  };
  console.log(isAuth)


  return (
    <div className="App">
       <Router>
          <Navigation user={user} logoutHandler={logoutHandler}/>
          {globalError && <Alert variant="danger">{globalError}</Alert>}
          <Switch>
            <Route exact path="/" exact render={() => isAuth ? <Redirect to="/dashboard"/> : <LandingPage />} />
            <Route exact path="/dashboard" render={() => isAuth ? <Dashboard user={user} /> : <Redirect to="/login"/>}/>
            <Route exact path="/profile" render={() => isAuth? <UserProfile /> : <Redirect to="/login"/>} /> 
            {/* <Route exact path="/users/:id" component={User}/> */}
            {/* <Route exact path="/users" component={AllUsers}/> */}
            {/* <Route path="/projects/add" exact render={() => <AddProject />} /> */}
            {/* <Route path="/projects/:id" exact component={Project} /> */}
            <Route path="/register" exact render={() => isAuth ? <Redirect to="/dashboard"/> : <Register registerHandler={registerHandler} />} />
            <Route path="/login" exact render={() => isAuth ? <Redirect to="/dashboard" /> : <Login loginHandler={loginHandler}/>} />
          </Switch>
        </Router>
    </div>
  );
}

export default App;
