import React, { useEffect, useState } from 'react';
import logo from '/logo.png'; // Replace './logo.png' with the path to your logo image file

import { base_url } from './AppConfig';

import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

export const Header = () => {
  const [ isLoggedIn, setLoggedIn ] = useState('');
  const [ isLearner, setLearner ] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {

    const isLoggedState = localStorage.getItem('Useremail');
    const isLearner = window.location.pathname.includes('/learner')
    console.log('URL Path:', window.location.pathname);
  console.log('Useremail in Local Storage:', localStorage.getItem('Useremail'));
  console.log('isLoggedState:', isLoggedState);
  if(isLearner){
    setLearner(isLearner);
  }
    if(isLoggedState){
      setLoggedIn(isLoggedState);
    }
  }, [])
  const handleLoginSubmit = (event) => {
    event.preventDefault(); // prevent default form submission behavior
    console.log("1111111111111111", email,  password)
    try {
      checkData();

      setEmail("");
      setPassword("");
    } catch(error) {
      console.log(error)
    }
  };
  

const checkData = async()=>{
  try{
  const response = await axios.get(`${base_url}/getUserDetails?email=${email}`);
    console.log("&&&&&&&&&&&&&", response)
    if(response.data.message ==="User data not found"){      
      setErrorMessage("User not found. Please check your email and try again.");
      return
    } else {
      setErrorMessage("");
      localStorage.setItem("Useremail",response.data.email);
      localStorage.setItem("name",response.data.name);
      localStorage.setItem("isLogin",true);
      
  alert("You are now logged in.");
  // Reload page
  window.location.reload();
  }
  setShowLoginModal(false)
}catch(Error){
  console.log(Error)
}
};
  return (
    <header style={headerStyle}>
      <img src={logo} alt="Logo" style={logoStyle} />
      {isLearner && !isLoggedIn &&(
        <button  onClick={() => setShowLoginModal(true)} style={logoutButtonStyle}>Login</button>
      )}
      {isLearner && isLoggedIn && (
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      )}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered style={{ position: "absolute", left: "30%", height: "73%", top: "13%"}} >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </Modal.Body>
      </Modal>
    </header>
  );
};

// Function to handle logout
const handleLogout = () => {
  localStorage.removeItem("Useremail");
  localStorage.removeItem('isLogin');
  localStorage.removeItem('name');
  window.location.reload();
};


const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  borderBottom: '1px solid #ccc',
  backgroundColor: 'white',
  marginBottom: '25px',
  height: '70px'
};

const logoStyle = {
  width: '120px', // Adjust the width as needed
  height: 'auto', // Maintain aspect ratio
  marginRight: '1rem',
};

const logoutButtonStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '5px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
};
