import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';
import QuestionInput from '../../components/QuestionInput/QuestionInput';
import s from '../../pages/QuestBuilder/QuestBuilder.module.scss';
import Navbar from '../Navbar/Navbar';

const SortableQuestion = ({
  question,
  index,
  handleRemoveQuestion,
  handleQuestionChange,
  handleAddChoice,
  handleRemoveChoice,
  handleChoiceChange,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `question-${question.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start">
      <button
        {...listeners}
        {...attributes}
        className="mr-2 mt-2 text-gray-500 hover:text-gray-700 cursor-grab"
      >
        ☰
      </button>
      <QuestionInput
        index={index}
        question={question}
        handleQuestionChange={handleQuestionChange}
        handleChoiceChange={handleChoiceChange}
        handleAddChoice={handleAddChoice}
        handleRemoveChoice={handleRemoveChoice}
      />
      <button
        className={s.removeButton}
        onClick={() => handleRemoveQuestion(index)}
      >
        Remove Question
      </button>
    </div>
  );
};

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
        setQuiz({
          ...res.data,
          questions: res.data.questions.map(q => ({
            ...q,
            id: q.id || uuidv4(),
          })),
        });
      })
      .catch(error => console.error('Error loading quiz:', error));
  }, [id]);

  const handleChange = e => {
    setQuiz(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: uuidv4(),
          text: '',
          type: 'text',
          choices: [''],
          correctAnswers: [],
        },
      ],
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuiz(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleRemoveQuestion = index => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const onDragEnd = event => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setQuiz(prev => {
      const oldIndex = prev.questions.findIndex(
        q => `question-${q.id}` === active.id
      );
      const newIndex = prev.questions.findIndex(
        q => `question-${q.id}` === over.id
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedQuestions = [...prev.questions];
        const [movedQuestion] = reorderedQuestions.splice(oldIndex, 1);
        reorderedQuestions.splice(newIndex, 0, movedQuestion);
        return { ...prev, questions: reorderedQuestions };
      }
      return prev;
    });
  };

  const handleAddChoice = questionIndex => {
    setQuiz(prev => {
      const updatedQuestions = [...prev.questions];
      const question = updatedQuestions[questionIndex];
      if (!question.choices) {
        question.choices = [];
      }
      const updatedChoices = [...question.choices, ''];
      updatedQuestions[questionIndex] = {
        ...question,
        choices: updatedChoices,
      };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    setQuiz(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].choices[choiceIndex] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleRemoveChoice = (questionIndex, choiceIndex) => {
    setQuiz(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].choices = updatedQuestions[
        questionIndex
      ].choices.filter((_, i) => i !== choiceIndex);
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`/quests/${id}`, quiz);
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

      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={quiz.questions.map(q => `question-${q.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {quiz.questions.map((q, i) => (
            <SortableQuestion
              key={q.id}
              question={q}
              index={i}
              handleQuestionChange={handleQuestionChange}
              handleRemoveQuestion={handleRemoveQuestion}
              handleAddChoice={handleAddChoice}
              handleRemoveChoice={handleRemoveChoice}
              handleChoiceChange={handleChoiceChange}
            />
          ))}
        </SortableContext>
      </DndContext>

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
