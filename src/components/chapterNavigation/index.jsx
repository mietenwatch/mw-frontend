import React from 'react';
import Link from 'gatsby-link';
import styles from './chapterNavigationStyles.module.scss';

export default ({ current }) => (
  <ul className={styles.chapterNavigation}>
    <li className={current === '1' ? styles.current : null}>
      <Link to="/leistbarkeit">Leistbarkeit</Link>
    </li>
    <li className={current === '2' ? styles.current : null}>
      <Link to="/wohnen-als-ware">Wohnen als Ware</Link>
    </li>
    <li className={current === '3' ? styles.current : null}>
      <Link to="/antworten">Antworten</Link>
    </li>
  </ul>
);
