import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import s from './QuestTaking.module.scss';

const QuestTaking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    axios
      .get(`/quests/${id}`)
      .then(res => {
        setQuiz(res.data);
        setStartTime(Date.now());
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleAnswerChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const calculateCorrectAnswers = () => {
    let count = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.correctAnswer || [];

      if (!userAnswer) return;

      if (question.type === 'text') {
        if (correctAnswer.includes(userAnswer)) {
          count++;
        }
      } else if (question.type === 'single') {
        if (correctAnswer.includes(userAnswer)) {
          count++;
        }
      } else if (question.type === 'multiple') {
        const userArray = Array.isArray(userAnswer) ? userAnswer : [];
        const correctArray = Array.isArray(correctAnswer) ? correctAnswer : [];
        const isCorrect =
          correctArray.length === userArray.length &&
          correctArray.every(answer => userArray.includes(answer));
        if (isCorrect) {
          count++;
        }
      }
    });
    return count;
  };

  const handleSubmit = () => {
    const endTime = Date.now();
    const time = Math.round((endTime - startTime) / 1000);
    setTimeTaken(time);

    const correct = calculateCorrectAnswers();
    setCorrectCount(correct);

    axios
      .post('/results', {
        quizId: id,
        answers,
        timeTaken: time,
        correctCount: correct,
      })
      .then(() => {
        setCompleted(true);
      })
      .catch(err => console.log(err));
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className={s.wrapper}>
      <h1 className={s.mainText}>{quiz.title}</h1>
      <p className={s.quizDescription}>{quiz.description}</p>

      {!completed ? (
        <>
          {quiz.questions.map((q, index) => (
            <div key={index} className={s.question}>
              <p className={s.label}>
                Question {index + 1}. {q.text}
              </p>

              {q.type === 'text' && (
                <input
                  type="text"
                  className={s.titleInput}
                  value={answers[index] || ''}
                  onChange={e => handleAnswerChange(index, e.target.value)}
                />
              )}
              <div className={s.choice}>
                {q.type === 'single' &&
                  q.choices.map((choice, cIndex) => (
                    <label key={cIndex} className={s.radioInput}>
                      <input
                        type="radio"
                        className={s.input}
                        name={`question-${index}`}
                        value={choice}
                        checked={answers[index] === choice}
                        onChange={() => handleAnswerChange(index, choice)}
                      />
                      {choice}
                    </label>
                  ))}

                {q.type === 'multiple' &&
                  q.choices.map((choice, cIndex) => (
                    <label key={cIndex} className={s.radioInput}>
                      <input
                        type="checkbox"
                        className={s.input}
                        value={choice}
                        checked={answers[index]?.includes(choice) || false}
                        onChange={e => {
                          const selected = answers[index] || [];
                          if (e.target.checked) {
                            handleAnswerChange(index, [...selected, choice]);
                          } else {
                            handleAnswerChange(
                              index,
                              selected.filter(c => c !== choice)
                            );
                          }
                        }}
                      />
                      {choice}
                    </label>
                  ))}
              </div>
            </div>
          ))}

          <button className={s.buttonAdd} onClick={handleSubmit}>
            Submit Answers
          </button>
        </>
      ) : (
        <div className={s.answers}>
          <h2 className={s.mainText}>Quiz Completed!</h2>
          <p className={s.quizDescription}>Time Taken: {timeTaken} seconds</p>
          <p className={s.quizDescription}>
            Correct Answers: {correctCount} of {quiz.questions.length}
          </p>
          <h3 className={s.label}>Your Answers:</h3>
          {quiz.questions.map((q, index) => (
            <p key={index} className={s.quizDescription}>
              <span>Question {index + 1}</span>&nbsp;&nbsp;
              {q.text}: <strong>{JSON.stringify(answers[index])}</strong>
            </p>
          ))}
          <button className={s.buttonAdd} onClick={() => navigate('/catalog')}>
            Back to Catalog
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestTaking;
