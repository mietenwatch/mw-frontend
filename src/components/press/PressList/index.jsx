import React from 'react';
import styles from './pressList.module.scss';

export default ({ children }) => (
  <section className={styles.pressList}>
    <h2>Mietenwatch in der Presse</h2>
    <ul className={styles.pressList__items}>{children}</ul>
  </section>
);
