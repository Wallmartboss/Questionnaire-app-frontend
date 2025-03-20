import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QuestionInput from '../../components/QuestionInput/QuestionInput';
import s from './QuestBuilder.module.scss';
import Navbar from '../../components/Navbar/Navbar';

// axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.baseURL =
  'https://questionnaire-app-backend-7clv.onrender.com/api';

const QuestBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'text',
        choices: [''],
        correctAnswer: [],
        correctAnswers: [],
      },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices[choiceIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddChoice = index => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].choices.push('');
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = index => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleRemoveChoice = (questionIndex, choiceIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices = updatedQuestions[
      questionIndex
    ].choices.filter((_, i) => i !== choiceIndex);
    setQuestions(updatedQuestions);
  };
  const handleRemoveMultiAnswer = (questionIndex, choiceIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices = updatedQuestions[
      questionIndex
    ].choices.filter((_, i) => i !== choiceIndex);
    setQuestions(updatedQuestions);
  };
  const saveQuest = () => {
    const transformedQuestions = questions.map(
      ({ correctAnswers, ...question }) => ({
        ...question,
        correctAnswer: Array.isArray(correctAnswers) ? correctAnswers : [],
      })
    );
    axios
      .post('/quests', { title, description, questions: transformedQuestions })
      .then(() => navigate('/'))
      .catch(error => console.error('Error saving quiz:', error));
  };

  return (
    <div className={s.wrapper}>
      <Navbar />
      <h1 className={s.mainText}>Create Quiz</h1>
      <label className={s.label}>
        Quiz title
        <input
          className={s.titleInput}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </label>
      <label className={s.label}>
        Description
        <textarea
          className={s.descriptionInput}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </label>
      {questions.map((q, i) => (
        <QuestionInput
          key={i}
          index={i}
          question={q}
          handleQuestionChange={handleQuestionChange}
          handleChoiceChange={handleChoiceChange}
          handleAddChoice={handleAddChoice}
          handleRemoveQuestion={handleRemoveQuestion}
          handleRemoveChoice={handleRemoveChoice}
          handleRemoveMultiAnswer={handleRemoveMultiAnswer}
        />
      ))}
      <button className={s.buttonAdd} onClick={addQuestion}>
        Add Question
      </button>
      <button className={s.buttonAdd} onClick={saveQuest}>
        Save
      </button>
    </div>
  );
};

export default QuestBuilder;
