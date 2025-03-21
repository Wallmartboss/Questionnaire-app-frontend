import { Link } from 'react-router-dom';
import '../../css/index.css';
import s from './WelcomePage.module.css';
const welcomePage = () => (
  <div>
    <div className={s.welcomePage}>
      <div className={s.logoTitle}>
        <img src="/image/eliftech.jpg" alt="logo" className={s.logo} />
        Questionnaire
      </div>
      <p className={s.welcomeText}>Here you can create and take quizzes.</p>
      <Link to="/catalog" className={s.linkButton}>
        Catalog
      </Link>
      <Link to="/create" className={s.linkButton}>
        Create Quiz
      </Link>
    </div>
  </div>
);

export default welcomePage;
