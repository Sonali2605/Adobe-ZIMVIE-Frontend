import React, { useEffect, useState } from 'react';
import { CreateCdnCourse } from './CreateCdnCourse';
import { Header } from './Header';
import axios from 'axios';
import { base_url, base_adobe_url } from './AppConfig';

const LearnerDashboard = () => {
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [cpdCourses, setcpdCourses] = useState([]);
    const [almCourses, setAlmCourses] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [expandedAlm, setExpandedAlm] = useState(false);
    const [cpdHours, setCpdHours] = useState(0);
    const [almHours, setAlmHours]= useState(0);

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const authToken = urlParams.get('authToken');
      
      if (userId && authToken) {
          localStorage.setItem('userId', userId);
          localStorage.setItem('token', authToken);
          almCourcesCall();
          learnerApiCall(userId);
      }
      return () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
    };
    }, []);

    const almCourcesCall= async()=>{
      try {
        const token= localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        // Send GET request to the API endpoint
        const response = await axios.get(`${base_adobe_url}/learningObjects?page[limit]=100&filter.learnerState=completed&sort=name&filter.ignoreEnhancedLP=true`, config);
  
        // Handle success response
        console.log('ALM Response:', response.data);
        const almHours = response.data?.data?.reduce((acc, course) => acc + parseInt(course?.attributes?.duration)/3600, 0);
        setAlmHours(almHours);
        setAlmCourses(response.data.data);
      } catch (error) {
        // Handle error
        console.error('Error:', error);
      }
    }

    const learnerApiCall= async(userId)=>{
      try {
        // Send GET request to the API endpoint
        const response = await axios.get(`${base_url}/userReport?user_id=${userId}`);
  
        // Handle success response
        console.log('Response:', response.data);
        setcpdCourses(response.data);
        const cpdHours = response.data?.courses?.reduce((acc, course) => acc + parseInt(course.totalhours), 0);
        setCpdHours(cpdHours);
      } catch (error) {
        // Handle error
        console.error('Error:', error);
      }
    }
    const toggleModel =async()=>{
        setIsModelOpen(!isModelOpen);
    }
    const toggleExpanded = () => {
      setExpanded(!expanded);
    };
    const toggleExpandedAlm = () => {
      setExpandedAlm(!expandedAlm);
    };
    return (
        <div className="container">
            <Header />
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <h2>Learner Dashboard</h2>
              <button className="btnModel mt-5" onClick={toggleModel}> Add CPD</button>
            </div>
            {isModelOpen && <CreateCdnCourse closeModal={toggleModel} />}
            <div className="user-info">
                <h3 style={{fontWeight:"400", fontSize:"22px", marginTop:"0px"}}>User Course Information</h3>
                <p className="mainInfo"><strong>Name:</strong> {cpdCourses?.user?.fullname}</p>
                <p className="mainInfo"><strong>Email:</strong> {cpdCourses?.user?.email}</p>
                <button className={`btn ${expanded ? 'expanded accordianCollapse' : ''}`} onClick={toggleExpanded}>
                  CPD Courses <span style={{fontSize:"10px"}}>({cpdHours} Hours)</span>
                  <span className={`arrow ${expanded ? 'expanded' : ''}`}></span>
                </button>
                            
                {cpdCourses?.courses?.length && expanded ? (
                    <div style={{marginBottom:"10px"}}>
                        <h5>CPD Courses</h5>
                        <table className="table">
                            <thead>
                                <tr>
                                <th style={{ width: '45%' }}>Title</th>
            <th style={{ width: '15%' }}>Date</th>
            <th style={{ width: '15%' }}>Hours Spent</th>
            <th style={{ width: '15%' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cpdCourses?.courses?.map((course, index) => (
                                    <tr key={index}>
                                        <td style={{ width: '45%' }}>{course?.title}</td>
                                        <td style={{ width: '15%' }}>{new Date(course?.date).toISOString().split('T')[0]}</td>
                                        <td style={{ width: '15%' }}>{course?.totalhours}</td>
                                        <td style={{ width: '15%' }}>Completed</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ):expanded &&(<div  className="noData">No Courses Found</div>)}
                <button className={`btn ${expandedAlm ? 'expanded accordianCollapse' : ''}`}  onClick={toggleExpandedAlm}>
                    ALM Courses <span style={{fontSize:"10px"}}>({almHours} Hours)</span>
                    <span className={`arrow ${expandedAlm ? 'expanded ' : ''}`}></span>
                </button>
                
              {almCourses.length &&expandedAlm ? (
                <div>
                    <h5>ALM Courses</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '60%' }}>Title</th>
                                <th style={{ width: '15%' }}>Completion Date</th>
                                <th style={{ width: '15%' }}>Hours Spent</th>
                                <th style={{ width: '15%' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {almCourses?.map((course, index) => (
                                <tr key={index}>
                                    <td style={{ width: '45%' }}>{course?.attributes?.localizedMetadata[0].name}</td>
                                    <td style={{ width: '15%' }}>{new Date(course?.attributes?.effectiveModifiedDate).toISOString().split('T')[0]}</td>
                                    <td style={{ width: '15%' }}>{(course?.attributes?.duration)/3600}</td>
                                    <td style={{ width: '15%' }}>Completed</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ): expandedAlm &&(<div className="noData">No Cources Found</div>)}
            </div>
        </div>
    )
}

export default LearnerDashboard;
