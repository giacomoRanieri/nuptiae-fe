import Link from 'next/link';
import { User, Upload } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.links}>
          <Link href="#welcome" className={styles.link}>Welcome</Link>
          <Link href="#story" className={styles.link}>Chi siamo</Link>
          <Link href="#details" className={styles.link}>Come arrivare</Link>
        </div>
        <div className={styles.actions}>
           <button className={styles.uploadBtn}>
            Carica foto <Upload size={14} style={{ marginLeft: 4 }} />
           </button>
           <User size={20} className={styles.userIcon} />
        </div>
      </nav>
    </header>
  );
}
