import styles from './Header.module.css';
import { Header as HeaderData } from '../../lib/contentful-models';

interface HeaderProps {
  data: HeaderData;
}

const Header = ({ data }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <nav>
        <ul>
          {data.menuItems.map((item) => (
            <li key={item.label}>
              <a href={item.url}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
