import React, { useState, useEffect } from 'react';
import s from '../../pages/QuestBuilder/QuestBuilder.module.scss';
// import { v4 as uuidv4 } from 'uuid';

const QuestionInput = ({
  question,
  index,
  handleQuestionChange,
  handleAddChoice,
  handleRemoveQuestion,
  handleRemoveChoice,
  // handleRemoveCorrectAnswer,
  handleChoiceChange,
}) => {
  const [correctAnswers, setCorrectAnswers] = useState(
    question.correctAnswers || question.correctAnswer || []
  );
  const handleCorrectAnswerChange = (idx, value) => {
    const updatedCorrectAnswers = [...correctAnswers];
    updatedCorrectAnswers[idx] = value;
    setCorrectAnswers(updatedCorrectAnswers);
    handleQuestionChange(index, 'correctAnswers', updatedCorrectAnswers);
  };
  const handleRemoveCorrectAnswer = idx => {
    const updatedCorrectAnswers = correctAnswers.filter((_, i) => i !== idx);
    setCorrectAnswers(updatedCorrectAnswers);
    handleQuestionChange(index, 'correctAnswers', updatedCorrectAnswers);
  };

  return (
    <div className={s.questionArea}>
      <div className={s.formQuestion}>
        <span className={s.number}>{index + 1}.</span>

        <label className={s.label}>
          Question
          <input
            className={s.questionInput}
            value={question.text}
            onChange={e => handleQuestionChange(index, 'text', e.target.value)}
          />
        </label>
        <label className={s.type}>
          Type
          <select
            className={s.typeInput}
            value={question.type}
            onChange={e => handleQuestionChange(index, 'type', e.target.value)}
          >
            <option value="text">Text</option>
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
          </select>
        </label>
        <button
          className={s.removeButton}
          onClick={() => handleRemoveQuestion(index)}
        >
          Remove
        </button>
      </div>

      {(question.type === 'single' || question.type === 'multiple') && (
        <>
          {question.choices.map((choice, j) => (
            <div key={j} className={s.multiArea}>
              <label className={s.label}>
                Choice {j + 1}
                <input
                  className={s.choiceInput}
                  value={choice}
                  onChange={e => handleChoiceChange(index, j, e.target.value)}
                />
              </label>
              <button
                className={s.removeButton}
                onClick={() => handleRemoveChoice(index, j)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className={s.buttonAdd}
            onClick={() => handleAddChoice(index)}
          >
            Add Choice
          </button>
        </>
      )}
      <div className={s.questionArea}>
        {question.type === 'text' && (
          <label className={s.labelAnswer}>
            Correct Answer
            <input
              className={s.correctAnswerInput}
              value={correctAnswers[0] || ''}
              onChange={e => handleCorrectAnswerChange(0, e.target.value)}
            />
          </label>
        )}

        {question.type === 'multiple' && (
          <>
            <label className={s.labelAnswer}>
              Number of correct answers
              <input
                type="number"
                className={s.inputNumber}
                min="1"
                value={correctAnswers.length}
                onChange={e => {
                  const newLength = Number(e.target.value);
                  const newCorrectAnswers = Array.from(
                    { length: newLength },
                    (_, i) => correctAnswers[i] || ''
                  );
                  setCorrectAnswers(newCorrectAnswers);
                  handleQuestionChange(
                    index,
                    'correctAnswers',
                    newCorrectAnswers
                  );
                }}
              />
            </label>

            {correctAnswers.map((answer, i) => (
              <div key={i} className={s.multiAnswers}>
                <label className={s.label}>
                  Correct Answer {i + 1}
                  <input
                    className={s.correctAnswerInput}
                    value={answer}
                    onChange={e => handleCorrectAnswerChange(i, e.target.value)}
                  />
                </label>
                <button
                  className={s.removeButton}
                  onClick={() => handleRemoveCorrectAnswer(i)}
                >
                  Remove
                </button>
              </div>
            ))}
          </>
        )}

        {question.type === 'single' && (
          <label className={s.labelAnswer}>
            Correct Answer
            <input
              className={s.correctAnswerInput}
              value={correctAnswers[0] || ''}
              onChange={e => handleCorrectAnswerChange(0, e.target.value)}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default QuestionInput;
