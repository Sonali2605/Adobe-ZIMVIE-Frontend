import axios from 'axios';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as lightBookmark } from '@fortawesome/free-regular-svg-icons';
import AddQuestionModal from './AddQuestionModal ';

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
    const token = localStorage.getItem("access_token");
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
    <div className="course-card card shadow-lg rounded-lg overflow-hidden flex flex-col" onClick={onClick}>
      <img
        className="course-image card-img-top"
        src={course?.attributes?.imageUrl}
        alt={course?.attributes?.localizedMetadata?.name || ""}
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
          <div className="text-sm text-right text-gray-600">{progress}%</div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div className="text-lg text-blue-500 font-weight-bold">
            {course?.attributes?.price ? "$ " + course?.attributes?.price : "Free"}
          </div>
          {!login && (
            <div className="text-sm text-right ">
              <span
                className="bookmark-icon ml-2"
                onClick={() => handleBookmark(course.id || '')}
              >
                <FontAwesomeIcon icon={isBookmarked ? solidBookmark : lightBookmark} />
              </span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <h5
            className="font-weight-bold text-xl mb-2 cursor-pointer overflow-hidden"
            style={{ maxHeight: '1.5em', whiteSpace: 'pre-wrap', textOverflow: 'ellipsis' }}
            title={course?.attributes?.localizedMetadata?.name}
          >
            {course?.attributes?.localizedMetadata?.name}
          </h5>
          <p
            className="text-gray-700 text-base cursor-pointer overflow-hidden"
            style={{ maxHeight: '3em', whiteSpace: 'pre-wrap', textOverflow: 'ellipsis' }}
            title={course?.attributes?.localizedMetadata?.description}
          >
            {course?.attributes?.localizedMetadata?.description}
          </p>
          <div className="d-flex justify-content-center mt-4">
            <button
              className="enroll-link btn btn-primary"
              onClick={() => EnrollHandle(course?.id || '')}
            >
              {enrollmentState}
            </button>
          </div>
        </div>
      </div>
      {/* <AddQuestionModal show={showModal} onHide={() => setShowModal(false)} courseId={course.id} /> */}
      {/* {showToast && <CustomToast message={toastMessage} onClose={() => setShowToast(false)} />} */}
    </div>
  );
};

export default CourseCard;
