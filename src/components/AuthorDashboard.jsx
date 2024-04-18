import React, { useEffect, useState } from 'react';
import { CreateCdnCourse } from './CreateCdnCourse';
import axios from 'axios';
import { base_url, base_adobe_url } from './AppConfig';
import AllCourses from './AllCources';
import { Header } from './Header';

// userId=23175045&locale=en_US&authToken=natext_3de011182daf467bbd8fe8defc1f44fe
const AuthorDashboard = () => {
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const authToken = urlParams.get('authToken');
      
      if (userId && authToken) {
          localStorage.setItem('userId', userId);
          localStorage.setItem('token', authToken);
      }
        return () => {
          localStorage.removeItem('userId');
          localStorage.removeItem('token');
      };
    }, []);
  return (
    <>
    <Header/>
    <div className="container" style={{width: '85%', margin: '0 auto'}}>
    <h2 style={{color: '#333', fontSize: '22px', marginTop: '0', fontWeight: "600"}}>Author Dashboard</h2>
    <div className="user-info" style={{backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginTop: '10px'}}>
        <AllCourses/>
    </div>
</div>
</>
  )
}

export default AuthorDashboard