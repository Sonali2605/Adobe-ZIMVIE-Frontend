import React from 'react';
import logo from '/logo.png'; // Replace './logo.png' with the path to your logo image file

export const Header = () => {
  // Check if the URL contains '/learner' and 'Useremail' exists in localStorage
  const isLoggedIn = window.location.pathname.includes('/learner') && localStorage.getItem('Useremail');

  return (
    <header style={headerStyle}>
      <img src={logo} alt="Logo" style={logoStyle} />
      {isLoggedIn && (
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      )}
    </header>
  );
};

// Function to handle logout
const handleLogout = () => {
  localStorage.removeItem("Useremail");
    localStorage.removeItem('isLogin');
    window.location.reload();
    window.location.reload()
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  borderBottom: '1px solid #ccc',
  backgroundColor: 'white',
  marginBottom: '25px',
  height: '99px'
};

const logoStyle = {
  width: '148px', // Adjust the width as needed
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
