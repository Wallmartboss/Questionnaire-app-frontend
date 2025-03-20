import { Link } from 'react-router-dom';
import s from './Navbar.module.scss';

const Navbar = () => {
  return (
    <nav className={s.navbar}>
      <ul className={s.navList}>
        <li>
          <Link to="/welcome" className={s.navLink}>
            Home
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
