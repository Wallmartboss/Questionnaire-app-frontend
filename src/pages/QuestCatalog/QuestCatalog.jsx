import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  const loadQuizzes = async pageNum => {
    if (loadedPages.has(pageNum)) {
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(`/quests?page=${pageNum}&limit=6`);
      const { quizzes: newQuizzes, hasMore: moreAvailable } = response.data;

      setQuizzes(prev => {
        const updatedQuizzes =
          pageNum === 1 ? newQuizzes : [...prev, ...newQuizzes];
        return updatedQuizzes;
      });

      setLoadedPages(prev => new Set(prev).add(pageNum));

      if (newQuizzes.length === 0 || !moreAvailable) {
        setHasMore(false);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasMore) {
      loadQuizzes(page);
    }
  }, [page]);

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await axios.delete(`/quests/${id}`);
        setQuizzes(prev => prev.filter(quiz => quiz._id !== id));
      } catch (error) {}
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

  return (
    <div className={s.wrapper}>
      <Navbar />
      <h1 className={s.mainText}>Quiz Catalog</h1>
      <div className={s.cards}>
        {quizzes.length === 0 ? (
          <p>No quizzes available</p>
        ) : (
          quizzes.map(quiz => (
            <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDelete} />
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

// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import s from './QuestCatalog.module.scss';
// import QuizCard from '../../components/QuizCard/QuizCard';
// import Navbar from '../../components/Navbar/Navbar';

// const QuestCatalog = () => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadedPages, setLoadedPages] = useState(new Set());

//   const loadQuizzes = async pageNum => {
//     if (loadedPages.has(pageNum)) {
//       console.log(`Page ${pageNum} already loaded, skipping...`);
//       return;
//     }

//     if (isLoading) {
//       console.log('Already loading, skipping...');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       console.log(`Loading quizzes for page ${pageNum}`);
//       const response = await axios.get(`/quests?page=${pageNum}&limit=6`);
//       const { quizzes: newQuizzes, hasMore: moreAvailable } = response.data;

//       console.log('Received data from server:', response.data);
//       console.log('New quizzes length:', newQuizzes.length);
//       console.log('Has more:', moreAvailable);

//       // Обновляем состояние
//       setQuizzes(prev => {
//         // Если это первая страница, очищаем массив
//         const updatedQuizzes =
//           pageNum === 1 ? newQuizzes : [...prev, ...newQuizzes];
//         console.log('Updated quizzes total length:', updatedQuizzes.length);
//         return updatedQuizzes;
//       });

//       // Добавляем страницу в список загруженных
//       setLoadedPages(prev => new Set(prev).add(pageNum));

//       // Проверяем, есть ли еще квизы для загрузки
//       if (newQuizzes.length === 0 || !moreAvailable) {
//         setHasMore(false);
//         console.log('No more quizzes to load');
//       }
//     } catch (error) {
//       console.error('Error loading quizzes:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Загружаем квизы при изменении страницы
//   useEffect(() => {
//     if (hasMore) {
//       loadQuizzes(page);
//     }
//   }, [page]); // Зависимость только от page

//   // Функция для удаления квиза
//   const handleDelete = async id => {
//     if (window.confirm('Are you sure you want to delete this quiz?')) {
//       try {
//         await axios.delete(`/quests/${id}`);
//         setQuizzes(prev => prev.filter(quiz => quiz._id !== id));
//         console.log(`Quiz with id ${id} deleted`);
//       } catch (error) {
//         console.error('Error deleting quiz:', error);
//       }
//     }
//   };

//   // Обработчик кнопки "Load More"
//   const handleLoadMore = () => {
//     console.log('Load more button clicked, current page:', page);
//     if (hasMore && !isLoading) {
//       setPage(prevPage => {
//         const nextPage = prevPage + 1;
//         console.log('Next page set to:', nextPage);
//         return nextPage;
//       });
//     }
//   };

//   return (
//     <div className={s.wrapper}>
//       <Navbar />
//       <h1 className={s.mainText}>Quiz Catalog</h1>
//       <div className={s.cards}>
//         {quizzes.length === 0 ? (
//           <p>No quizzes available</p>
//         ) : (
//           quizzes.map(quiz => (
//             <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDelete} />
//           ))
//         )}
//       </div>
//       {hasMore && (
//         <button
//           className={s.loadMoreButton}
//           onClick={handleLoadMore}
//           disabled={isLoading}
//         >
//           {isLoading ? 'Loading...' : 'Load More'}
//         </button>
//       )}
//     </div>
//   );
// };

// export default QuestCatalog;
