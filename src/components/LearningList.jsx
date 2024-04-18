import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from './CourseCard';
import { useNavigate, useLocation } from "react-router-dom";
import { clientId, clientSecreat, refreshToken, base_adobe_url,login_url } from "./AppConfig";
import AddQuestionModal from './AddQuestionModal ';
import Modal from 'react-modal';
import CourseQuestion from './CourseQuestion';
import { base_url } from './AppConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar,faClock , faChair ,faLink,faChalkboardTeacher  } from '@fortawesome/free-solid-svg-icons';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: "none",
    backgroundColor: "none"
  },
};

const customEventStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    backgroundColor: 'none',
    width: '100%', // Adjust the width as needed
    maxWidth: '900px', // Set a maximum height for the modal content
    padding: '20px', // Add padding for better spacing
    borderRadius: '10px', // Add border radius for rounded corners
  },
};
const LearningList = () => {
  const [courses, setCourses] = useState([]);
  const [coursesDetails, setCoursesDetails] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const login = searchParams.get("login") || false;
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [message, setMessage] = useState("");
  const [buttontext, setButtonText] = useState("Enroll");

  const handleFilterChange = (filterOption) => {
    setSelectedFilter(filterOption);
  };

  useEffect(() => {
    const login = async () => {
      try {
      const client_id = "449923a1-a01c-4bf5-b7c8-2137718d6d04";
      const client_secret = "b1b22c3e-900c-4bd1-b010-daf95c01b968";
      const refresh_token = "4022c902affc1b9527820308dfd0f56d";

  
        const params = new URLSearchParams({
          client_id,
          client_secret,
          refresh_token
        });
        const url = `${login_url}/oauth/token/refresh`;
        const responseToken = await axios.post(
          `${url}`,
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const tokenData = responseToken.data;
        localStorage.setItem(
          'Learnertoken',
          tokenData.access_token
        );
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };
  
    login();
    getCoursestoExplore();
  
    return () => {
      // localStorage.removeItem('Learnertoken');
      // localStorage.removeItem('isLogin')
      // localStorage.removeItem('email')
    };
  }, []);
  

  async function getCoursestoExplore() {
    
    let enrolledCourses =[];
    try {
        if(localStorage.getItem("isLogin")){
        const responseData = await axios.get(`${base_url}/getUserDetails?email=${localStorage.getItem("Useremail")}`);
      if(responseData.data.courseIds && responseData.data.courseIds.length){    
        enrolledCourses =  responseData.data.courseIds ;
      }}
      
      console.log("enrolled courses", enrolledCourses)
      let token = localStorage.getItem("Learnertoken");
      const config = {
        headers: { Authorization: `oauth ${token}` },
      };
      const contentLocal = localStorage.getItem("selectedLanguage");
      let language;
      if (contentLocal === "en-US") {
        language = "en-US";
      } else {
        language = "en-US,fr-FR";
      }
      const response = await axios.get(
        `https://learningmanager.adobe.com/primeapi/v2/learningObjects?include=instances%2C%20instances.loResources%2Cinstances.loResources.resources&page[limit]10&filter.catalogIds=176038&sort=name&filter.learnerState=notenrolled&filter.ignoreEnhancedLP=true&language=${language}`,
        config
      );
      let result = response?.data?.data;
      if (enrolledCourses.length !== 0) {
        result = result.filter(course => enrolledCourses.includes(course.id));
      }
      let finalObj =[];
      for(let i=0;i<result.length; i++){
        let dataObj={};
        const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        dataObj.id= result[i].id;
        dataObj.courseName= result[i].attributes.localizedMetadata[0].name;
        dataObj.courseDescription= result[i].attributes.localizedMetadata[0].description;
        const instance = response.data.included.find((findData) => findData.type === 'learningObjectInstance' && findData?.id === result[i].relationships.instances?.data[0].id);
        const loResources = response.data.included.find((findData) => findData.type === 'learningObjectResource' && findData?.id === instance.relationships.loResources?.data[0].id);
        const resouces = response.data.included.find((findData) => findData.type === 'resource' && findData?.id === loResources.relationships.resources?.data[0].id);
        console.log("++++++++++++++++++++++++++++++++++++", resouces);
        dataObj.moduleName= loResources.attributes.localizedMetadata[0].name;
        dataObj.moduleDescription= loResources.attributes.localizedMetadata[0].description;
        dataObj.seatLimit= resouces.attributes.seatLimit;
        dataObj.dateStart = new Date(resouces.attributes.dateStart).toLocaleDateString('en-US', options);
        dataObj.desiredDuration = parseInt(resouces.attributes.desiredDuration)/3600;
        dataObj.instructorNames =  resouces.attributes.instructorNames;
        dataObj.location= resouces.attributes.location;
        finalObj.push(dataObj);
      }
      console.log("3333333333333333333",finalObj)
      setCoursesDetails(finalObj);
      setCourses(result);
    } catch (error) {
      console.error("Error fetching learning objects:", error);
    }
  }

  const EnrollHandle = async (cid) => {
    const course = courses.find(obj => obj?.id === cid);
    const Iid = course.relationships?.instances?.data?.[0].id;

    if (!login) {
      const token = localStorage.getItem("token");
      try {
        navigate(`/learning_object/${cid}/instance/${Iid}/isDashboard=false/isCustomer=true/login=false/detailspage`);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate(`/learning_object/${cid}/instance/${Iid}/isDashboard=false/isCustomer=true/login=true/detailspage`);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCourses = courses.filter(course =>
    course?.attributes?.localizedMetadata?.[0]?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGoToExplore = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const checkUser = async (courseId)=>{
    const response = await axios.get(`${base_url}/getUserQuestions?courseId=${courseId}&email=${localStorage.getItem("Useremail")}`);
            console.log("&&&&&&&&&&&&&", response)
            if(response.data.message ==="User data not found"){
              setShowModal(true);
            } else {
              setMessage("Course already registered");
              setShowSuccessModal(true);
          }
  }

  const SetText = async (courseId)=>{
    const response = await axios.get(`${base_url}/getUserQuestions?courseId=${courseId}&email=${localStorage.getItem("Useremail")}`);
            console.log("&&&&&&&&&&&&&", response)
            if(response.data.message ==="User data not found"){
              setButtonText("Enroll")
            } else {
              setButtonText("Enrolled")
          }
  }
  const handleCardClick = (courseId, courseName) => {

    setSelectedCourseId(courseId); 
    setSelectedCourseName(courseName);
    setShowEventModal(true);
    SetText(courseId);
    const desiredCourses = coursesDetails.filter(course => course.id === courseId);
    setCourseDetails(desiredCourses);
  };

  

  const hideQuestionModal = (message) =>{
   setShowModal(false);
   console.log("message", message)
   if(message !== undefined){
      setMessage(message)
     setShowSuccessModal(true);
   }
  }

  const closeQuestion = () => {
    setMessage("")
    setShowModal(false);
  }

  const closeConfirmation = () =>{
    setShowSuccessModal(false);
    setMessage("");
    window.location.reload();
  }

  const closeEventModal = () =>{
    setShowEventModal(false);
    if(localStorage.getItem("Useremail") !== undefined){
      checkUser(selectedCourseId)
        }  else {
          setShowModal(true);
        }
   
  }

  return (
    <>     
      <div className='mb-2'></div>
      {login ?
        <>
          <div style={{ float: 'right' }}>
            <button className="btn btn-primary mr-4" onClick={handleGoBack}>Go Back</button>
          </div>
        </>
        :
        <>
          {/* <div className="text-blue-500 mt-2" style={{ float: 'right' }}>
            <button onClick={handleGoToExplore}>{t('goToDashbaord')}</button>
          </div> */}
        </>
      }
      <div className='px-4'>
        <div style={{display: "flex", padding: "20px"}}>
          {login ?
            <span className="text-2xl font-bold mb-4" style={{width: "80%"}}> Welcome To 3Ds Learning Portal</span>
            :
            <span className="text-2xl font-bold" style={{width: "80%", fontSize: "20px", fontWeight: "600", marginLeft: "-3%"}} >My Learnings</span>
          }

          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={handleSearch}
            className="form-control mb-4"
            style={{ width: "25%", float: "right"}}
          />
        </div>
        {showModal && <CourseQuestion show={showModal} onHide={hideQuestionModal} closeQuestion={closeQuestion} courseId={selectedCourseId} courseName ={selectedCourseName} />}
        <div style={{ justifyContent: 'center' }}>
  <div className="row row-cols-3 row-cols-sm-3 row-cols-md-3 row-cols-lg-4 g-4 mx-8">
    {/* Increase the value of g-* to increase the space between cards */}
    {filteredCourses.map((course) => (
      <div key={course.id} className="col mb-4">
        <CourseCard course={course} EnrollHandle={EnrollHandle} login={login} onClick={() => handleCardClick(course.id, course?.attributes?.localizedMetadata[0]?.name)} />
      </div>
    ))}
  </div>
</div>

      </div>
      {/* Render AddQuestionModal outside of the loop */}
      {/* {showModal && <AddQuestionModal show={showModal} onHide={hideQuestionModal} closeQuestion={closeQuestion} courseId={selectedCourseId} />} */}
      {showSuccessModal && (
         <Modal
         isOpen={true}
         style={customStyles}
         contentLabel="Example Modal"
       >
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'white' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <h5>{message}</h5>
              </div>
              <div className="modal-footer justify-content-center">
                <button style={{borderRadius: "25px", width: "40%", background: "#172142", color: "white"}} type="button" className="btn text-center" onClick={closeConfirmation}>Close</button>
              </div>
            </div>
          </div>
        </div>
        </Modal>
      )}

{showEventModal && (
  <Modal
    isOpen={true}
    style={customEventStyles}
    contentLabel="Example Modal"
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header mb-4" style={{ borderBottom: '1px solid #d5d5d5' }}>
          <h5 className="modal-title mb-2"><b>Course Event Details</b></h5>
          <button type="button" style={{ top: '10px' }} className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowEventModal(false)}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <div className="modal-body-content">
           {courseDetails && (
  <div key={courseDetails[0].id} className="col mb-4">
    <h4><b>{courseDetails[0].courseName}</b></h4>
    <p className='mt-4'>{courseDetails[0].courseDescription}</p>
    <div style={{ border: '1px solid rgb(23, 33, 66)', padding: '10px', borderRadius: '5px', fontSize: '13px', color: 'rgb(23, 33, 66)' }}>
    <p  style={{fontSize:"14px"}}><b>{courseDetails[0].moduleName}</b></p>
                  <p>{courseDetails[0].moduleDescription}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <div style={{ width: '50%',display: 'flex' }}>
          <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '5px', marginTop: '2px', color: 'rgb(23, 33, 66)' }} />
          <p>{courseDetails[0].dateStart}</p>
        </div>
        <div style={{width: '50%',display: 'flex'}}>
                  <FontAwesomeIcon icon={faClock } style={{marginRight:"5px",marginTop:"2px",color:"rgb(23, 33, 66)"}}/>
                  <p>{courseDetails[0].desiredDuration} hour duration</p>
                  </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
      <div style={{ width: '50%',display: 'flex' }}>
          <FontAwesomeIcon icon={faChair} style={{ marginRight: '5px', marginTop: '2px', color: 'rgb(23, 33, 66)' }} />
          <p>{courseDetails[0].seatLimit} Seat limit</p>
        </div>
        <div style={{ width: '50%',display: 'flex' }}>
          <FontAwesomeIcon icon={faChalkboardTeacher} style={{ marginRight: '5px', marginTop: '2px', color: 'rgb(23, 33, 66)' }} />
          <p>{courseDetails[0].instructorNames[0]}</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <div style={{ width: '50%',display: 'flex' }}>
          <FontAwesomeIcon icon={faLink} style={{ marginRight: '5px', marginTop: '2px', color: 'rgb(23, 33, 66)' }} />
          <p>Link- <a href={courseDetails[0].location}>{courseDetails[0].location}</a></p>
        </div>
        <div style={{ width: '50%' }}>
          {/* Add other elements here */}
        </div>
      </div>
    </div>
  </div>
)}

            <h3></h3>
          </div>
        </div>
        <div className="modal-footer justify-content-center">
          <button style={{ borderRadius: '25px', width: '40%', background: '#172142', color: 'white' }} type="button" className="btn text-center" onClick={closeEventModal}>{buttontext}</button>
        </div>
      </div>
    </div>
  </Modal>
)}

    </>
  );
};

export default LearningList;