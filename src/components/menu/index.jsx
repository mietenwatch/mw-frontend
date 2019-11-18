import Link from 'gatsby-link';
import React from 'react';
import styles from './menu.module.scss';

export default ({ path }) => {
  return (
    <header className={styles.header}>
      <div className={styles.menu}>
        <Link className={styles.header__logo} activeClassName="" to="/">
          Mietenwatch
        </Link>
        <div className={styles.nav}>
          <Link
            className={`${styles.nav__item} ${path === '/leistbarkeit/' &&
              styles.nav__item__leistbarkeit__active}`}
            to="/leistbarkeit/"
          >
            Leistbarkeit
          </Link>
          <Link
            className={`${styles.nav__item} ${path === '/wohnen-als-ware/' &&
              styles.nav__item__wohnenalsware__active}`}
            to="/wohnen-als-ware/"
          >
            Wohnen als Ware
          </Link>
          <Link
            className={`${styles.nav__item} ${path === '/antworten/' &&
              styles.nav__item__antworten__active}`}
            to="/antworten/"
          >
            Antworten
          </Link>
        </div>
      </div>
    </header>
  );
};
