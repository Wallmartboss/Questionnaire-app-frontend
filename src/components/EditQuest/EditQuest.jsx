import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuestionInput from '../QuestionInput/QuestionInput';
import s from '../../pages/QuestBuilder/QuestBuilder.module.scss';
import Navbar from '../Navbar/Navbar';
const EditQuest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    questions: [],
  });

  useEffect(() => {
    axios
      .get(`/quests/${id}`)
      .then(res => {
        const fetchedQuiz = res.data;
        const transformedQuestions = fetchedQuiz.questions.map(question => ({
          ...question,
          correctAnswers: question.correctAnswer || [],
        }));
        setQuiz({
          ...fetchedQuiz,
          questions: transformedQuestions,
        });
      })
      .catch(error => console.error('Error loading quiz:', error));
  }, [id]);

  const handleChange = e => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const addQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          type: 'text',
          choices: [''],
          correctAnswer: [],
          correctAnswers: [],
        },
      ],
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field] = value;
    setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].choices[choiceIndex] = value;
    setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleAddChoice = index => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index].choices.push('');
    setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleRemoveQuestion = index => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveChoice = (questionIndex, choiceIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].choices = updatedQuestions[
      questionIndex
    ].choices.filter((_, i) => i !== choiceIndex);
    setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const transformedQuiz = {
        ...quiz,
        questions: quiz.questions.map(({ correctAnswers, ...question }) => ({
          ...question,
          correctAnswer: Array.isArray(correctAnswers) ? correctAnswers : [],
        })),
      };
      await axios.put(`/quests/${id}`, transformedQuiz);
      navigate('/');
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  return (
    <div className={s.wrapper}>
      <Navbar />
      <h1 className={s.mainText}>Edit Quiz</h1>
      <label className={s.label}>
        Quiz title
        <input
          name="title"
          className={s.titleInput}
          value={quiz.title}
          onChange={handleChange}
        />
      </label>
      <label className={s.label}>
        Description
        <textarea
          name="description"
          className={s.descriptionInput}
          value={quiz.description}
          onChange={handleChange}
        />
      </label>
      {quiz.questions.map((q, i) => (
        <QuestionInput
          key={i}
          index={i}
          question={q}
          handleQuestionChange={handleQuestionChange}
          handleChoiceChange={handleChoiceChange}
          handleAddChoice={handleAddChoice}
          handleRemoveQuestion={handleRemoveQuestion} // Передаём функцию удаления вопроса
          handleRemoveChoice={handleRemoveChoice} // Передаём функцию удаления варианта
        />
      ))}
      <button className={s.buttonAdd} onClick={addQuestion}>
        Add Question
      </button>
      <button className={s.buttonAdd} onClick={handleSubmit}>
        Save Changes
      </button>
    </div>
  );
};

export default EditQuest;
// const EditQuest = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [quiz, setQuiz] = useState({
//     title: '',
//     description: '',
//     questions: [],
//   });

//   useEffect(() => {
//     axios
//       .get(`/quests/${id}`)
//       .then(res => {
//         const fetchedQuiz = res.data;
//         const transformedQuestions = fetchedQuiz.questions.map(question => ({
//           ...question,
//           correctAnswers: question.correctAnswer || [],
//         }));
//         setQuiz({
//           ...fetchedQuiz,
//           questions: transformedQuestions,
//         });
//       })
//       .catch(error => console.error('Error loading quiz:', error));
//   }, [id]);

//   const handleChange = e => {
//     setQuiz({ ...quiz, [e.target.name]: e.target.value });
//   };

//   const addQuestion = () => {
//     setQuiz(prev => ({
//       ...prev,
//       questions: [
//         ...prev.questions,
//         {
//           text: '',
//           type: 'text',
//           choices: [''],
//           correctAnswer: [],
//           correctAnswers: [],
//         },
//       ],
//     }));
//   };

//   const handleQuestionChange = (index, field, value) => {
//     const updatedQuestions = [...quiz.questions];
//     updatedQuestions[index][field] = value;
//     setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
//   };

//   const handleChoiceChange = (questionIndex, choiceIndex, value) => {
//     const updatedQuestions = [...quiz.questions];
//     updatedQuestions[questionIndex].choices[choiceIndex] = value;
//     setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
//   };

//   const handleAddChoice = index => {
//     const updatedQuestions = [...quiz.questions];
//     updatedQuestions[index].choices.push('');
//     setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const transformedQuiz = {
//         ...quiz,
//         questions: quiz.questions.map(({ correctAnswers, ...question }) => ({
//           ...question,
//           correctAnswer: Array.isArray(correctAnswers) ? correctAnswers : [],
//         })),
//       };
//       await axios.put(`/quests/${id}`, transformedQuiz);
//       navigate('/');
//     } catch (error) {
//       console.error('Error updating quiz:', error);
//     }
//   };

//   return (
//     <div className={s.wrapper}>
//       <Navbar />
//       <h1 className={s.mainText}>Edit Quiz</h1>
//       <label className={s.label}>
//         Quiz title
//         <input
//           name="title"
//           className={s.titleInput}
//           value={quiz.title}
//           onChange={handleChange}
//         />
//       </label>
//       <label className={s.label}>
//         Description
//         <textarea
//           name="description"
//           className={s.descriptionInput}
//           value={quiz.description}
//           onChange={handleChange}
//         />
//       </label>
//       {quiz.questions.map((q, i) => (
//         <QuestionInput
//           key={i}
//           index={i}
//           question={q}
//           handleQuestionChange={handleQuestionChange}
//           handleChoiceChange={handleChoiceChange}
//           handleAddChoice={handleAddChoice}
//         />
//       ))}
//       <button className={s.buttonAdd} onClick={addQuestion}>
//         Add Question
//       </button>
//       <button className={s.buttonAdd} onClick={handleSubmit}>
//         Save Changes
//       </button>
//     </div>
//   );
// };

// export default EditQuest;
