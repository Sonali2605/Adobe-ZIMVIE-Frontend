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
    <div className=' justify-content-between' >
    <div className="course-card card rounded-lg overflow-hidden flex flex-col" onClick={onClick}>
      <img
        className="course-image card-img-top"
        style={{ height: "150px"}}
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
        <div className="d-flex justify-content-between">
          <div className="text-sm text-gray-600">
            {minutes}m {seconds}s
          </div>
        </div>
        <div className="py-4 flex-grow">
           <div className="font-bold text-xl mb-2 cursor-pointer overflow-hidden"
          style={{ maxHeight: '1.5em', whiteSpace: 'pre-wrap', textOverflow: 'ellipsis', fontWeight: "600" }}
          title={course?.attributes?.localizedMetadata[0]?.name}>
          {course?.attributes?.localizedMetadata[0]?.name}
        </div>
        <p
          className="text-gray-700 text-base cursor-pointer overflow-hidden"
          style={{ maxHeight: '3em', whiteSpace: 'pre-wrap', textOverflow: 'ellipsis' }}
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
