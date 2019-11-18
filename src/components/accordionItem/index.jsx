import React from 'react';
import styles from '../accordion/accordion.module.scss';

export default ({ buttonText, children }) => (
  <details className={styles.accordion__item}>
    <summary className={styles.accordion__heading}>{buttonText}</summary>
    <p>{children}</p>
  </details>
);
