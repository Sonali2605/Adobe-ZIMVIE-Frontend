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
        fetchAdminReport();
        return () => {
          localStorage.removeItem('userId');
          localStorage.removeItem('token');
      };
    }, []);

    // const fetchAdminReport = async () => {
    //     try {
    //         // Send GET request to the API endpoint to fetch admin report data
    //         const response = await axios.get(`${base_url}/adminReport`);
    //         console.log('Admin Report Response:', response.data);
            
    //         // Extract fullname, email, and total hours spent on all courses per user
    //         const usersData = response.data.map(user => ({
    //             userId: user._id,
    //             fullname: user.fullname,
    //             email: user.email,
    //             totalCpdHours: user.courses.reduce((acc, course) => acc + parseInt(course.totalhours), 0),
    //             // totalAlmHours: 0
    //         }));
    //         setUsersData(usersData);

    //         // Call another API using user ID received from the admin report API
    //         usersData.forEach(async userData => {
    //             try {
    //                 const userId = userData.userId;
    //                 // const token= "dab7ac67f5c81421c9fa6ccf83e7aeec";
    //                 const token= localStorage.getItem("token");
    //     const config = {
    //       headers: { Authorization: `Bearer ${token}` }
    //     };
    //                 const userDataResponse = await axios.get(`${base_adobe_url}/users/${userId}/enrollments?include=learningObject&page[limit]=10&sort=dateEnrolled`, config);
    //                 console.log(`User Data for User ID ${userId}:`, userDataResponse.data);
    //                 const learningObjectDurations = userDataResponse.data.included.reduce((acc, item) => acc + (item.attributes.duration)/3600, 0);
    //                 userData.totalAlmHours = learningObjectDurations;
    //                 setUsersData(usersData);
    //                 // Handle the response data here
    //             } catch (error) {
    //                 console.error(`Error fetching user data for User ID ${userId}:`, error);
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Error fetching admin report:', error);
    //     }
    // };
    const fetchAdminReport = async () => {
        try {
            const response = await axios.get(`${base_url}/adminReport`);
            console.log('Admin Report Response:', response.data);
            
            const usersData = response.data.map(user => ({
                userId: user._id,
                fullname: user.fullname,
                email: user.email,
                totalCpdHours: user.courses.reduce((acc, course) => acc + parseInt(course.totalhours), 0),
                totalAlmHours: user.almCourseDuration// Initialize total ALM hours here
            }));
            
            // Iterate over usersData to fetch ALM hours for each user
            // for (let i = 0; i < usersData.length; i++) {
            //     try {
            //         const userId = usersData[i].userId;
            //         const token = localStorage.getItem("token");
            //         const config = {
            //             headers: { Authorization: `Bearer ${token}` }
            //         };
            //         const userDataResponse = await axios.get(`${base_adobe_url}/users/${userId}/enrollments?include=learningObject&page[limit]=10&sort=dateEnrolled`, config);
            //         console.log(`User Data for User ID ${userId}:`, userDataResponse.data);
            //         const learningObjectDurations = userDataResponse.data.included.reduce((acc, item) => acc + (item.attributes.duration) / 3600, 0);
            //         usersData[i].totalAlmHours = learningObjectDurations;
            //     } catch (error) {
            //         console.error(`Error fetching user data for User ID ${userId}:`, error);
            //     }
            // }
            
            setUsersData(usersData); // Update the state after fetching ALM hours for all users
        } catch (error) {
            console.error('Error fetching admin report:', error);
        }
    };
  return (
    <div className="container">
        <Header/>
        <h2>Author Dashboard</h2>
        <div className="user-info" style={{marginTop:"10px"}}>
                <h3 style={{fontWeight:"400", fontSize:"22px", marginTop:"0px"}}>Progress Report for Learners</h3>
                <AllCourses/>
            </div>
    </div>
  )
}

export default AuthorDashboard