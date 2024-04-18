import React, { useEffect, useState } from 'react';
import { CreateCdnCourse } from './CreateCdnCourse';
import axios from 'axios';
import { base_url, base_adobe_url } from './AppConfig';
import AllCourses from './AllCources';
import { Header } from './Header';
import CourseList from './Courselist';
import LearningList from './LearningList';

// userId=23175045&locale=en_US&authToken=natext_3de011182daf467bbd8fe8defc1f44fe
const LearnerDashboard = () => {
  return (
    <>
    <Header/>
    <div className="container" style={{width: '85%', margin: '0 auto'}}>
      {localStorage.getItem("isLogin") && (
    <h2 style={{color: '#333', fontSize: '22px', marginTop: '0', fontWeight: "600"}}>Learner Dashboard</h2>
      )}
    <div className="user-info" style={{backgroundColor: '#fff', padding: '0px 20px', borderRadius: '8px'}}>
    {localStorage.getItem("isLogin") && (
      <>
      <LearningList/>
        <div style={{ margin:"35px 25px", borderBottom:"1px solid grey"}}></div>
      </>
    )}
        <CourseList/>
    </div>
</div>
</>
  )
}

export default LearnerDashboard