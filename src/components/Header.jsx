import React from 'react';
import logo from '../../public/logo.png'; // Replace './logo.png' with the path to your logo image file

export const Header = () => {
  return (
    <header style={headerStyle}>
      <img src={logo} alt="Logo" style={logoStyle} />
    </header>
  );
};

const headerStyle = {
    display: 'flex',
    width: "100%",
    padding: '1rem',
    borderBottom: '1px solid #ccc',
    backgroundColor: 'white',
    margin: "10px 0px"
  };
  
  const logoStyle = {
    width: '20%', // Adjust the width as needed
    height: 'auto', // Maintain aspect ratio
    marginRight: '1rem',
  };
  
  const titleStyle = {
    margin: 0,
  };
  