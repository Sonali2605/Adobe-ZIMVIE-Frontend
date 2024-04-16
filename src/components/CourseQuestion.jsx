import { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from './AppConfig';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: "30%",
  },
};

const CourseQuestion = ({ courseId, courseName, addQuestion, show, onHide, closeQuestion }) => {
  const [questions, setQuestions] = useState([{ question: '', true: '', false: '', answer: '' }]);
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin") === null ? false : localStorage.getItem("isLogin"));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!isLogin) {
          const response = await axios.get(`${base_url}/getQuestionsByCourseId?courseId=${courseId}`);
          const existingQuestions = response.data.questions;
          setQuestions(existingQuestions.map(question => ({
            question: question.text,
            true: question.options.includes('true') ? 'true' : '',
            false: question.options.includes('false') ? 'false' : '',
            answer: 'false'
          })));
        } else {
          const response = await axios.get(`${base_url}/getUserQuestions?courseId=${courseId}&email=${localStorage.getItem("Useremail")}`);
          console.log("&&&&&&&&&&&&&", response)
          if(response.data.message ==="User data not found"){
            const response = await axios.get(`${base_url}/getQuestionsByCourseId?courseId=${courseId}`);
          const existingQuestions = response.data.questions;
          setQuestions(existingQuestions.map(question => ({
            question: question.text,
            true: question.options.includes('true') ? 'true' : '',
            false: question.options.includes('false') ? 'false' : '',
            answer: 'false'
          })));
          } else {
          const existingQuestions = response.data.questions;
          setQuestions(existingQuestions.map(question => ({
            question: question.text,
            true: question.options.includes('true') ? 'true' : '',
            false: question.options.includes('false') ? 'false' : '',
            answer: question.selectedAnswer,
          })))
        }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (courseId) {
      fetchQuestions();
    }
  }, [courseId, isLogin]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', true: '', false: '', answer: '' }]);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (index, optionType, value) => {
    const newQuestions = [...questions];
    if (optionType === 'true') {
      newQuestions[index].true = value;
      newQuestions[index].answer = 'true';
    } else {
      newQuestions[index].false = value;
      newQuestions[index].answer = 'false';
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        email:email === "" ? localStorage.getItem("Useremail"): email,
        courseId: courseId,
        courseName: courseName,
        questions: questions.map(({ question,answer  }) => ({
          text: question,
          options: ["true", "false"],
          selectedAnswer: answer
        }))
      };

      // Send POST request to the backend server
      const response = await axios.post(`${base_url}/storeUserQuestions`, payload);
      // Handle response from the server
      console.log('Response from server:', response.data);

      // Clear form fields after successful submission
      setQuestions([{password:'', question: '', true: '', false: '', answer: '' }]);
      onHide(response.data.message);
      if(email !== ""){
        localStorage.setItem("Useremail",email);
        setQuestions([{email:''}])
      }
      localStorage.setItem("isLogin",true);
     window.location.reload()
    } catch (error) {
      console.error('Error adding questions:', error);
    }
  };


  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(show);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <div>

        <Modal
          isOpen={modalIsOpen}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ padding: "13px" }}>
              <div className="modal-header">
                <h5 className="modal-title">Course Registration</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeQuestion}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className='overflow-y-scroll' style={{ height: "auto", maxHeight: "300px" }}>
                  {!isLogin &&
                    <div>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>
                    </div>
                  }
                  <div>
                    {questions.map((question, index) => (
                      <div key={index}>
                        <form>
                          <div className="form-group">
                            <label htmlFor={`question-${index}`}>Question</label>
                            <input type="text" className="form-control" id={`question-${index}`} value={question.question} onChange={(e) => handleQuestionChange(index, e.target.value)} />
                          </div>
                          <div className="form-group d-flex">
                            <div className="form-check">
                            <input className="form-check-input" type="radio" name={`option-${index}`} checked={question.answer === 'true'} onChange={() => handleOptionChange(index, 'true', 'true')} />
                              <label className="form-check-label ms-2" htmlFor={`true-${index}`}>
                                True
                              </label>
                            </div>
                            <div className="form-check">
                            <input className="form-check-input" type="radio" name={`option-${index}`} checked={question.answer === 'false'} onChange={() => handleOptionChange(index, 'false', 'false')} />
                              <label className="form-check-label ms-2" htmlFor={`false-${index}`}>
                                False
                              </label>
                            </div>
                          </div>
                        </form>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button style={{ borderRadius: "25px", width: "40%", background: "#172142", color: "white" }} type="button" className="btn text-center" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default CourseQuestion;
