import axios from 'axios';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as lightBookmark } from '@fortawesome/free-regular-svg-icons';

const CourseCard = ({ course, EnrollHandle, login, onClick  }) => {
  // Calculate progress percentage
  const progress = course.progressPercentage || 0;
  // Calculate duration in minutes and seconds
  const durationInSeconds = course.attributes?.duration || 0;
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;

  // Get enrollment state
  let enrollmentState = "Explore";
  if (course.id && course.state) {
    if (course.state === "COMPLETED")
      enrollmentState = "Completed";
    else
      enrollmentState = "Enrolled"
  }

  // State for bookmark status
  const [isBookmarked, setIsBookmarked] = useState(course.attributes.isBookmarked);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  // const [showModal, setShowModal] = useState(false); 

  // const handleCardClick = () => {
  //   setShowModal(true); 
  // };

  // Function to handle bookmarking
  const handleBookmark = async (courseId) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `oauth ${token}` },
    };
    const bookmarkUrl = `https://learningmanager.adobe.com/primeapi/v2/learningObjects/${courseId}/bookmark`;

    try {
      if (isBookmarked) {
        // Remove bookmark
        await axios.delete(bookmarkUrl, config);
        setToastMessage('Bookmark removed successfully');
      } else {
        // Add bookmark
        await axios.post(bookmarkUrl, {}, config);
        setToastMessage('Bookmark added successfully');
      }
      // Toggle bookmark status
      setIsBookmarked(!isBookmarked);
      setShowToast(true);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <div className='justify-content-between' >
    <div className="course-card card rounded-lg overflow-hidden" style= {{height:"360px"}}onClick={onClick}>
      <img
        className="course-image card-img-top"
        style={{ height: "180px", minHeight: "180px"}}
        src={course?.attributes?.imageUrl}
        alt={course?.attributes?.localizedMetadata[0]?.name || ""}
      />
      {enrollmentState !== "Explore" && (
        <div className="progress">
          <div
            className="progress-bar bg-primary"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      )}
      <div className="card-body">
        <div className="font-bold text-xl cursor-pointer overflow-hidden"
          style={{  whiteSpace: 'pre-wrap', textOverflow: 'ellipsis', fontWeight: "600", height: "50px"
        }}
          title={course?.attributes?.localizedMetadata[0]?.name}>
          {course?.attributes?.localizedMetadata[0]?.name}
        </div>
        <div className="py-3 flex-grow">
        <div className="d-flex justify-content-between">
          <div className="text-sm text-gray-600 mb-3 ml-3" style ={{fontSize:"12px",fontWeight: "600",marginLeft:"5px"}}>
            {minutes}m {seconds}s
          </div>
        </div>
        <p
          className="text-gray-700 text-base cursor-pointer overflow-hidden"
          style={{ maxHeight: '3em', whiteSpace: 'pre-wrap', textOverflow: 'ellipsis' , fontSize:"13px",fontWeight: "400",marginLeft:"5px"}}
          title={course?.attributes?.localizedMetadata[0]?.description}
        >
          {course?.attributes?.localizedMetadata[0]?.description}
        </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CourseCard;
