import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from './CourseCard';
import { useNavigate, useLocation } from "react-router-dom";
import { clientId, clientSecreat, refreshToken, base_adobe_url } from "./AppConfig";
import AddQuestionModal from './AddQuestionModal ';
import Modal from 'react-modal';

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

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const login = searchParams.get("login") || false;
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleFilterChange = (filterOption) => {
    setSelectedFilter(filterOption);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const authToken = urlParams.get('authToken');
    
    if (userId && authToken) {
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', authToken);
    }
    getCoursestoExplore();
    return () => {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    };
  }, []);

  async function getCoursestoExplore() {
    try {
      let token = localStorage.getItem("token");
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
        `https://learningmanager.adobe.com/primeapi/v2/learningObjects?page[limit]=20&filter.catalogIds=176038&sort=name&filter.learnerState=notenrolled&filter.ignoreEnhancedLP=true&language=${language}`,
        config
      );
      const result = response?.data?.data;
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

  const handleCardClick = (courseId) => {
    setSelectedCourseId(courseId); // Set the selected course ID when the card is clicked
    setShowModal(true);
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
    setMessage("")
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
      <div className='px-6'>
        <div style={{display: "flex", padding: "20px"}}>
          {login ?
            <span className="text-2xl font-bold mb-4" style={{width: "80%"}}> Welcome To 3Ds Learning Portal</span>
            :
            <span className="text-2xl font-bold" style={{width: "80%", fontSize: "20px", fontWeight: "600", marginLeft: "-3%"}} >All Courses</span>
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
        {showModal && <AddQuestionModal show={showModal} onHide={hideQuestionModal} closeQuestion={closeQuestion} courseId={selectedCourseId} />}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
  <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mx-8">
    {/* Increase the value of g-* to increase the space between cards */}
    {filteredCourses.map((course) => (
      <div key={course.id} className="col mb-4">
        <CourseCard course={course} EnrollHandle={EnrollHandle} login={login} onClick={() => handleCardClick(course.id)} />
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
    </>
  );
};

export default AllCourses;
