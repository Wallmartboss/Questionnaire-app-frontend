import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import QuestionInput from '../../components/QuestionInput/QuestionInput';
import s from './QuestBuilder.module.scss';
import Navbar from '../../components/Navbar/Navbar';
import { v4 as uuidv4 } from 'uuid';

// axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.baseURL =
  'https://questionnaire-app-backend-7clv.onrender.com/api';

const SortableQuestion = ({ question, index, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `question-${index}`,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <QuestionInput index={index} question={question} {...props} />
    </div>
  );
};

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
  const handleRemoveCorrectAnswer = (questionIndex, correctAnswerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswers = updatedQuestions[
      questionIndex
    ].correctAnswers.filter((_, i) => i !== correctAnswerIndex);
    setQuestions(updatedQuestions);
  };

  const onDragEnd = event => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (activeId.startsWith('question-')) {
      const oldIndex = parseInt(activeId.split('-')[1]);
      const newIndex = parseInt(overId.split('-')[1]);
      const reorderedQuestions = Array.from(questions);
      const [movedQuestion] = reorderedQuestions.splice(oldIndex, 1);
      reorderedQuestions.splice(newIndex, 0, movedQuestion);
      setQuestions(reorderedQuestions);
    } else if (activeId.startsWith('choice-')) {
      const [, , questionIndex, choiceIndex] = activeId
        .split('-')
        .map((part, i) => (i > 1 ? parseInt(part) : part));
      const [, , , newChoiceIndex] = overId
        .split('-')
        .map((part, i) => (i > 1 ? parseInt(part) : part));
      const updatedQuestions = [...questions];
      const choices = Array.from(updatedQuestions[questionIndex].choices);
      const [movedChoice] = choices.splice(choiceIndex, 1);
      choices.splice(newChoiceIndex, 0, movedChoice);
      updatedQuestions[questionIndex].choices = choices;
      setQuestions(updatedQuestions);
    } else if (activeId.startsWith('correctAnswer-')) {
      const [, , questionIndex, answerIndex] = activeId
        .split('-')
        .map((part, i) => (i > 1 ? parseInt(part) : part));
      const [, , , newAnswerIndex] = overId
        .split('-')
        .map((part, i) => (i > 1 ? parseInt(part) : part));
      const updatedQuestions = [...questions];
      const correctAnswers = Array.from(
        updatedQuestions[questionIndex].correctAnswers
      );
      const [movedAnswer] = correctAnswers.splice(answerIndex, 1);
      correctAnswers.splice(newAnswerIndex, 0, movedAnswer);
      updatedQuestions[questionIndex].correctAnswers = correctAnswers;
      setQuestions(updatedQuestions);
    }
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

      {/* <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={questions.map((_, i) => `question-${i}`)}
          strategy={verticalListSortingStrategy}
        > */}
      {questions.map((q, i) => (
        // <SortableQuestion
        <QuestionInput
          key={i}
          index={i}
          question={q}
          handleQuestionChange={handleQuestionChange}
          handleChoiceChange={handleChoiceChange}
          handleAddChoice={handleAddChoice}
          handleRemoveQuestion={handleRemoveQuestion}
          handleRemoveChoice={handleRemoveChoice}
          handleRemoveCorrectAnswer={correctAnswerIndex =>
            handleRemoveCorrectAnswer(i, correctAnswerIndex)
          }
        />
      ))}
      {/* </SortableContext> */}
      {/* </DndContext> */}

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
