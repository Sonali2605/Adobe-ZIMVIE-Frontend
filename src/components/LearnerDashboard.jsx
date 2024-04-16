import React, { useEffect, useState } from 'react';
import { CreateCdnCourse } from './CreateCdnCourse';
import axios from 'axios';
import { base_url, base_adobe_url } from './AppConfig';
import AllCourses from './AllCources';
import { Header } from './Header';
import CourseList from './Courselist';

// userId=23175045&locale=en_US&authToken=natext_3de011182daf467bbd8fe8defc1f44fe
const AuthorDashboard = () => {
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        fetchAdminReport();
    }, []);

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
    <>
    <Header/>
    <div className="container" style={{width: '80%', margin: '0 auto'}}>
    <h2 style={{color: '#333', fontSize: '22px', marginTop: '0', fontWeight: "600"}}>Learner Dashboard</h2>
    <div className="user-info" style={{backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginTop: '10px'}}>
        <CourseList/>
    </div>
</div>
</>
  )
}

export default AuthorDashboard