import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import s from './QuestCatalog.module.scss';
import QuizCard from '../../components/QuizCard/QuizCard';
import Navbar from '../../components/Navbar/Navbar';

const QuestCatalog = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedPages, setLoadedPages] = useState(new Set());
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const loadQuizzes = async (pageNum, reset = false) => {
    if (loadedPages.has(pageNum) && !reset) {
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(`/quests`, {
        params: {
          page: pageNum,
          limit: 6,
          sortBy,
          sortOrder,
        },
      });
      const { quizzes: newQuizzes, hasMore: moreAvailable } = response.data;

      setQuizzes(prev => {
        const existingIds = new Set(prev.map(quiz => quiz._id));
        const filteredNewQuizzes = newQuizzes.filter(
          quiz => !existingIds.has(quiz._id)
        );
        const updatedQuizzes = reset
          ? filteredNewQuizzes
          : [...prev, ...filteredNewQuizzes];

        const finalQuizzes = Array.from(
          new Map(updatedQuizzes.map(quiz => [quiz._id, quiz])).values()
        );
        return finalQuizzes;
      });

      setLoadedPages(prev => {
        const updatedPages = reset ? new Set() : new Set(prev);
        updatedPages.add(pageNum);
        return updatedPages;
      });

      if (newQuizzes.length === 0 || !moreAvailable) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setLoadedPages(new Set());
    setQuizzes([]);
    loadQuizzes(1, true);
  }, [sortBy, sortOrder]);

  useEffect(() => {
    if (hasMore) {
      loadQuizzes(page);
    }
  }, [page]);

  const handleDelete = async id => {
    console.log('Deleting quiz with ID:', id);
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await axios.delete(`/quests/${id}`);
        setQuizzes(prev => prev.filter(quiz => quiz._id !== id));
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        return nextPage;
      });
    }
  };

  const handleSortChange = e => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className={s.wrapper}>
      <Navbar />
      <h1 className={s.mainText}>Quiz Catalog</h1>

      <div className={s.sortingArea}>
        <label className={s.label}>Sort by:</label>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className={s.typeInput}
        >
          <option value="name">Name</option>
          <option value="questions">Amount of Questions</option>
          <option value="completions">Amount of Completions</option>
        </select>
        <button onClick={toggleSortOrder} className={s.sortButton}>
          {sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
        </button>
      </div>

      <div className={s.cards}>
        {quizzes.length === 0 ? (
          <p>No quizzes available</p>
        ) : (
          quizzes.map(quiz => (
            <QuizCard key={quiz._id} quiz={quiz} handleDelete={handleDelete} />
          ))
        )}
      </div>
      {hasMore && (
        <button
          className={s.loadMoreButton}
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default QuestCatalog;
