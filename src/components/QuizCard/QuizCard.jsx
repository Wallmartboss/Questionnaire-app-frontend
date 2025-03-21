import { Link } from 'react-router-dom';
import { useState } from 'react';
import s from './quizCard.module.scss';

const QuizCard = ({ quiz, handleDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const completedQuestions = quiz.questions.reduce((count, question) => {
    return (
      count +
      (question.correctAnswer && question.correctAnswer.length > 0 ? 1 : 0)
    );
  }, 0);

  return (
    <div className={s.card}>
      <h2 className={s.quizTitle}>{quiz.title}</h2>
      <p className={s.quizDescription}>{quiz.description}</p>
      <p className={s.quizDetail}>Questions: {quiz.questions.length}</p>
      <p className={s.quizDetail}>Completed Questions: {completedQuestions}</p>
      <p className={s.quizDetail}>Completions: {quiz.completions}</p>
      <div className={s.quizMenu}>
        <button className={s.buttonMenu} onClick={() => setMenuOpen(!menuOpen)}>
          ⁝
        </button>

        {menuOpen && (
          <div className={s.menuOpen}>
            <ul className={s.quizMenuList}>
              <li>
                <Link
                  to={`/quests/edit/${quiz._id}`}
                  className={s.quizMenuElement}
                >
                  Edit
                </Link>
              </li>
              <li>
                <Link to={`/quests/${quiz._id}`} className={s.quizMenuElement}>
                  Run
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className={s.buttonDelete}
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
