import React, { useState } from 'react';
import axios from 'axios';

const AddQuestionModal = ({ courseId, addQuestion, show, onHide }) => {
  const [questions, setQuestions] = useState([{ question: '', trueOption: '', falseOption: '' }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', trueOption: '', falseOption: '' }]);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (index, optionType, value) => {
    const newQuestions = [...questions];
    if (optionType === 'true') {
      newQuestions[index].trueOption = value;
    } else {
      newQuestions[index].falseOption = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    try {
      const questionData = questions.map((question) => ({
        courseId: courseId,
        question: question.question,
        options: {
          true: question.trueOption,
          false: question.falseOption
        }
      }));
      
      // Send POST request to the backend server
      const response = await axios.post('/api/addQuestions', { questions: questionData });

      // Handle response from the server
      console.log('Response from server:', response.data);

      // Clear form fields after successful submission
      setQuestions([{ question: '', trueOption: '', falseOption: '' }]);
      onHide(); // Close the modal
    } catch (error) {
      console.error('Error adding questions:', error);
    }
  };

  return (
    <>
      {show && <div className="modal-backdrop fade show" style={{ zIndex: '1040' }}></div>}
      <div className={`modal fade ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Question</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onHide}>
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
                        <input className="form-check-input" type="radio" name={`option-${index}`} checked={question.trueOption === 'true'} onChange={() => handleOptionChange(index, 'true', 'true')} />
                        <label className="form-check-label" htmlFor={`trueOption-${index}`}>
                          True
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name={`option-${index}`} checked={question.falseOption === 'false'} onChange={() => handleOptionChange(index, 'false', 'false')} />
                        <label className="form-check-label" htmlFor={`falseOption-${index}`}>
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
              <button type="button" className="btn btn-secondary" onClick={onHide}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Add</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddQuestionModal;
