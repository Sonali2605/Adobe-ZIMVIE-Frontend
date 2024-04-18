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
     width: "70%",
     borderRadius: "15px",
     padding: "20px 20px 0px 20px "
  },
};

const CourseQuestion = ({ courseId, courseName, addQuestion, show, onHide, closeQuestion }) => {
  const [questions, setQuestions] = useState([{ question: '',answer: '' }]);
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin") === null ? false : localStorage.getItem("isLogin"));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!isLogin) {
          const response = await axios.get(`${base_url}/getQuestionsByCourseId?courseId=${courseId}`);
          const existingQuestions = response.data.questions;
          setQuestions(existingQuestions.map(question => ({
            question: question.text,
            answer: ''
          })));
        } else {
          const response = await axios.get(`${base_url}/getUserQuestions?courseId=${courseId}&email=${localStorage.getItem("Useremail")}`);
          console.log("&&&&&&&&&&&&&", response)
          if(response.data.message ==="User data not found"){
            const response = await axios.get(`${base_url}/getQuestionsByCourseId?courseId=${courseId}`);
          const existingQuestions = response.data.questions;
          setQuestions(existingQuestions.map(question => ({
            question: question.text,
            answer: ''
          })));
          } else {
          const existingQuestions = response.data.questions;
          setQuestions(existingQuestions.map(question => ({
            question: question.text,
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
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = value;
    setQuestions(newQuestions);
  };

  // const handleOptionChange = (index, optionType, value) => {
  //   const newQuestions = [...questions];
  //   if (optionType === 'true') {
  //     newQuestions[index].true = value;
  //     newQuestions[index].answer = 'true';
  //   } else {
  //     newQuestions[index].false = value;
  //     newQuestions[index].answer = 'false';
  //   }
  //   setQuestions(newQuestions);
  // };

  const handleSubmit = async () => {
    try {
      if (password !== confirmpassword) {
        setErrorMessage("Passwords don't match");
        return;
      }
      const payload = {
        email:email === "" ? localStorage.getItem("Useremail"): email,
        name : name === "" ? localStorage.getItem("name"): name,
        courseId: courseId,
        courseName: courseName,
        questions: questions.map(({ question,answer  }) => ({
          text: question,
          selectedAnswer: answer
        }))
      };

      // Send POST request to the backend server
      const response = await axios.post(`${base_url}/storeUserQuestions`, payload);
      // Handle response from the server
      console.log('Response from server:', response.data);

      // Clear form fields after successful submission
      setQuestions([{password:'', question: '', answer: '' }]);
      onHide(response.data.message);
      if(email !== ""){
        localStorage.setItem("Useremail",email);
        localStorage.setItem("name",name);
        setQuestions([{email:'', name: '',}])
      }
      localStorage.setItem("isLogin",true);
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

  console.log(")))))))))))))))))",questions)
  return (
    <>
      <div>

        <Modal
          isOpen={modalIsOpen}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ padding: "0px 13px 13px 13px" }}>
              <div className="modal-header mb-4" style={{ borderBottom: "1px solid #d5d5d5"}}>
                <h5 className="modal-title mb-2"><b>Course Registration</b></h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeQuestion}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{height: "300px"}}>
                <div className='row'>
                  {questions && questions.length && questions[0].question !== "" ?
                  <>
                    {!isLogin &&
                    <div className='col-5' style={{borderRadius: "10px",  padding: "12px 20px", border: "1px solid #d5d5d5"}}>
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="name" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <input type="password" className="form-control" id="confirmpassword" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input type="company" className="form-control" id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
                      </div>
                      
                      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            </div>
                      }
                  <div className={`col-${isLogin ? '12' : '7'} overflow-y-scroll`}  style={{ height: "auto", maxHeight: "372px", padding: "2px 20px", }}>
                    {questions.map((question, index) => (
                      <div key={index}>
                        <form>
                          <div className="form-group" style={{display:"flex", justifyContent:"left"}}>
                            <div style={{margin:"auto"}}>
                            {index+1}. 
                            </div>
                              <label className="form-control" id={`question-${index}`} value={question.question} style={{borderColor:"transparent"}}>{question.question}</label>
                             {/* <input type="text" className="form-control" id={`question-${index}`} value={question.question} onChange={(e) => handleQuestionChange(index, e.target.value)} disabled  style={{backgroundColor:"transparent"}}/> */}
                          </div>
                          <div className="form-group d-flex">                     
                            <input type="text" className="form-control" id={`answer-${index}`} placeholder="Answer here" value={question.answer} onChange={(e) => handleAnswerChange(index, e.target.value)} style={{ marginLeft: '22px', marginTop: '3px' }} />
                            </div>
                        </form>
                      </div>
                    ))}
                  </div>
                  </>
                  :  <div style={{ textAlign: "center", marginTop: "13%" }}><b>Sorry, no questions available right now. Check back later !!</b></div> }
                </div>
              </div>
              {questions && questions.length && questions[0].question !== "" &&
              <div className="modal-footer justify-content-center" style={{marginTop:"10%"}}>
                <button style={{ borderRadius: "25px", width: "40%", background: "#172142", color: "white", marginTop:"100%" }} type="button" className="btn text-center mt-4" onClick={handleSubmit}>Submit</button>
              </div>
              }
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default CourseQuestion;
