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
    width: "40%",
    borderRadius: "15px",
    padding: "0px 20px 0px 20px "
  },
  
};

const AddQuestionModal = ({ courseId, addQuestion, show, onHide, closeQuestion }) => {
  const [questions, setQuestions] = useState([{ question: '', true: '', false: '' }]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${base_url}/getQuestionsByCourseId?courseId=${courseId}`);
        const existingQuestions = response.data.questions;
        setQuestions(existingQuestions.map(question => ({
          question: question.text,
          true: question.options.includes('true') ? 'true' : '',
          false: question.options.includes('false') ? 'false' : ''
        })));
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (courseId) {
      fetchQuestions();
    }
  }, [courseId]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', true: '', false: '' }]);
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
    } else {
      newQuestions[index].false = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        courseId: courseId,
        questions: questions.map(({ question }) => ({
          text: question,
          options: ["true", "false"]
        }))
      };
  
      // Send POST request to the backend server
      const response = await axios.post(`${base_url}/createCourseQuestions`, payload);
  
      // Handle response from the server
      console.log('Response from server:', response.data);
  
      // Clear form fields after successful submission
      setQuestions([{ question: '', true: '', false: '' }]);
      onHide(response.data.message); 
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
      {/* {show && <div className="modal-backdrop fade show" style={{ zIndex: '1040' }}></div>}
      <div className={`modal fade ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none', position: "absolute", left: "36%", top: "93%", height: "auto" }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Question</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeQuestion}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {questions.map((question, index) => (
                <div key={index}>
                  <form>
                    <div className="form-group">
                      <label htmlFor={`question-${index}`}>Question</label>
                      <input type="text" className="form-control" id={`question-${index}`} value={question.question} onChange={(e) => handleQuestionChange(index, e.target.value)} />
                    </div>
                    <div className="form-group">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name={`option-${index}`} checked={question.true === 'true'} onChange={() => handleOptionChange(index, 'true', 'true')} />
                        <label className="form-check-label" htmlFor={`true-${index}`}>
                          True
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name={`option-${index}`} checked={question.false === 'false'} onChange={() => handleOptionChange(index, 'false', 'false')} />
                        <label className="form-check-label" htmlFor={`false-${index}`}>
                          False
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              ))}
              <button type="button" className="btn btn-primary" onClick={handleAddQuestion}>Add Question</button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Add</button>
            </div>
          </div>
        </div>
      </div> */}
      
      <div> 
      
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {/* <div className={`modal fade ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}> */}
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content" style={{ padding: "13px"}}>
            <div className="modal-header mb-4" style={{ borderBottom: "1px solid #d5d5d5"}} >
              <h5 className="modal-title mb-2">Add Question</h5>
              <button type="button" style={{ top: "10px"}}className="close" data-dismiss="modal" aria-label="Close" onClick={closeQuestion}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className='overflow-y-scroll' style={{height: "auto",maxHeight: "300px"}}>
              {questions.map((question, index) => (
                <div key={index}>
                  <form>
                    <div className="form-group">
                      <label htmlFor={`question-${index}`}>Question</label>
                      <input type="text" className="form-control" id={`question-${index}`} value={question.question} onChange={(e) => handleQuestionChange(index, e.target.value)} />
                    </div>
                    <div className="form-group d-flex">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name={`option-${index}`} checked={question.true === 'true'} onChange={() => handleOptionChange(index, 'true', 'true')} />
                        <label className="form-check-label ms-2" htmlFor={`true-${index}`}>
                          True
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name={`option-${index}`} checked={question.false === 'false'} onChange={() => handleOptionChange(index, 'false', 'false')} />
                        <label className="form-check-label ms-2" htmlFor={`false-${index}`}>
                          False
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              ))}
              </div>
              <a type="button" className="btn text-primary mt-2" onClick={handleAddQuestion}><i class="fa-solid fa-plus"></i>Add New Question</a>
            </div>
            <div className="modal-footer justify-content-center">
              <button style={{borderRadius: "25px", width: "40%", background: "#172142", color: "white"}} type="button" className="btn text-center" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      {/* </div> */}
      </Modal>
    </div>
    </>
  );
};

export default AddQuestionModal;