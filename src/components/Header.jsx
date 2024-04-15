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
    alignItems: 'center',
    justifyContent: 'center', // Center the items horizontally
    padding: '1rem',
    borderBottom: '1px solid #ccc',
  };
  
  const logoStyle = {
    width: '15%', // Adjust the width as needed
    height: 'auto', // Maintain aspect ratio
    marginRight: '1rem',
  };
  
  const titleStyle = {
    margin: 0,
  };
  